var redis = require('redis');

/*
 * @param {String} name
 * @param {Object} boardOptions
 * @param {Object} redisOptions
 */
function Leaderboard(name, boardOptions, redisOptions) {
  boardOptions || (boardOptions = {});
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

/*
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

/*
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

module.exports = Leaderboard;