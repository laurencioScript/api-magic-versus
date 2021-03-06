const dalSummoner = require("./summoner.dal");
const serviceApi = require("./api.service");
const serviceMatch = require("./match.service");
let order;
exports.getSummoners = async () => {
  const summoners = await dalSummoner.getSummoners();

  return summoners;
};

exports.getSummoner = async (summonerId) => {
  return dalSummoner.getSummoner(summonerId);
};

exports.getRanking = async (param = "default") => {
  const dataSummoners = await countMatch();
  order = param;

  const summoners = [];
  let promises = [];

  for (const summoner of dataSummoners) {
    promises.push(serviceApi.getSummonerByName(summoner.summonerName));
  }

  promises = await Promise.all(promises);

  for (const summoner of dataSummoners) {
    const summonerData = promises.find(
      (e) => e.accountId == summoner.accountId
    );

    summoners.push({
      ...summoner,
      profileIconId: summonerData.profileIconId,
      summonerLevel: summonerData.summonerLevel,
    });
  }

  summoners.sort(orderBy);

  return summoners;
};

async function countMatch() {
  const promises = await Promise.all([
    dalSummoner.getSummoners(),
    serviceMatch.getMatch(),
  ]);
  const summoners = promises[0];
  const matchs = promises[1];

  summoners.forEach((summoner) => {
    summoner.wins = 0;
    summoner.lose = 0;
    summoner.kill = 0;
    summoner.death = 0;
    summoner.assist = 0;
  });

  for (const match of matchs) {
    for (const summoner of summoners) {
      const summonerExist = match.summoners.find(
        (summonerMatch) => summonerMatch.summonerId == summoner.id
      );
      if (summonerExist) {
        summoner.wins +=
          summonerExist.wins && summonerExist.wins == "true" ? 1 : 0;
        summoner.lose +=
          summonerExist.wins && summonerExist.wins == "true" ? 0 : 1;
        summoner.kill += +summonerExist.kill;
        summoner.death += +summonerExist.death;
        summoner.assist += +summonerExist.assist;
      }
    }
  }

  summoners.forEach((summoner) => {
    summoner.kill =
      summoner.kill > 0
        ? Math.round(summoner.kill / (summoner.wins + summoner.lose))
        : summoner.kill;
    summoner.death =
      summoner.death > 0
        ? Math.round(summoner.death / (summoner.wins + summoner.lose))
        : summoner.death;
    summoner.assist =
      summoner.assist > 0
        ? Math.round(summoner.assist / (summoner.wins + summoner.lose))
        : summoner.assist;
  });

  return summoners;
}

function orderBy(a, b) {
  if (order == "default") {
    let x =
      a.wins == 0 && a.lose == 0
        ? -Infinity
        : a.wins + a.lose + a.wins - a.lose;
    let y =
      b.wins == 0 && b.lose == 0
        ? -Infinity
        : b.wins + b.lose + b.wins - b.lose;

    if (x > y || (x == y && a.kill > b.kill)) return -1;
    if (x < y || (x == y && a.kill < b.kill)) return 1;
    return 0;
  } else {
    if (a[order] > b[order]) return -1;
    if (a[order] < b[order]) return 1;
    return 0;
  }
}

exports.createSummoner = async (summoner) => {
  if (!summoner || !summoner.userName || !summoner.summonerName) {
    throw { error: "userName or summonerName invalid" };
  }

  const summonerData = await serviceApi.getSummonerByName(
    summoner.summonerName
  );

  if (!summonerData || !summonerData.accountId) {
    throw { error: "summonerName invalid" };
  }

  summoner.accountId = summonerData.accountId;

  console.log(">>> summoner", summoner);

  return dalSummoner.createSummoner(summoner);
};
