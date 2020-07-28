const dalMatch = require("./match.dal.js");
const serviceSummoner = require("./summoner.service");
const serviceApi = require("./api.service");

exports.createMatch = async (match) => {
  if (!match || !match.summoners) {
    throw { error: "summoners invalid" };
  }

  const error = match.summoners.filter((summoner) => {
    if (
      !summoner.summonerId ||
      !summoner.championId ||
      !summoner.wins ||
      !summoner.team ||
      !summoner.kill ||
      !summoner.death ||
      !summoner.assist
    ) {
      return summoner;
    }
  });

  if (error && error.length > 0) {
    {
      throw { error: "some summoner invalid" };
    }
  }

  return dalMatch.createMatch(match);
};

exports.getMatch = async () => {
  const matchsData = await dalMatch.getMatch();
  const champions = await serviceApi.getChampions();
  const matchs = [];
  for (const match of matchsData) {
    const refactorMatch = {
      summoners: [],
      observation: match.observation,
      createAt: match.createAt,
    };
    for (const summonerData of match.summoners) {
      const champion = await serviceApi.getChampion(
        champions,
        summonerData.championId
      );
      const summoner = await serviceSummoner.getSummoner(
        summonerData.summonerId
      );
      refactorMatch.summoners.push({
        ...summonerData,
        summonerName: summoner.summonerName,
        champion,
      });
    }

    matchs.push(refactorMatch);
  }

  return matchs;
};
