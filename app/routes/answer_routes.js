const express = require('express')
const router = express.Router()
const passport = require('passport')
const Answer = require('../models/answer')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

// get/index route
router.get('/answers', (req, res, next) => {
    // req.body.answer.contributor = req.user.id
    Answer.find()
        .then(answers => res.status(200).json({ answers }))
        .catch(next)
})

// post route to add an answer
router.post('/answers', (req, res, next) => {
    // req.body.answer.contributor = req.user.id

    Answer.create(req.body.answer)
        .then(answer => {
            res.status(201).json({
                answer: answer.toObject()
            })
        })
        .catch(next)
})

// patch route to edit an answer
router.patch('/answers/:id', removeBlanks, (req, res, next) => {
    Answer.findById(req.params.id)
        .then(handle404)
        .then(answer => {
            return answer.updateOne(req.body.problem)
        })
        .then(() => res.sendStatus(204))
        .catch(next)
})

module.exports = router