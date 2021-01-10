/**
 * movie handler
 * @module controllers/movie
 */

const { dbCon } = require('../configuration');
const { ObjectId } = require('bson');
const createError = require('http-errors');
const Joi = require('@hapi/joi');

/**
 * get movies
 * @function getMovies
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Callback} next - callback
 */
const getMovies = (req, res, next) => {
  const pageNum = parseInt(req.params.page);

  if (isNaN(pageNum)) {
    return next(createError(400));
  }

  const moviesToSkip = (pageNum - 1) * 10;

  dbCon(
    'movies',
    /**
     * @callback dbCallback
     * @param {Object} db - site of db for operations
     */
    async (db) => {
      try {
        const movies = await db.find({}).sort({year: -1}).skip(moviesToSkip).limit(20).toArray();
        const mvNo = await db.find({}).count();
        const pgNo = Math.ceil(mvNo / 20);
        res.json({
          movies,
          pgNo
        });
      } catch (err) {
        next(createError(500));
      }
    }
  );
};

/**
 * get one movie
 * @function getMovie
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Callback} next - callback
 */
const getOneMovie = (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    return next(createError(400));
  }
  const _id = new ObjectId(req.params.id);
  dbCon(
    'movies',
    /**
     * @callback dbCallback
     * @param {Object} db - site of db for operations
     */
    async (db) => {
      try {
        const movie = await db.findOne({ _id });
        if (!movie) {
          return next(createError(404));
        }
        res.json(movie);
      } catch (err) {
        return next(createError(500));
      }
    }
  );
};

const getTopMovies = (req, res, next) => { 
  dbCon(
    'movies',
    /**
     * @callback dbCallback
     * @param {Object} db - site of db for operations
     */
    async (db) => {
      try {
        const movies = await db
          .find({"imdb.rating": {$gt: 8.5}})
          .sort({ "imdb.rating": -1 })
          .limit(50)
          .toArray();
        res.json({ movies});
      } catch (err) {
        next(createError(500));
      }
    }
  );
};

const getPopularMovies = (req, res, next) => { 
  dbCon(
    'movies',
    /**
     * @callback dbCallback
     * @param {Object} db - site of db for operations
     */
    async (db) => {
      try {
        const movies = await db
          .find({ 'tomatoes.viewer.numReviews': { $gt: 300 } })
          .sort({ 'tomatoes.viewer.numReviews': -1 })
          .limit(50)
          .toArray();
        res.json(movies);
      } catch (err) {
        next(createError(500));
      }
    }
  );
};

const getRelatedMovies = (req, res, next) => { 
  if (!req.get('Genres')) {
    next(createError(400));
  }
  const genres = req.get('Genres').split(',')

  if (!Array.isArray(genres)) {
    next(createError(400));
  }
  dbCon('movies',async (db) => {
    try {
      const movies = await db
        .find({ 'genres': {'$all': genres} })
        .limit(6)
        .toArray();
      res.json(movies);
    } catch (err) {
      next(createError(500));
    }
  });
};

const getSearchedMovies = (req, res, next) => {
  const validation = Joi.string().validate(req.params.search);
  if (validation.error) {
    return next(createError(400));
  }
  const preSearch = req.params.search.replace('+', ' ');
  const searchReg = new RegExp(preSearch, 'i');

  dbCon('movies', async (db) => {
    try {
      const movies = await db.find({ title: { $regex: searchReg } }).toArray();
      res.json(movies);
    } catch (err) {
      next(createError(500));
    }
  });

 };

module.exports = {
  getMovies,
  getOneMovie,
  getTopMovies,
  getPopularMovies,
  getRelatedMovies,
  getSearchedMovies,
};
