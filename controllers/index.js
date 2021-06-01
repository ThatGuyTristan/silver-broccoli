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
      console.log(game);
      let played_time = 0;
      let img_src = `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`
      if (game.playtime_forever < 60) {
        played_time = "Less than one hour."
      } else {
        played_time = Math.floor(game.playtime_forever / 60 ) + " hours."
      }
      res.render('index', { name: game.name, img_src: img_src, played_time: played_time, steamid: req.body.steamid});
    })
    .catch(err => console.log(err));
}