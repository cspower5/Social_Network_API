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
.route('/:thoughtId')
.get(getOneThought)
.put(putOneThought)
.delete(deleteOneThought);

router
.route('/:thoughtId/reactions')
.post(createReaction)

// Add and Delete Rreactions to thoughts.
router
.route('/:thoughtId/reactions/:reactionId')
.delete(deleteReaction);

module.exports = router;