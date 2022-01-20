const express = require('express')
const { registerUser, authUser, getUserByToken, allUsers, getUserByStr } = require('../controllers/user-controllers')
const protect = require('../middleware/auth-middleware')

const router = express.Router()

router.route('/login').post(authUser)

router.route('/').post(registerUser).get(protect, allUsers)

router.route('/getUser').get(getUserByToken)

module.exports = router