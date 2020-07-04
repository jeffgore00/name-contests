const { camelizeKeys } = require('humps');

module.exports = (pgPool) => {
  return {
    async getTeams() {
      console.log('jG INERERE');
      try {
        const teams = await pgPool
          .query(`select * from teams`)
          .then((res) => {
            console.log('RES', JSON.stringify(res));
            return camelizeKeys(res.rows);
          }).catch(err => {
            console.log('JG ERR', err)
          })
        return teams;
      } catch (err) {
        console.log('JG ERR ', err);
      }
    },
    getPlayersForTeam(team) {
      console.log('jG in hhhhhhhh');
      return pgPool
        .query(
          `
        select * from players
        where team_id = $1
      `,
          [team.id]
        )
        .then((res) => {
          return camelizeKeys(res.rows);
        });
    },
  };
};
