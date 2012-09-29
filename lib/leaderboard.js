/**
 * Module dependencies.
 */
var redis = require('redis');

/**
 * @param {String} name
 * @param {Object} options
 * @param {Object} redisOptions
 */
function Leaderboard(name, options, redisOptions) {
  options || (options = {});

  this.name = name;
  this.pageSize = options.pageSize || 50;
  this.reverse = options.reverse || false;

  this.connect(redisOptions);
}

var proto = Leaderboard.prototype;

/**
 * Initialize redis connection
 *
 * @param {Object} options
 * @api private
 */
proto.connect = function(options) {
  options || (options = {});

  // if we have instance of RedisClient passed
  // though the "options" argument - just saving
  // it as a property and exiting the method
  if (options instanceof redis.RedisClient) {
    return this.redis = options;
  }

  this.redis = redis.createClient(options.port, options.host);

  // changing the selected database for the
  // current connection if db option is passed
  if (options.db) {
    this.redis.select(options.db);
  }
};

/**
 * Ranks a member in the leaderboard.
 *
 * @param {String} member
 * @param {Number} score
 * @param {Function} cb
 * @api public
 */
proto.add = function(member, score, cb) {
  var $this = this;

  this.redis.zadd([this.name, score, member], function(err) {
    if (err && cb) return cb(err);
    if (err) throw err;
    if (cb) $this.rank(member, cb);
  });
};

/**
 * Retrieves the rank for a member in the leaderboard.
 *
 * @param {String} member
 * @param {Function} cb
 * @api public
 */
proto.rank = function(member, cb) {
  var req = [this.name, member];

  if (this.reverse) {
    this.redis.zrank(req, res);
  } else {
    this.redis.zrevrank(req, res);
  }

  function res(err, rank) {
    if (err) return cb(err);
    if (rank === null)
      cb(null, -1);
    else
      cb(null, rank);
  }
};

/**
 * Retrieves the score for a member in the leaderboard.
 *
 * @param {String} member
 * @param {Function} cb
 * @api public
 */
proto.score = function(member, cb) {
  this.redis.zscore([this.name, member], function(err, score) {
    if (err) return cb(err);
    if (score === null)
      cb(null, -1);
    else
      cb(null, score);
  });
};

/**
 * Removes a member from the leaderboard.
 *
 * @param {String} member
 * @param {Function} cb
 * @api public
 */
proto.rm = function(member, cb) {
  this.redis.zrem([this.name, member], function(err, num) {
    if (err && cb) return cb(err);
    if (err) throw err;
    if (cb) cb(null, !!num);
  });
};

/**
 * Retrieves a page of leaders from the leaderboard.
 *
 * @param {Number} page
 * @param {Function} cb
 * @api public
 */
proto.list = function(page, cb) {
  if (typeof(cb) === 'undefined' && page instanceof Function) {
    cb = page;
  }
  if (typeof(page) === 'undefined' || page instanceof Function) {
    page = 0;
  }

  var req = [
    this.name
  , page * this.pageSize
  , page * this.pageSize + this.pageSize - 1
  , 'WITHSCORES'
  ];

  if (this.reverse) {
    this.redis.zrange(req, res);
  } else {
    this.redis.zrevrange(req, res);
  }

  function res(err, range) {
    if (err) return cb(err);
    
    var list = [], l = range.length;

    for (var i = 0; i < l; i += 2) {
      list.push({
        'member': range[i]
      , 'score': range[i+1]
      });
    }

    cb(null, list);
  }
};

module.exports = Leaderboard;