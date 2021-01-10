const { Router } = require('express');
const { getWatchlist, postWatchlist, deleteWatchlist } = require('../controllers');
const { auth } = require('../middlewares');


const router = Router();

router
  .get('/', auth, getWatchlist)
  .post('/:movieId', auth, postWatchlist)
  .delete('/:movieId', auth, deleteWatchlist);

module.exports = router;