const { camelizeKeys } = require('humps');
const _ = require('lodash');

const withErrorHandling = (func) => async (...args) => {
  try {
    const result = await func(...args);
    console.log('SUCCESS, result: ', JSON.stringify(result, null, 2));
    return result;
  } catch (err) {
    // console.log('ERROR: ', err);
    throw err;
  }
};

const orderByFieldValueList = (rows, fieldValues, fieldName, singleObject) => {
  // return the rows ordered for the fieldValues
  console.log('JG fieldValues, fieldName, singleObject', fieldValues, fieldName, singleObject);
  const records = camelizeKeys(rows);
  const recordsGroupedByFieldValue = _.groupBy(records, fieldName);
  const finalArray =  fieldValues.map((fieldValue) => {
    const keyArray = recordsGroupedByFieldValue[fieldValue];
    if (keyArray) {
      return singleObject ? keyArray[0] : keyArray;
    }
    return singleObject ? {} : [];
  });
  console.log('FINAL ARRAY', finalArray)
  return finalArray
};

module.exports = (pgPool) => {
  const buildQuerier = (query) => {
    return withErrorHandling(async function (fieldValueList, fieldName) {
      console.log('JG KEY LIST', fieldValueList);
      try {
        let dbResponse;
        if (fieldValueList && fieldValueList.length) {
          dbResponse = await pgPool.query(query, [fieldValueList]);
          return orderByFieldValueList(dbResponse.rows, fieldValueList, fieldName)
        } else {
          dbResponse = await pgPool.query(query);
          return camelizeKeys(dbResponse.rows);
        }
      } catch (err) {
        console.log('IORR', err);
      }
    });
  };

  return {
    getPlayers: buildQuerier('SELECT * FROM players'),
    getTeams: buildQuerier('SELECT * FROM teams'),
    getPlayersForTeam: (teamIds) =>
      buildQuerier('SELECT * FROM players WHERE team_id = ANY($1)')(
        teamIds,
        'teamId'
      ),
  };
};
