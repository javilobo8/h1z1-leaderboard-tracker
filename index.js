const axios = require('axios');
const Promise = require('bluebird');
const Table = require('cli-table');
const _ = require('lodash');

const names = [
  'metrikis',
  'brakal',
  'dtn_tv',
  'bladecito',
  'fokycs',
  'cruz_87',
  'yosu33'
];

function makeRequest(name) {
  const values = {
    pageSize: 25,
    pageNumber: 1,
    filterKey: 's2_r2_g1',
    name,
  };
  const config = {
    headers: {
      "referer": "https://www.h1z1.com/king-of-the-kill/leaderboards/pre-season-2",
    }
  };
  const url = 'https://census.daybreakgames.com/rest/leaderboard/kotk/name-search-get-page';
  const data = Object.keys(values).map((key) => `${key}=${values[key]}`).join('&')
  return axios.post(url, data, config).then(parseResponse);
}

function parseResponse(res) {
  return res.data.successPayload.rows[0];
}

function mapPlayers(players) {
  players = players.map((player) => {
    const object = player.values;
    delete object.detail;
    return Object.assign(object, {position: parseInt(player.position)});
  });
  return _.orderBy(players, ['position', 'desc']);
}

function displayResult(players) {
  const keys = ['position', 'user_name', 'top_10_total_score',
    'tier', 'subtier', 'top_kills', 'total_matches', 'total_wins' ];
  const table = new Table({head: keys});
  const tableData = players.forEach((player) => {
    table.push(keys.map((v) => player[v]));
  });
  
  console.log(table.toString())
}

function main() {
  Promise
    .all(names.map(makeRequest))
    .then(mapPlayers)
    .then(displayResult)
    .catch((err) => {
      console.error(err);
    });
}

main();