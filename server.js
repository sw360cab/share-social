var express = require('express')
  , passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy
  , TweetIt = require('./module-twitter').TweetIt
  , MemoryStore = express.session.MemoryStore
  , sessionStore = new MemoryStore();

var TWITTER_CONSUMER_KEY = 'bpezPISte59LrAkmvTcoJQ';
var TWITTER_CONSUMER_SECRET = 'YZ88fMfswDLbQL0Aotaz5lDUT1wToMEQViJaPBZg5Y';
var CALLBACK_URI = 'http://twitter.minimalgap.com:3000/auth/twitter/callback';

var theToken;
var theTokenSecret;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: CALLBACK_URI
  },
  function(token, tokenSecret, profile, done) {
debugger;    
console.log('TWITTER ****** in config' + token + ' ' + tokenSecret );

    theToken = token;
    theTokenSecret = tokenSecret;
    
    process.nextTick(function () {
      console.log('TWITTER ****** in config' + token + ' ' + tokenSecret );

          theToken = token;
    theTokenSecret = tokenSecret;
      // To keep the example simple, the user's Twitter profile is returned to
      // represent the logged-in user. In a typical application, you would want
      // to associate the Twitter account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });  
  }
));

/*
passport.use('twitter-authz',new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: CALLBACK_URI
  },
  function(token, tokenSecret, profile, done) {
    process.nextTick(function () {
      console.log('TWITTER ****** in config authorize');
      // To keep the example simple, the user's Twitter profile is returned to
      // represent the logged-in user. In a typical application, you would want
      // to associate the Twitter account with a user record in your database,
      // and return that user instead.
      token = token;
      tokenSecret = tokenSecret;
    
      return done(null, profile);
    });  
  }
));
*/


var app = express.createServer();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});



app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});


// Redirect the user to Twitter for authentication.  When complete, Twitter
// will redirect the user back to the application at
// /auth/twitter/callback
app.get('/auth/twitter', passport.authenticate('twitter'),
  function(req, res){
    // The request will be redirected to Twitter for authentication, so this
    // function will not be called.
    console.log('TWITTER ****** auth twitter');
  });

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/twitter/callback', 
 // passport.authenticate('twitter-authz', { failureRedirect: '/login' }),
  function(req, res) {
    console.log('TWITTER ****** logged');
    res.sendfile(__dirname + '/tweet.html');
  });
  
app.listen(3000);

app.get('/send', 
//passport.authorize('twitter-authz', { failureRedirect: '/login' }),
function (req,res) {
  console.log('tweeting with token ' + theToken + ' and tokenSecret' + theTokenSecret);
  
  var tweet = new TweetIt();
  tweet.sendTweet(theToken,theTokenSecret,'Tweeting time from external service...#supercool', function(done){
    console.dir(done);
    res.writeHead(done.statusCode,'text/plain');
    res.end(done.error);
  });
});

// Simple route middleware to ensure user is authenticated.
// Use this route middleware on any resource that needs to be protected. If
// the request is authenticated (typically via a persistent login session),
// the request will proceed. Otherwise, the user will be redirected to the
// login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}


