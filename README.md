Leaderboard
-----------

Leaderboards backed by [Redis](http://redis.io) in Node.js. Initially written for the [Minefield](http://mienfield.com) HTML5 game. Inspired by [Agoragames' Leaderboard](https://github.com/agoragames/leaderboard).

[![Build Status](https://secure.travis-ci.org/borbit/node-leaderboard.png)](http://travis-ci.org/borbit/node-leaderboard)

Installation
------------

    $ npm install leaderboard

API
---

#Constructor

    new Leaderboard('name', [options], [redisOptions|redisClient])

Creates a new leaderboard or attaches to an existing leaderboard.

###Options

  - `pageSize` - default: `0`

    Page size to be used when paging through the leaderboard.

  - `reverse` - default: `false`

    If `true` various methods will return results in lowest-to-highest order.

##Methods

  - `add(member, score, [λ])`

    Ranks a member in the leaderboard.

        board.add('borbit', 42, function(err) {
          // no arguments except err
        });

  - `incr(member, score, [λ])`

    Increments the score of a member by provided value and ranks it in the leaderboard. Decrements if negative.

        board.incr('borbit', 42, function(err) {
          // no arguments except err
        });

  - `rank(member, λ)`

    Retrieves the rank for a member in the leaderboard.

        board.rank('borbit', function(err, rank) {
          // rank - current position, -1 if a member doesn't
          // fall within the leaderboard
        });

  - `score(member, λ)`

    Retrieves the score for a member in the leaderboard.

        board.score('borbit', function(err, score) {
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

  - `at(rank, λ)`

    Retrieves a member on the spicified rank.

        board.at(42, function(err, member) {
          // member - member at the specified rank,
          // null if a member is not found
          // {
          //   member: 'member1',
          //   score: 30
          // }
        });

  - `rm(member, [λ])`

    Removes a member from the leaderboard.

        board.rm('kot', function(err, removed) {
          // removed - false in case the removing memeber 
          // doesn't exist in the leaderboard.
          // true - successful remove
        });

  - `total([λ])`

    Retrieves the total number of members in the leaderboard.

        board.total(function(err, number) {
          // captain obvious
        });

##Tests

Leaderboard is covered by [Mocha](http://visionmedia.github.com/mocha/). To run tests:

    $ npm test

## License 

[MIT](http://en.wikipedia.org/wiki/MIT_License#License_terms). Copyright (c) 2012 Serge Borbit &lt;serge.borbit@gmail.com&gt;
