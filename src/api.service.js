require('dotenv/config');
const axios = require("axios");
const url = "https://br1.api.riotgames.com/lol";

const key = process.env.KEY;
// interface SummonerByName {
//   id: any;
//   accountId: any;
//   puuid: any;
//   name: any;
//   profileIconId: any;
//   revisionDate: any;
//   summonerLevel: any;
// }

async function getVersion() {
  const urlQuery = `https://ddragon.leagueoflegends.com/api/versions.json`;
  const resultRequest = await axios.get(urlQuery);
  return resultRequest.data[0];
}

exports.getSummonerByName = async (summonerName) => {
  const version = await getVersion();
  const urlQuery =
    url + `/summoner/v4/summoners/by-name/${summonerName}?api_key=${key}`;

  const resultRequest = await axios.get(urlQuery);
  const summoner = resultRequest.data;
  summoner.profileIconId = `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${summoner.profileIconId}.png`;
  return summoner;
};

exports.getChampions = async () => {
  const version = await getVersion();
  const urlQuery = `http://ddragon.leagueoflegends.com/cdn/${version}/data/pt_BR/champion.json`;
  const resultRequest = await axios.get(urlQuery);
  const dataChampions = resultRequest.data;
  return Object.values(dataChampions.data).map((champion) => {
    return {
      id: champion.id,
      key: champion.key,
      name: champion.name,
      title: champion.title,
      img_loading: `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`,
      img_profile: `http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.id}.png`,
    };
  });
};

exports.getChampion = async (champions, key) => {
  return champions.find((champion) => key == champion.key);
};
