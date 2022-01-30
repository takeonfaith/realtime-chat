const express = require('express')
const { registerUser, authUser, getUserByToken, allUsers, getUserByStr, addFriend, rejectFriend, acceptFriend } = require('../controllers/user-controllers')
const protect = require('../middleware/auth-middleware')

const router = express.Router()

router.route('/login').post(authUser)

router.route('/').post(registerUser).get(protect, allUsers)

router.route('/getUser').get(getUserByToken)

router.route('/addFriend').post(protect, addFriend)

router.route('/acceptFriend').post(protect, acceptFriend)

router.route('/rejectFriend').post(protect, rejectFriend)

module.exports = router