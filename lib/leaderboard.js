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

  this.pageSize = options.pageSize || 50;

  redisOptions || (redisOptions = {});

  this.name = name;
  this.redis = redis.createClient(
    redisOptions.host,
    redisOptions.port
  );

  // changing the selected database for the
  // current connection if db option is passed
  if (redisOptions.db) {
    this.redis.select(redisOptions.db);
  }
}

var proto = Leaderboard.prototype;

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
    if (err) return cb(err);
    $this.rank(member, cb);
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
  this.redis.zrevrank([this.name, member], function(err, rank) {
    if (err) return cb(err);
    if (rank === null)
      cb(null, -1);
    else
      cb(null, rank);
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

  this.redis.zrevrange(req, function(err, range) {
    if (err) return cb(err);
    
    var list = [], l = range.length;

    for (var i = 0; i < l; i += 2) {
      list.push({
        'member': range[i]
      , 'score': range[i+1]
      });
    }

    cb(null, list);
  });
};

module.exports = Leaderboard;