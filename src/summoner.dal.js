const { connect } = require("./../database");
const camelcaseKeys = require("camelcase-keys");

exports.createSummoner = async (summoner) => {
  const client = connect();
  try {
    const dataQuery = await client.query(
      `INSERT INTO public.summoner(
      user_name, summoner_name, account_id)
      VALUES ($1, $2, $3) returning *;`,
      [summoner.userName, summoner.summonerName, summoner.accountId]
    );

    return camelcaseKeys(dataQuery.rows[0]);
  } catch (error) {
    throw error;
  } finally {
    client.end();
  }
};

exports.getSummoners = async () => {
  const client = connect();
  try {
    const dataQuery = await client.query(
      `select * from summoner order by summoner_name desc`
    );

    return camelcaseKeys(dataQuery.rows);
  } catch (error) {
    throw error;
  } finally {
    client.end();
  }
};

exports.getSummoner = async (id) => {
  const client = connect();
  try {
    const dataQuery = await client.query(
      `select * from summoner where id = $1`,
      [id]
    );

    return camelcaseKeys(dataQuery.rows[0]);
  } catch (error) {
    throw error;
  } finally {
    client.end();
  }
};
