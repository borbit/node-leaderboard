var assert = require('assert');
var async = require('async');
var redis = require('redis');
var LB = require('../');

// Constants
var DBINDEX = 15;
var PAGESIZE = 5;

// Before all suites
before(function(done) {
  // Initialize a subject leaderboard before all suites
  this.board = new LB('general', {pageSize: PAGESIZE}, {db: DBINDEX});

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

  describe('"list" method', function() {
    // Empty database before the suite
    before(function(done) {
      this.client.flushdb(done);
    });
    
    it('should return currect list #1', function(done) {
      var board = this.board;
      board.add('member1', 50, function() {
        board.list(function(err, list) {
          assert.deepEqual(list, [{'member': 'member1', 'score': 50}]);
          done();
        });
      });
    });

    it('should return currect list #2', function(done) {
      var board = this.board;
      board.add('member2', 60, function() {
        board.list(function(err, list) {
          assert.deepEqual(list, [
            {'member': 'member2', 'score': 60},
            {'member': 'member1', 'score': 50}
          ]);
          done();
        });
      });
    });

    it('should return currect list #3', function(done) {
      var board = this.board;
      board.add('member3', 40, function() {
        board.list(function(err, list) {
          assert.deepEqual(list, [
            {'member': 'member2', 'score': 60},
            {'member': 'member1', 'score': 50},
            {'member': 'member3', 'score': 40}
          ]);
          done();
        });
      });
    });

    it('should return currect list size for the page 0', function(done) {
      var board = new LB('general', {pageSize: 5}, {db: DBINDEX});

      async.parallel([
        function(cb) { board.add('member4', 60, cb); },
        function(cb) { board.add('member5', 70, cb); },
        function(cb) { board.add('member6', 80, cb); },
        function(cb) { board.add('member7', 90, cb); }
      ], function() {
        board.list(function(err, list) {
          assert.equal(list.length, 5);
          done();
        });
      });
    });

    it('should return currect list size for the page 1', function(done) {
      var board = new LB('general', {pageSize: 5}, {db: DBINDEX});
      
      board.list(1, function(err, list) {
        assert.equal(list.length, 2);
        done();
      });
    });

  });
});