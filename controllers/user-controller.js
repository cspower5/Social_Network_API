const { User, Thought } = require('../models')
const user404Error = (id) => `UserID: ${id} not found!`
const user204Info = (id) => `UserID: ${id} has been deleted!`

const userController = {
    getAllUsers(req, res) {
        User.find({})
        .populate({ path: 'thoughts', select: '-__v' })
        .populate({ path: 'friends', select: '-__v' })
        .select('-__v')
        .then(dbUsers => res.json(dbUsers))
        .catch(err => res.status(500).json(err))
    },
    getOneUser({ params }, res) {
        User.findOne({ _id: params.userId })
        .populate({ path: 'friends', select: '-__v' })
        .populate({ path: 'thoughts', select: '-__v', populate: { path: 'reactions' }})
        .select('-__v')
        .then(dbUser => dbUser ? res.json(dbUser) : res.status(404).json({ message: user404Error(params.userId) }))
        .catch(err => res.status(404).json(err))
    },
    postUser({ body }, res) {
        User.create({ username: body.username, email: body.email })
        .then(dbUser => res.json(dbUser))
        .catch(err => res.status(400).json(err))
    },
    putOneUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.userId }, body, { new: true, runValidators: true })
        .then(dbUser => dbUser ? res.json(dbUser) : res.status(404).json({ message: user404Error(parmas.userId) }))
        .catch(err => res.status(400).json(err))
    },
    deleteOneUser({ params }, res) {
        User.findOneAndDelete({ _id: params.userId }, {})
        .then(dbUser => {
            if (!dbUser) {
                return res.status(404).json({ message: user404Error(params.userId) })
            }
            Thought.deleteMany({ username: dbUser.username }).then(deletedUser => deletedUser ? res.json({ message: user204Info(params.userId)}) : res.status(404).json({ message: user404Error(params.userId) }))
        })
        .catch(err => res.status(400).json(err))
    },
    createFriend({ params }, res) {
        User.findOneAndUpdate({ _id: params.userId }, { $push: { friends: params.friendId } }, { new: true, runValidator: true } )
        .then(dbUser => res.json(dbUser))
        .catch(err => res.status(400).json(err))
    },
    deleteFriend({ params }, res) {
        User.findOneAndUpdate({ _id: params.userId }, { $pull: { friends: params.friendId } })
        .then(dbUser => dbUser ? res.json(dbUser) : res.status(200).json(user204Message(params.friendId, 'User')))
        .catch(err => res.json(err))
    }
}; //end userController

module.exports = userController
