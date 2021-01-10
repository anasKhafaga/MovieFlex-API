const { dbCon } = require('../configuration');
const { ObjectId } = require('bson');
const createError = require('http-errors');

const getWatchlist = (req, res, next) => {
  if (!ObjectId.isValid(req.user._id)) {
    return next(createError(400));
  }
  const userId = new ObjectId(req.user._id);
  dbCon('watchlists', async (db) => {
    try {
      const movies = await db.find({ userId }).sort({ _id: -1 }).toArray();
      res.json({movies, userId: req.user._id});
    } catch (err) {
      next(err);
    }
  });
};

const postWatchlist = (req, res, next) => {
  if (
    !ObjectId.isValid(req.user._id) ||
    !ObjectId.isValid(req.params.movieId)
  ) {
    return next(createError(400));
  }
  const userId = new ObjectId(req.user._id);
  const movieId = new ObjectId(req.params.movieId);
  dbCon(
    'watchlists',
    async (db, db2, db3) => {
      try {
        const check = await db.findOne({ movieId, userId });
        if (check) {
          return res.status(200).json('Successfully created');
        }
        const movie = await db2.findOne(
          { _id: movieId },
          {
            projection: {
              _id: 0,
              poster: 1,
              imdb: 1,
              title: 1,
              genres: 1,
              countries: 1,
              writers: 1,
            },
          }
        );
        movie['userId'] = userId;
        movie['movieId'] = movieId;

        db3.updateOne(
          { _id: userId },
          {
            $push: {
              watchlist: {
                $each: [movieId],
                $slice: -30,
              },
            },
          }
        );

        await db.insertOne(movie);
        res.status(200).json({ msg: 'Successfully created' });
      } catch (err) {
        next(err);
      }
    },
    'movies',
    'users'
  );
};

const deleteWatchlist = (req, res, next) => {
  if (
    !ObjectId.isValid(req.user._id) ||
    !ObjectId.isValid(req.params.movieId)
  ) {
    return next(createError(400));
  }
  const userId = new ObjectId(req.user._id);
  const movieId = new ObjectId(req.params.movieId);

  dbCon(
    'watchlists',
    async (db, db2) => {
      try {
        db2.updateOne(
          { _id: userId },
          {
            $pull: {
              watchlist: movieId,
            },
          }
        );
        await db.deleteOne({ movieId, userId });
        res.json({
          msg: 'Successfully deleted',
        });
      } catch (err) {
        next(err);
      }
    },
    'users'
  );
};

module.exports = {
  getWatchlist,
  postWatchlist,
  deleteWatchlist,
};
