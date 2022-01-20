const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/message-model");
const User = require('../models/user-model')
const Chat = require('../models/chat-model')

const sendMessage = expressAsyncHandler(async (req, res) => {
	const { content, chatId } = req.body

	if (!chatId || !content) {
		console.log("[Error] Не все данные были переданы в запрос");
		res.sendStatus(400)
	}

	let newMessage = {
		sender: req.user._id,
		content,
		chat: chatId
	}

	try {
		let message = await Message.create({ ...newMessage })

		message = await message.populate("sender", 'name pic')
		message = await message.populate("chat")
		message = await User.populate(message, {
			path: 'chat.users',
			select: 'name login'
		})
		message = await Message.populate(message, {
			path: "chat.latestMessage"
		})

		await Chat.findByIdAndUpdate(req.body.chatId, {
			latestMessage: message,
		})

		res.json(message)
	} catch (error) {
		res.status(400)
		console.log(error.message);
		throw new Error(error.message)
	}
})


const allMessages = expressAsyncHandler(async (req, res) => {
	try {
		const messages = await Message.find({ chat: req.params.chatId })
			.populate('sender', 'name login')
			.populate('chat')

		res.json(messages)

	} catch (error) {

	}
})

module.exports = {
	sendMessage,
	allMessages
}