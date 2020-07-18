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
      try {
        const dbResponse = await pgPool.query(query, args);
        const records = dbResponse.rows.map((record) => camelizeKeys(record));
        return records;
      } catch (err) {
        console.log('IORR', err);
      }
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
      console.log('JG UNGROUPED RECORDS', fieldName, fieldValueList, records)
      const groupedRecords = groupRowsByFieldValue(
        records,
        fieldValueList,
        fieldName //  [           1              ,       2    ]
      ); // array of arrays: [[{ record1 } ,{ record2 }], [{ record3}]]
      console.log('JG GROUPED RECORDS', fieldName, fieldValueList, groupedRecords)
      return singleRecordPerGroup
        ? dearrayGroups(groupedRecords)
        : groupedRecords;
    });
  };

  return {
    getPlayers: buildStandardQuerier('SELECT * FROM players'),
    getPlayersByName: (nameStr) =>
      buildStandardQuerier('SELECT * FROM players WHERE full_name ILIKE $1')(
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
    addTeam: (team) =>
      buildStandardQuerier(
        'INSERT INTO TEAMS (city, name) VALUES ($1, $2) RETURNING *'
      )(team.city, team.name).then(rows => rows[0]),
  };
};
