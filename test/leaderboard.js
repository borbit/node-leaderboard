var assert = require('assert');
var redis = require('redis');
var LB = require('../');

// Constants
var DBINDEX = 15;

// Before all suites
before(function(done) {
  // Initialize a subject leaderboard before all suites
  this.board = new LB('general', null, {db: DBINDEX});

  // Creating connection to the redis and 
  // changing the current selected database
  this.client = redis.createClient();
  this.client.select(DBINDEX, done);
});

describe('Leaderboard', function() {
  describe('"add" method', function() {
    // Empty database before the suite
    before(function(done) {
      this.client.flushdb(done);
    });
    
    it('should return 0 for the member "member1" with score 30', function(done) {
      this.board.add('member1', 30, function(err, rank) {
        assert.equal(rank, 0);
        done();
      });
    });

    it('should return 1 for the member "member2" with score 20', function(done) {
      this.board.add('member2', 20, function(err, rank) {
        assert.equal(rank, 1);
        done();
      });
    });

    it('should return 2 for the member "member3" with score 10', function(done) {
      this.board.add('member3', 10, function(err, rank) {
        assert.equal(rank, 2);
        done();
      });
    });

    it('should return 0 for the member "member3" with score 40', function(done) {
      this.board.add('member3', 40, function(err, rank) {
        assert.equal(rank, 0);
        done();
      });
    });

  });

  describe('"rank" method', function() {
    // Empty database before the suite
    before(function(done) {
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

    it('should return -1 if member isn\'t in the leaderboard', function(done) {
      this.board.rank('piska', function(err, rank) {
        assert.equal(rank, -1);
        done();
      });
    });

  });
});