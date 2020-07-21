const { camelizeKeys } = require('humps');
const _ = require('lodash');

const withErrorHandling = (func) => async (...args) => {
  try {
    const result = await func(...args);
    // console.log('SUCCESS, result: ', result);
    return result;
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

const groupRowsByFieldValue = (rows, fieldValues, fieldName) => {
  const records = camelizeKeys(rows);
  const recordsGroupedByFieldValue = _.groupBy(records, fieldName);
  return fieldValues.map(
    (fieldValue) => recordsGroupedByFieldValue[fieldValue]
  );
};

const dearrayGroups = (groupedRecords) =>
  groupedRecords.map((group) => group && group[0]);

module.exports = (pgPool) => {
  const buildStandardQuerier = (query) => {
    return withErrorHandling(async function (...args) {
        const dbResponse = await pgPool.query(query, args);
        const records = dbResponse.rows.map((record) => camelizeKeys(record));
        return records;
    });
  };

  const buildDataLoaderQuerier = (query) => {
    return withErrorHandling(async function (
      fieldValueList,
      fieldName,
      singleRecordPerGroup
    ) {
      const dbResponse = await pgPool.query(query, [fieldValueList]);
      const records = dbResponse.rows.map((record) => camelizeKeys(record));
      const groupedRecords = groupRowsByFieldValue(
        records,
        fieldValueList,
        fieldName
      ); // array of arrays: [[{ record1 } ,{ record2 }], [{ record3}]]
      return singleRecordPerGroup
        ? dearrayGroups(groupedRecords)
        : groupedRecords;
    });
  };

  return {
    getPlayers: buildStandardQuerier('SELECT * FROM players'),
    getPlayersByName: (nameStr) =>
      buildStandardQuerier("SELECT * FROM players WHERE first_name ILIKE $1 OR last_name ILIKE $1")(
        `%${nameStr}%`
      ),
    getTeams: buildStandardQuerier('SELECT * FROM teams'),
    getTeamsByName: (nameStr) =>
      buildStandardQuerier(
        'SELECT * FROM teams WHERE city ILIKE $1 OR name ILIKE $1'
      )(`%${nameStr}%`),
    getPlayersForTeams: (teamIds) =>
      buildDataLoaderQuerier('SELECT * FROM players WHERE team_id = ANY($1)')(
        teamIds,
        'teamId'
      ),
    getOwnersForTeams: (teamIds) =>
      buildDataLoaderQuerier(
        'SELECT * FROM owners WHERE owned_team_id = ANY($1)'
      )(teamIds, 'ownedTeamId'),
    getTeamsByIds: (teamIds) =>
      buildDataLoaderQuerier('SELECT * FROM teams WHERE id = ANY($1)')(
        teamIds,
        'id',
        true
      ),
    addTeam: async (team) => {
      const existingTeam = await buildStandardQuerier(
        'SELECT * FROM teams WHERE city=$1 AND name=$2 '
      )(team.city, team.name).then((rows) => rows[0]);

      if (!existingTeam) {
        return buildStandardQuerier(
          'INSERT INTO TEAMS (city, name) VALUES ($1, $2) RETURNING *'
        )(team.city, team.name).then((rows) => rows[0]);
      } else {
        throw new Error('Team already exists');
      }
    },
    search: async function (searchStr) {
      const playerResults = await this.getPlayersByName(searchStr);
      const teamResults = await this.getTeamsByName(searchStr);
      return playerResults.concat(teamResults);
    }
  };
};
