const { json } = require('body-parser');
const { Thought, Reactions } = require('../models');
const thought404Error = (id) => `ThoughtID: ${id} not found!`
const thought200Info = (id) => `ThoughtID: ${id} has been deleted!`
const reaction200Info = (id) => `ReactionID: ${id} has been deleted!`

const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find({})
        .populate({ path: 'Reactions', select: '-_v' })
        .select('-_v')
        .then(dbThoughts => res.json(dbThoughts))
        .catch(err  => res.status(500).json(err))
    },
    getOneThought({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({ path: 'Reactions', select: '-_v' })
        .select('-_v')
        .then(dbThought => dbThought ? res.json(dbThought) : res.status(404).json({ message:  thought404Error(params.id) }))
        .catch(err => res.status(404).json(err))
    },
    postThought({ body }, res) {
        Thought.create({thoughtText: body.thoughtText, username: body.username})
        .then(({ _id }) => User.findOneAndUpdate({ _id: body.userId }, { $push: { thoughts: _id } }, { new: true }))
        .catch(err => res.status(404).json(err))
    },
    putOneThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbThought => dbThought ? res.json(dbThought) : res.status(404).json({ message: thought404Error(params.id) }))
        .catch(err => res.status(400).json(err))
    },
    deleteOneThought({ params, body }, res) {
        Thought.findOneAndDelete({ _id: params.id })
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
        Thought.findOneAndUpdate({ _id: params.thoughtId }, { $push: { reactions: { _id: params.reactionId } } }, { new: true })
        .then(dbThought => dbThought ? res.json(reaction200Info(params.thoughtId)) : res.status(404).json({ message: thought404Error(params.id) }))
        .catch(err => res.status(404).json(err))
    }
};//ends thoughtController

module.exports = thoughtController