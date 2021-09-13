/**
* The Settings Module reads the settings out of settings.json and provides
* this information to the other modules
*/

var fs = require("fs");
var jsonminify = require("jsonminify");


//The app title, visible e.g. in the browser window
exports.title = "blockchain";

//The url it will be accessed from
exports.address = "selacoin.org";

// logo
exports.logo = "/images/logo.png";
exports.headerlogo = false;


//The app favicon fully specified url, visible e.g. in the browser window
exports.favicon = "favicon.ico";

//Theme
exports.theme = "Cyborg";

//The Port ep-lite should listen to
exports.port = process.env.PORT || 80;


//coin symbol, visible e.g. MAX, LTC, HVC
exports.symbol = "SELA";


//coin name, visible e.g. in the browser window
exports.coin = "SelaCoin";


//This setting is passed to MongoDB to set up the database
exports.dbsettings = {
  "user": "iquidus",
  "password": "123",
  "database": "blockchaindb",
  "address" : "localhost",
  "port" : 27017
};


//This setting is passed to the wallet
exports.wallet = { "host" : "localhost",
  "port" : 25521,
  "username" : "rpc_selacoin",
  "password" : "123"
};


//Locale file
exports.locale = "locale/en.json",


//Menu items to display
exports.display = {
  "api": true,
  "market": true,
  "twitter": false,
  "facebook": false,
  "googleplus": false,
  "youtube": false,
  "search": true,
  "richlist": true,
  "movement": true,
  "network": true,
  "navbar_dark": false,
  "navbar_light": false
};


//API view
exports.api = {
    "blockindex": 2,
    "blockhash": "1fc170c625eeacc63aac868c5ffdca7d0adf81883a88259b8c1d6cddb3ca7722",
    "txhash": "43e0c00e786b8277b8c4834c065df644c021d1fd9f9403db6b8ea0d37185f53a",
    "address": "SvPdwNmU7vfrsHvj2eMUNst2obmjWvVAHc"
  },

// markets
exports.markets = {
  "coin": "SELA",
  "exchange": "BTC",
  "enabled": ['bitsails'],
  "default": "bitsails"
};

// richlist/top100 settings
exports.richlist = {
  "distribution": true,
  "received": true,
  "balance": true
};

exports.movement = {
  "min_amount": 100,
  "low_flag": 1000,
  "high_flag": 10000
},

//index
exports.index = {
  "show_hashrate": false,
  "show_market_cap": false,
  "show_market_cap_over_price": false,
  "difficulty": "HYBRID",
  "last_txs": 100,
  "txs_per_page": 10
};

// twitter
exports.twitter = "iquidus";
exports.facebook = "yourfacebookpage";
exports.googleplus = "yourgooglepluspage";
exports.youtube = "youryoutubechannel";

exports.confirmations = 6;

//timeouts
exports.update_timeout = 125;
exports.check_timeout = 250;
exports.block_parallel_tasks = 1;


//genesis
exports.genesis_tx = "966fb3cea287cd9e4076557be031b797892db95594053fb69420b22aeb10a9a8";
exports.genesis_block = "0000014e27558308efde2c3baaacd65a4381b311a68d3a989acfd73819940072";

exports.use_rpc = true;
exports.heavy = false;
exports.lock_during_index = false;
exports.txcount = 100;
exports.txcount_per_page = 50;
exports.show_sent_received = true;
exports.supply = "COINBASE";
exports.nethash = "getnetworkhashps";
exports.nethash_units = "K";

exports.labels = {};

exports.reloadSettings = function reloadSettings() {
  // Discover where the settings file lives
  var settingsFilename = "settings.json";
  settingsFilename = "./" + settingsFilename;

  var settingsStr;
  try{
    //read the settings sync
    settingsStr = fs.readFileSync(settingsFilename).toString();
  } catch(e){
    console.warn('No settings file found. Continuing using defaults!');
  }

  // try to parse the settings
  var settings;
  try {
    if(settingsStr) {
      settingsStr = jsonminify(settingsStr).replace(",]","]").replace(",}","}");
      settings = JSON.parse(settingsStr);
    }
  }catch(e){
    console.error('There was an error processing your settings.json file: '+e.message);
    process.exit(1);
  }

  //loop trough the settings
  for(var i in settings)
  {
    //test if the setting start with a low character
    if(i.charAt(0).search("[a-z]") !== 0)
    {
      console.warn("Settings should start with a low character: '" + i + "'");
    }

    //we know this setting, so we overwrite it
    if(exports[i] !== undefined)
    {
      // 1.6.2 -> 1.7.X we switched to a new coin RPC with different auth methods
      // This check uses old .user and .pass config strings if they exist, and .username, .password don't.
      if (i == 'wallet')
      {
        if (!settings.wallet.hasOwnProperty('username') && settings.wallet.hasOwnProperty('user'))
        {
          settings.wallet.username = settings.wallet.user;
        }
        if (!settings.wallet.hasOwnProperty('password') && settings.wallet.hasOwnProperty('pass'))
        {
          settings.wallet.password = settings.wallet.pass;
        }
      }
      exports[i] = settings[i];
    }
    //this setting is unkown, output a warning and throw it away
    else
    {
      console.warn("Unknown Setting: '" + i + "'. This setting doesn't exist or it was removed");
    }
  }

};

// initially load settings
exports.reloadSettings();
