Leaderboard
-----------

Leaderboards backed by [Redis](http://redis.io) in Node.js

[![Build Status](https://secure.travis-ci.org/borbit/node-leaderboard.png)](http://travis-ci.org/borbit/node-leaderboard)

API
---

#Constructor

    new Leaderboard('name', [options])

Creates a new leaderboard or attaches to an existing leaderboard.

**Options**

  - `length`

    Max leaderboard length. Default: `Infinity`

##Methods

  - `add(member, score, λ)`

    Ranks a member in the leaderboard.

        board.add('borbit', 100500, function(err, rank) {
          // rank - current position, -1 if a member didn't
          // fall within the leaderboard
        });

  - `rank(member, λ)`

    Ranks a member in the leaderboard.

        board.rank('borbit', function(err, rank) {
          // rank - current position, -1 if a member didn't
          // fall within the leaderboard
        });

##Tests

Leaderboard is covered by [Mocha](http://visionmedia.github.com/mocha/). To run tests:

     $ npm test

## License 

[MIT](http://en.wikipedia.org/wiki/MIT_License#License_terms). Copyright (c) 2012 Serge Borbit &lt;serge.borbit@gmail.com&gt;