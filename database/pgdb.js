const { camelizeKeys } = require('humps');

const withErrorHandling = (func) => async (...args) => {
  try {
    const result = await func(...args);
    return result;
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

module.exports = (pgPool) => {
  const buildQuerier = (query) => {
    return withErrorHandling(async function (...args) {
      const dbResponse = await pgPool.query(query, args);
      return camelizeKeys(dbResponse.rows);
    });
  };

  return {
    getPlayers: buildQuerier('SELECT * FROM players'),
    getTeams: buildQuerier('SELECT * FROM teams'),
    getPlayersForTeam: (team) =>
      buildQuerier('SELECT * FROM players WHERE team_id = $1')(team.id),
  };
};
