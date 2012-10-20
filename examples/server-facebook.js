var express = require('express')
  , passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  , FacebookIt = require('../lib/share-social').FacebookIt
  , MemoryStore = express.session.MemoryStore
  , sessionStore = new MemoryStore();

var FACEBOOK_APP_ID = "--insert-facebook-app-id-here--"
var FACEBOOK_APP_SECRET = "--insert-facebook-app-secret-here--";
var CALLBACK_URI = "--insert-facebook-callback-here--";

var theToken;
var theTokenSecret;
var profileId;

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Twitter profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the FacebookStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Twitter profile), and
//   invoke a callback with a user object.
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: CALLBACK_URI
  },
  function(token, tokenSecret, profile, done) {
    debugger;    
    console.log('FACEBOOK ****** in config' + token + ' ' + tokenSecret );

    theToken = token;
    theTokenSecret = tokenSecret;
    profileId = profile.id

    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Twitter profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Twitter account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

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

// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Twitter authentication will involve redirecting
//   the user to facebook.com.  After authorization, the Twitter will redirect
//   the user back to this application at /auth/facebook/callback
app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['user_status', 'user_checkins', 'publish_stream'] }),
  function(req, res){
    // The request will be redirected to Twitter for authentication, so this
    // function will not be called.
  });

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    debugger;
    console.log('facebook called callback with token ' + theToken + ' and tokenSecret' + theTokenSecret);
    res.redirect('/send');
  });

app.get('/send', function (req,res) {
  console.log('facebook updating status with token ' + theToken + ' and tokenSecret' + theTokenSecret);
  
  var fb = new FacebookIt(FACEBOOK_APP_ID,FACEBOOK_APP_SECRET,CALLBACK_URI);
  fb.updateStatus(theToken,'Hi facebook!', profileId,  function(err, result) {
    console.dir(result);
    var stausCode = err ? err.statusCode : 200
    res.writeHead(stausCode,'text/plain');
    res.end("Finished updating facebook status");
  });
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(3000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
