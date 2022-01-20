const express = require("express");
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup, searchChats } = require("../controllers/chat-controllers");
const protect = require("../middleware/auth-middleware");

const router = express.Router()

router.route('/').post(protect, accessChat).get(protect, fetchChats)
router.route('/group').post(protect, createGroupChat)
router.route('/rename').put(protect, renameGroup)
router.route('/groupadd').put(protect, addToGroup)
router.route('/groupremove').put(protect, removeFromGroup)
router.route('/:str').get(protect, searchChats)

module.exports = router