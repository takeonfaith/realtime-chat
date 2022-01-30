const express = require('express')
const { sendMessage, allMessages, searchMessages, searchAllMessages } = require('../controllers/message-controllers')
const protect = require('../middleware/auth-middleware')

const router = express.Router()

router.route('/').post(protect, sendMessage).get(protect, searchAllMessages)

router.route('/:chatId').get(protect, allMessages)

router.route('/:chatId/search/').get(protect, searchMessages)

module.exports = router