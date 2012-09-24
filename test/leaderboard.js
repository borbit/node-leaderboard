var redis = require('redis');
var assert = require('assert');
var Leaderboard = require('../');

before(function(done) {
  this.client = redis.createClient();
  this.client.select(15, done);
});

describe('Leaderboard', function() {
  
  describe('"add" method', function() {
    // Initialize a subject leaderboard and 
    // empty database before the suite
    before(function(done) {
      this.board = new Leaderboard('test');
      this.client.flushdb(done);
    });
    
    it('should return 0 for the member "member1" with score 30', function(done) {
      this.board.add('member1', 30, function(err, rank) {
        assert.equal(rank, 0);
        done();
      });
    });

  });

  describe('"rank" method', function() {
    // Initialize a subject leaderboard and 
    // empty database before the suite
    before(function(done) {
      this.board = new Leaderboard('test');
      this.client.flushdb(done);
    });
    
    it('should return currect rank #1', function(done) {
      var board = this.board;
      board.add('member1', 50, function() {
        board.rank('member1', function(err, rank) {
          assert.equal(rank, 0);
          done();
        });
      });
    });

    it('should return currect rank #2', function(done) {
      var board = this.board;
      board.add('member2', 40, function() {
        board.rank('member2', function(err, rank) {
          assert.equal(rank, 1);
          done();
        });
      });
    });

    it('should return currect rank #3', function(done) {
      var board = this.board;
      board.add('member3', 30, function() {
        board.rank('member3', function(err, rank) {
          assert.equal(rank, 2);
          done();
        });
      });
    });

    it('should return -1 if the user isn\'t in the leaderboard', function(done) {
      this.board.rank('piska', function(err, rank) {
        assert.equal(rank, -1);
        done();
      });
    });

  });
});