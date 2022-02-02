const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/message-model");
const User = require('../models/user-model')
const Chat = require('../models/chat-model')

const sendMessage = expressAsyncHandler(async (req, res) => {
	const { content, chatId, forwardedMessages } = req.body

	if (!chatId) {
		console.log("[Error] Не все данные были переданы в запрос");
		res.sendStatus(400)
	}

	let newMessage = {
		sender: req.user._id,
		content: content,
		chat: chatId,
		forwardedMessages: forwardedMessages ?? []
	}

	try {
		let message = await Message.create({ ...newMessage })

		message = await message.populate("sender", 'name pic')
		message = await message.populate("chat")
		message = await message.populate('forwardedMessages')
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
		let messages = await Message.find({ chat: req.params.chatId })
			.populate('sender', 'name login')
			.populate('chat')
			.populate('forwardedMessages')

		messages = await User.populate(messages, {
			path: 'forwardedMessages.sender',
			select: 'name login',
		})

		messages = await Message.populate(messages, {
			path: 'forwardedMessages.forwardedMessages',
		})

		messages = await User.populate(messages, {
			path: 'forwardedMessages.forwardedMessages.sender',
			select: 'name login',
		})


		res.json(messages)

	} catch (error) {
		console.log(error.message);
	}
})

const searchMessages = expressAsyncHandler(async (req, res) => {
	try {
		const messages = await Message.find({ chat: req.params.chatId, $and: [{ content: { $regex: req.query.query, $options: "i" } }] })
			.populate('sender', 'name login')
			.populate('chat')

		res.json(messages)

	} catch (error) {
		console.log(error.message);
	}
})

const searchAllMessages = expressAsyncHandler(async (req, res) => {
	try {
		Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }).then(async userChats => {
			let message = await Message.find({
				content: { $regex: req.query.query, $options: "i" }, $and: [{
					chat: { $in: userChats.map(chat => chat._id) }
				}]
			})
				.populate('sender', 'name login')
				.populate('chat')

			message = await User.populate(message, {
				path: 'chat.users',
				select: 'name login'
			})
			res.json(message)
		})

	} catch (error) {
		console.log(error.message);
	}
})

module.exports = {
	sendMessage,
	allMessages,
	searchMessages,
	searchAllMessages
}