var OAuth= require('oauth').OAuth;

var TWITTER_CONSUMER_KEY =  "--insert-twitter-consumer-key-here--";
var TWITTER_CONSUMER_SECRET = "--insert-twitter-consumer-secret-here--";
var CALLBACK_URI = "--insert-twitter-callback-here--";

var authorizationURL = 'https://www.facebook.com/dialog/oauth';
var tokenURL = 'https://graph.facebook.com/oauth/access_token';

var oa= new OAuth(null,
  null,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  "1.0",
  null,
  "HMAC-SHA1");

//console.log(oa.authHeader("http://somehost.com:3323/foo/poop?bar=foo", app_access_token, app_access_token_secret));
console.log(oa._prepareParameters(app_access_token, app_access_token_secret, 'POST', 'https://api.twitter.com/1/statuses/update.json',
            'status=Tweeting time from external service...#supercool'));
oa.post('https://api.twitter.com/1/statuses/update.json?include_entities=true',app_access_token, app_access_token_secret,
        {'status':'Tweeting time from external service...#supercool'}, null, function callback(any, data, response){
  console.log('Here is final status');
  console.dir(response);
}); 
