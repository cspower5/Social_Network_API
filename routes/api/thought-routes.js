const router = require('express').Router();
const {
  getAllThoughts,
  getOneThought,
  postThought,
  putOneThought,
  deleteOneThought,
  createReaction,
  deleteReaction
} = require('../../controllers/thought-controller');

//Create and Get All thoughts.
router
.route('/')
.get(getAllThoughts)
.post(postThought);

// Get, Put, and Delete single thought
router
  .route('/:id')
  .get(getOneThought)
  .put(putOneThought)
  .delete(deleteOneThought);

// Add and Delete Rreactions to thoughts.
router.route('/:thoughtId/:reactions/:reactionId')
.post(createReaction)
.delete(deleteReaction);

module.exports = router;