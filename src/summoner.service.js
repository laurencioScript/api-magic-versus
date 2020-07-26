const dalSummoner = require("./summoner.dal");
const serviceApi = require("./api.service");
const serviceMatch = require('./match.service');
let order;
exports.getSummoners = async () => {
  const summoners = await dalSummoner.getSummoners();

  return summoners;
};

exports.getSummoner = async (summonerId) => {
  return dalSummoner.getSummoner(summonerId);
};

exports.getRanking = async (param = 'wins') => {
  let dataSummoners = await dalSummoner.getSummoners();
  order = param;
  dataSummoners = await countMatch(dataSummoners);

  const summoners = [];
  for (const summoner of dataSummoners) {
    const summonerData = await serviceApi.getSummonerByName(
      summoner.summonerName
    );  

    summoners.push({
      ...summoner,
      profileIconId: summonerData.profileIconId,
      summonerLevel: summonerData.summonerLevel,
    });
  }


  summoners.sort(orderBy)

  return summoners;
};

async function countMatch(summoners){
  const matchs = await serviceMatch.getMatch();

  for (const match of matchs) {
    for (const summoner of summoners) {
      const summonerExist = match.summoners.find(summonerMatch => summonerMatch.summonerId == summoner.id);
      summoner.wins = summoner.wins ? summoner.wins : 0;
      summoner.lose = summoner.lose ? summoner.lose : 0;
      summoner.kill = summoner.kill ? summoner.kill : 0;
      summoner.death = summoner.death ? summoner.death : 0;
      summoner.assist = summoner.assist ? summoner.assist : 0;
      summoner.wins += summonerExist.wins && summonerExist.wins == 'true'  ? 1 : 0;
      summoner.lose += summonerExist.wins && summonerExist.wins == 'true'  ? 0 : 1;
      summoner.kill += +summonerExist.kill;
      summoner.death += +summonerExist.death;
      summoner.assist += +summonerExist.assist;


    }
  }
  return summoners;
}

function orderBy(a,b) {
  if (a[order] > b[order])
     return -1;
  if (a[order] < b[order])
    return 1;
  return 0;
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
