const { connect } = require("./../database");
const camelcaseKeys = require("camelcase-keys");

exports.createMatch = async (match) => {
  const client = connect();
  try {
    const dataQuery = await client.query(
      `INSERT INTO match(
      summoners, observation)
      VALUES ($1, $2) returning *;`,
      [JSON.stringify(match.summoners), match.observation]
    );

    return camelcaseKeys(dataQuery.rows[0]);
  } catch (error) {
    throw error;
  } finally {
    client.end();
  }
};

exports.getMatch = async () => {
  const client = connect();
  try {
    const dataQuery = await client.query(
      `select * from match order by create_at desc`
    );

    return camelcaseKeys(dataQuery.rows);
  } catch (error) {
    throw error;
  } finally {
    client.end();
  }
};
