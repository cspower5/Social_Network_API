const { Thought, User } = require('../models');

const thought404Error = (id) => `ThoughtID: ${id} not found!`
const thought200Info = (id) => `ThoughtID: ${id} has been deleted!`
const reaction200Info = (id) => `ReactionID: ${id} has been deleted!`

const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find({})
        .populate({ path: 'reactions', select: '-__v' })
        .select('-__v')
        .then(dbThoughts => res.json(dbThoughts))
        .catch(err  => res.status(500).json(err))
    },
    getOneThought({ params }, res) {
        Thought.findOne({ _id: params.thoughtId })
        .populate({ path: 'reactions', select: '-__v' })
        .select('-__v')
        .then(dbThought => dbThought ? res.json(dbThought) : res.status(404).json({ message:  thought404Error(params.thoughtId) }))
        .catch(err => res.status(404).json(err))
    },
    postThought({ body }, res) {
        console.log(body)
        Thought.create({ thoughtText: body.thoughtText, username: body.username, userId: body.userId })
        .then(({ _id }) => User.findOneAndUpdate({ _id: body._id }, { $push: { thoughts: _id } }, { new: true }))
        .then(dbThought => res.json(dbThought))     
        .catch(err => res.status(404).json(err))
    },
    putOneThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, body, { new: true, runValidators: true })
        .then(dbThought => dbThought ? res.json(dbThought) : res.status(404).json({ message: thought404Error(params.id) }))
        .catch(err => res.status(400).json(err))
    },
    deleteOneThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
        .then(dbThought => dbThought ? res.json(thought200Info(dbThought._id)) : res.status(404).json({ message: thought404Error(params.id)}))
        .catch(err => res.status(404).json(err))
    },
    createReaction({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, 
            { $push: { reactions: { reactionBody: body.reactionBody, username: body.username } } },
            { new: true, runValidators: true })
            .then(dbThought => dbThought ? res.json(dbThought) : res.status(404).json({ message: thought404Error(params.id) }))
            .catch(err => res.status(400).json(err))
    },
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, { $pull: { reactions: { _id: params.reactionId } } }, { new: true })
        .then(dbThought => dbThought ? res.json(reaction200Info(params.thoughtId)) : res.status(404).json({ message: thought404Error(params.id) }))
        .catch(err => res.status(404).json(err))
    }
};//ends thoughtController

module.exports = thoughtController