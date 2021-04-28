const axios = require("axios");
require('dotenv').config()

exports.getIndex = (req, res, next) => {
  res.render('index', { title: 'Enter your Steam ID', game: {} })
}

exports.postRetrieveGame = (req, res, next) => {
  let game;
  axios
    .get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${req.body.steamid}&include_appinfo=true`)
    .then(resp => {
      let games = resp.data.response.games
      game = games[Math.floor(Math.random() * games.length)]
      res.render('index', { game: game, subtitle: "You should play. . .", steamid: req.body.steamid});
    })
    .catch(err => console.log(err));
}