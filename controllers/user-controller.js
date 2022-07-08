const { User, Thoughts } = require('../models')
const user404Error = (id) => `UserID: ${id} not found!`
const user204Info = (id) => `UserID: ${id} has been deleted!`

const userController = {
    getAllUsers(req, res) {
        User.find({})
        .populate({ path: 'thoughts', select: '-_v' })
        .populate({ path: 'friends', select: '-_v' })
        .select('-_v')
        .then(dbUsers => res.json(dbUsers))
        .catch(err => res.status(500).json(err))
    },
    getOneUser({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({ path: 'friends', select: '-_v' })
        .populate({ path: 'thoughts', select: '-_v', populate: { path: 'reactions' }})
        .select('-_v')
        .then(dbUser => dbUser ? res.json(dbUser) : res.status(404).json({ message: user404Error(params.id) }))
        .catch(err => res.status(404).json(err))
    },
    postUser({ body }, res) {
        User.create({ username: body.username, email: body.email })
        .then(dbUser => res.json(dbUser))
        .catch(err => res.status(400).json(err))
    },
    putOneUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbUser => dbUser ? res.json(dbUser) : res.status(404).json({ message: user404Error(parmas.id) }))
        .catch(err => res.status(400).json(err))
    },
    deleteOneUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUser => {
            if (!dbUser) {
                return res.status(404).json({ message: user404Error(params.id) })
            }
            Thought.deleteMany({ username: dbUser.username }).then(deletedUser => deletedUser ? res.json({ message: user204Info(params.id)}) : res.status(404).json({ message: user404Error(params.id) }))
        })
        .catch(err => res.status(400).json(err))
    },
    createFriend({ params }, res) {
        User.findOneAndUpdate({ _id: params.userId }, { $push: { friends: params.friendId } }, { new: true, runValidator: true } )
        .then(dbUser => res.json(dbUser))
        .catch(err => res.status(400).json(err))
    },
    deleteFriend({ params }, res) {
        User.findOneAndUpdate({ _id: params.userId }, { $pull: { friends: params.friendsId } })
        .then(dbUser => res.status(200).json(user204Message(params.friendId, 'User')))
        .catch(err => res.json(err))
    }
}; //end userController

module.exports = userController
