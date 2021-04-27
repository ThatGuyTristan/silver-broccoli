const axios = require("axios");
require('dotenv').config()

exports.getIndex = (req, res, next) => {
  res.render('index', { title: 'Enter your Steam ID', game: {} })
}

exports.postRetrieveGame = (req, res, next) => {
  let game;
  const data =
    axios
      .get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${req.body.steamid}&include_appinfo=true`)
      .then(response => {
        game = response.data.response.games[Math.floor(Math.random() * response.data.response.games.length)]
        res.render('index', { game: game, subtitle: "You should play. . .", steamid: req.body.steamid});
      })
      .catch(err => console.log(err));
}