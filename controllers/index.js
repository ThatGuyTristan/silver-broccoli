const axios = require("axios");
require('dotenv').config()

let games = [];
let storedUsername;

const resolveVanityUrl = async (username) => {
  return new Promise((resolve) => {
    resolve(
      axios
        .get(
          `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${process.env.STEAM_API_KEY}&vanityurl=${username}`
        )
      ) 
    }
  )
}

const resolvePlaytime = (playtime) => {
  if (playtime < 60) {
    return "Less than one hour."
  } else if (playtime == 0) { 
    return "Never played"
  } else { 
    return Math.floor(playtime / 60 ) + " hours."
  }
}

const resolveGameFromList = () => {
  return games[Math.floor(Math.random() * games.length)]
}

exports.getIndex = (req, res, next) => {
  res.render('index', { title: 'Enter your Steam ID', games: {} })
}

exports.postRetrieveGame = async (req, res, next) => {
  let steamId;
  let game;

  await resolveVanityUrl(req.body.username).then((resp) => { 
    steamId = resp.data.response.steamid
  })

  if(games.length === 0 || storedUsername != req.body.username) {
    storedUsername = req.body.username
    axios
      .get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${steamId}&include_appinfo=true`)
      .then(resp => {
        games = resp.data.response.games
        game = resolveGameFromList();
        let img_src = `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`

        res.render('index', { 
          name: game.name, 
          gamesLength: games.length, 
          img_src: game.img_logo_url ?  img_src : '', 
          played_time: resolvePlaytime(game.playtime_forever), 
          username: req.body.username,
          steamid: steamId
        });


      }) 
      .catch(err => console.log(err))
  } else { 
    game = resolveGameFromList();
    res.render('index', { 
      name: game.name, 
      gamesLength: games.length, 
      img_src: game.img_logo_url ?  img_src : '', 
      played_time: resolvePlaytime(game.playtime_forever), 
      username: req.body.username,
      steamid: steamId
    });
  }
}