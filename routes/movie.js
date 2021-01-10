/**
 * movie router
 * @module routes/movie
 */

const { Router } = require('express');
const {
  getMovies,
  getOneMovie,
  getTopMovies,
  getPopularMovies,
  getRelatedMovies,
  getSearchedMovies,
} = require('../controllers');
const { auth } = require('../middlewares');

/**
 * @type {Object}
 * @namespace movieRouter
 */
const router = Router();

router
  /**
   * @function get
   * @param {string} /movies/:page
   * @param {Callback} getMovies {@link module:controllers/movie~getMovies}
   */
  .get('/movies/browse/:page', getMovies)
  /**
   * @function get
   * @param {string} /movie/:id
   * @param {Callback} auth {@link module:middlewares/auth~auth} Express middleware
   * @param {Callback} getOneMovie {@link module:controllers/movie~getOneMovie}
   */
  .get('/movie/:id', auth, getOneMovie)

  .get('/movies/top-rated', auth, getTopMovies)

  .get('/movies/popular', auth, getPopularMovies)
  .get('/movies/related', auth, getRelatedMovies)
  .get('/movies/search/:search',auth, getSearchedMovies);

module.exports = router;