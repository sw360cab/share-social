#Share Social

A modular Node JS library for sharing and posting on social networksusing OAuth. 
It includes the following modules:

- module-twitter (based on **OAuth 1.0**)
- module-facebook (based on **OAuth 2.0**)

*NOTE*: credentials from providers should be provided and how they are obtained is out of the scope of this library

##module-twitter
###Usage
- setup module  
 ```var tweet = new TweetIt(TWITTER_CONSUMER_KEY,TWITTER_CONSUMER_SECRET,CALLBACK_URI);```

- send tweet  
```tweet.sendTweet(theToken,theTokenSecret,'msg', function(done){
		console.dir(done);
		res.writeHead(done.statusCode,'text/plain');
		res.end("Finished posting tweet");  
		});
```

	where:  
	- *theToken* is the twitter token
	- *theTokenSecret* is the twitter token secret
	- *'msg'* is the custom message to post
	- *function(done){};* is a callback with a reply message from Twitter

##module-facebook
*NOTE*: application requiring authentication in Facebook should have requested the following scopes:

- **user_status**  
- **publish_stream**

###Usage
- setup module  
 ```var facebook = new FacebookIt(FACEBOOK_APP_ID,FACEBOOK_APP_SECRET,CALLBACK_URI);```

- send tweet  
 ```facebook.sendFacebook(theToken, theTokenSecret,'msg',profileId, function(err,result) {
    console.dir(result);
    var stausCode = err ? err.statusCode : 200
    res.writeHead(stausCode,'text/plain');
    res.end("Finished updating facebook status");
  });
  ```
  
	where:  
	- *theToken* is the facebook token
	- *theTokenSecret* is the facebook token secret
	- *msg* is the custom message to post
	- *function(err,result{};* is a callback with a reply message from Facebook

#TBD
- add other modules
	- google+
	- foursquare
- add test bench
