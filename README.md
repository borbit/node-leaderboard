Leaderboard
-----------

Leaderboards backed by [Redis](http://redis.io) in Node.js. Inspired by [Agoragames' Leaderboard](https://github.com/agoragames/leaderboard).

[![Build Status](https://secure.travis-ci.org/borbit/node-leaderboard.png)](http://travis-ci.org/borbit/node-leaderboard)

API
---

#Constructor

    new Leaderboard('name', [options], [redisOptions])

Creates a new leaderboard or attaches to an existing leaderboard.

###Options

  - `pageSize` - default: `0`

    Page size to be used when paging through the leaderboard


##Methods

  - `add(member, score, λ)`

    Ranks a member in the leaderboard.

        board.add('borbit', 100500, function(err, rank) {
          // rank - current position in the leadeboard
        });

  - `rank(member, λ)`

    Retrieves the rank for a member in the leaderboard.

        board.rank('borbit', function(err, rank) {
          // rank - current position, -1 if a member doesn't
          // fall within the leaderboard
        });

  - `score(member, λ)`

    Retrieves the score for a member in the leaderboard.

        board.score('borbit', function(err, rank) {
          // score - current score, -1 if a member doesn't
          // fall within the leaderboard
        });

  - `list([page], λ)`

    Retrieves a page of leaders from the leaderboard.

        board.list(function(err, list) {
          // list - list of leaders are ordered from
          // the highest to the lowest score
          // [
          //   {member: 'member1', score: 30},
          //   {member: 'member2', score: 20},
          //   {member: 'member3', score: 10}
          // ]
        });

##Tests

Leaderboard is covered by [Mocha](http://visionmedia.github.com/mocha/). To run tests:

     $ npm test

## License 

[MIT](http://en.wikipedia.org/wiki/MIT_License#License_terms). Copyright (c) 2012 Serge Borbit &lt;serge.borbit@gmail.com&gt;