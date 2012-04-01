var OAuth2 = require('oauth').OAuth2;

var FACEBOOK_APP_ID = '242198692542924';
var FACEBOOK_APP_SECRET = 'f8867e84e3948bde72c8b0265c03a0ff';
var CALLBACK_URI = 'http://facebook.minimalgap.com:3000/auth/facebook/callback';

var authorizationURL = 'https://www.facebook.com/dialog/oauth';
var tokenURL = 'https://graph.facebook.com/oauth/access_token';

function FacebookIt(facebook_app_id,facebook_app_secret,callback_uri){
  this.facebook_app_id = facebook_app_id || FACEBOOK_APP_ID;
  this.facebook_app_secret = facebook_app_secret || FACEBOOK_APP_SECRET;
  this.callback_uri = callback_uri || CALLBACK_URI;

  this.oa = new OAuth2(
    this.facebook_app_id,
    this.facebook_app_secret,
    '', 
    this.authorizationURL,
    this.tokenURL);
}

FacebookIt.prototype.updateStatus = function(app_access_token,statusMsg, profileId, callback) {
  var newCallback = callback ? callback : function(){ console.log('status updated') };
  
  console.log(" Sending status update at", uri, "for profile", profileId); 
  this.oa._request('POST',
     'https://graph.facebook.com/' + profileId + '/feed',
     {},
     'message='+statusMsg,
     app_access_token,
     newCallback);
};


module.exports = FacebookIt;

