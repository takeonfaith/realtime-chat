const expressAsyncHandler = require("express-async-handler");
const normalizeString = require("../config/normalize-string");
const Chat = require("../models/chat-model");
const { find } = require("../models/user-model");
const User = require("../models/user-model");

const accessChat = expressAsyncHandler(async (req, res) => {
	const { userId } = req.body
	if (!userId) {
		console.log("Айди не был отправлен с параметром");
		return res.sendStatus(400)
	}

	let IsChat = await Chat.find({
		isGroupChat: false,
		$and: [
			{ users: { $elemMatch: { $eq: req.user._id } } },
			{ users: { $elemMatch: { $eq: userId } } },
		]
	}).populate("users", "-password").populate("latestMessage")


	IsChat = await User.populate(IsChat, {
		path: 'latestMessage.sender',
		select: "name"
	})


	if (IsChat.length) {
		return res.status(200).send(IsChat[0])
	} else {
		let chatData = {
			chatName: "direct messages",
			isGroupChat: false,
			users: [req.user._id, userId]
		}

		try {
			const createdChat = await Chat.create(chatData)

			const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password")

			res.status(200).send(fullChat)
		} catch (error) {
			res.status(400)
			console.log('Возникла ошибка в доступе к чату:', error.message);
			throw new Error(error.message)
		}
	}
})

const fetchChats = expressAsyncHandler(async (req, res) => {
	try {
		Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
			.populate("users", "-password")
			.populate("groupAdmin", "-password")
			.populate("latestMessage")
			.sort({ updatedAt: '-1' })
			.then(async (results) => {
				results = await User.populate(results, {
					path: "latestMessage.sender",
					select: "name"
				})

				res.send(results)
			})
	} catch (error) {
		throw new Error(error.message)
	}
})

const createGroupChat = expressAsyncHandler(async (req, res) => {
	if (!req.body.users || !req.body.name) {
		return res.status(400).send("Пожалуйста, заполните все поля")
	}

	console.log(req.body.users);

	let users = JSON.parse(req.body.users)

	if (users.length < 2) {
		return res.status(400).send("Необходимо, чтобы было больше двух человек в чате")
	}

	users.push(req.user)

	try {
		const groupChat = await Chat.create({
			chatName: req.body.name,
			users,
			isGroupChat: true,
			groupAdmin: req.user
		})

		const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
			.populate("users", "-password")
			.populate("groupAdmin", "-password")

		res.status(200).json(fullGroupChat)
	} catch (error) {
		res.status(400)
		throw new Error(error.message)
	}
})

const renameGroup = expressAsyncHandler(async (req, res) => {
	const { chatId, chatName } = req.body

	const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true })
		.populate("users", "-password")
		.populate("groupAdmin", "-password")

	if (!updatedChat) {
		res.status(404)
		console.log('Не удалось переименовать чат:');
		throw new Error("Чат не был найден")
	} else {
		res.json(updatedChat)
	}
})

const addToGroup = expressAsyncHandler(async (req, res) => {
	const { chatId, userId } = req.body
	console.log('--------add to group----------', chatId, userId);
	const added = await Chat.findByIdAndUpdate(chatId, {
		$push: { users: userId }
	}, { new: true })
		.populate("users", "-password")
		.populate("groupAdmin", "-password")

	if (!added) {
		res.status(404)
		throw new Error("Чат не был найден")
	} else {
		res.json(added)
	}
})

const removeFromGroup = expressAsyncHandler(async (req, res) => {
	const { chatId, userId } = req.body

	const removed = await Chat.findByIdAndUpdate(chatId, {
		$pull: { users: userId }
	}, { new: true })
		.populate("users", "-password")
		.populate("groupAdmin", "-password")

	if (!removed) {
		res.status(404)
		throw new Error("Чат не был найден")
	} else {
		res.json(removed)
	}
})

const searchChats = expressAsyncHandler(async (req, res) => {
	try {
		Chat
			.find({ users: { $elemMatch: { $eq: req.user._id } } })
			.populate("users", "-password")
			.populate("groupAdmin", "-password")
			.populate("latestMessage")
			.then((result) => {
				const foundChats = result.filter((chat) => {
					if (chat.isGroupChat) {
						return normalizeString(chat.chatName).includes(req.params.str)
					} else {
						const otherUser = chat.users.find(user => !user._id.equals(req.user._id))

						return normalizeString(otherUser.name).includes(req.params.str)
					}
				})
				res.send(foundChats)
			})
	} catch (error) {
		console.log('Ошибка', error.message);
	}
})

module.exports = {
	accessChat,
	fetchChats,
	createGroupChat,
	renameGroup,
	addToGroup,
	removeFromGroup,
	searchChats
}