var OAuth = require('oauth').OAuth;

var TWITTER_CONSUMER_KEY =  "--insert-twitter-consumer-key-here--";
var TWITTER_CONSUMER_SECRET = "--insert-twitter-consumer-secret-here--";
var CALLBACK_URI = "--insert-twitter-callback-here--";

function TweetIt(twitter_consumer_key,twitter_consumer_secret,callback_uri){
  this.twitter_consumer_key = twitter_consumer_key || TWITTER_CONSUMER_KEY;
  this.twitter_consumer_secret = twitter_consumer_secret || TWITTER_CONSUMER_SECRET;
  this.callback_uri = callback_uri || CALLBACK_URI;

  this.oa= new OAuth(null,
    null,
    this.twitter_consumer_key,
    this.twitter_consumer_secret,
    "1.0",
    null,
    "HMAC-SHA1");
}

TweetIt.prototype.sendTweet = function(app_access_token,app_access_token_secret, tweet, callback) {
  var newCallback = callback ? callback : function(){ console.log('tweet created!') };
  
  this.oa.post('https://api.twitter.com/1/statuses/update.json?include_entities=true',
     app_access_token,
     app_access_token_secret,
     {'status':tweet},
     null,
     newCallback);
};

module.exports = TweetIt;
