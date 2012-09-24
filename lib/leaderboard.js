var redis = require('redis');

function Leaderboard(name, options) {
  options || (options = {});
  
  this.name = name;
  this.redis = redis.createClient();
  this.redis.select(15);
}

var proto = Leaderboard.prototype;

proto.add = function(member, score, cb) {
  var self = this;

  this.redis.zadd([this.name, score, member], function(err) {
    self.rank(member, cb);
  })
};

/*
 * 
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