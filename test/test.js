// division-by-zero-test.js

var vows = require('vows'),
    assert = require('assert'),
    tweet = require('../tweet');


// Create a Test Suite
vows.describe('Testing Tweet').addBatch({
  'posting a tweet': {
    topic:  new(tweet),
      'we got error': function (topic) {
        assert.equal (topic.sendTweet(),401);
      }
  }
}).export(module); // Export the Suite
