const router = require('express').Router();
const {
  getAllUsers,
  getOneUser,
  postUser,
  putOneUser,
  deleteOneUser,
  createFriend,
  deleteFriend
} = require('../../controllers/user-controller');

//Create and Get All the Users.
router
.route('/')
.get(getAllUsers)
.post(postUser);

// Get, Put, and Delete single user
router
  .route('/:id')
  .get(getOneUser)
  .put(putOneUser)
  .delete(deleteOneUser);

// Add and Delete Friends of user.
router.route('/:userId/:friends/:friendId')
.post(createFriend)
.delete(deleteFriend);

module.exports = router;