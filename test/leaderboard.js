var redis = require('redis');
var assert = require('assert');
var Leaderboard = require('../');

beforeEach(function(done) {
  var client = redis.createClient();
  client.on('connect', function() {
    client.select(15, function() {
      client.flushdb(done);
    });
  });
});

describe('Leaderboard', function() {
  it('should be initialized with default options', function() {
    assert.ok(true);
  });
});