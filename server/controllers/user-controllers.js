const expressAsyncHandler = require("express-async-handler")
const res = require("express/lib/response")
const generateToken = require("../config/generate-token")
const jwt = require('jsonwebtoken')
const User = require("../models/user-model")


const registerUser = expressAsyncHandler(async (req, res) => {
	const { name, login, password } = req.body

	if (!name || !login || !password) {
		res.status(400)
		throw new Error("Необходимо заполнить все поля")

	}
	const userExists = await User.findOne({ login })

	if (userExists) {
		throw new Error("Логин занят, попробуйте другой")
	}

	const user = await User.create({
		name,
		login,
		password
	})

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			login: user.login,
			token: generateToken(user.id)
		})
	} else {
		res.status(400)
		throw new Error("Не удалось добавить пользователя")
	}
})

const authUser = expressAsyncHandler(async (req, res) => {
	const { login, password } = req.body

	const user = await User.findOne({ login }).populate("friends.user", 'name login')


	if (user && (await user.matchPassword(password))) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			login: user.login,
			friends: user.friends,
			token: generateToken(user.id)
		})
	}
	else {
		res.sendStatus(401)
		throw new Error("Неверный логин или пароль")
	}
})

const getUserByToken = expressAsyncHandler(async (req, res) => {
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
		try {
			token = req.headers.authorization.split(" ")[1]
			const decoded = jwt.verify(token, process.env.JWT_SECRET)
			const user = await User.findById(decoded.id).populate('friends.user', 'name login').select("-password")

			res.send(user)
		} catch (error) {
			res.status(401)
			throw new Error('Не получилось авторизоваться')
		}
	}

	if (!token) {
		res.status(401)
		throw new Error("Нет токена")
	}
})

const allUsers = expressAsyncHandler(async (req, res) => {
	const keyword = req.query.search ? {
		$or: [{
			name: { $regex: req.query.search, $options: "i" },
		},
		{
			login: { $regex: req.query.search, $options: "i" },
		}]
	} : {}

	const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }).select('-password')

	res.send(users)
})

const addFriend = expressAsyncHandler(async (req, res) => {
	try {
		// console.log('user', req.user, req.body.friendId);

		const { user } = req

		await User.findByIdAndUpdate(user._id, {
			$push: { friends: { user: req.body.friendId, status: 'requested' } }
		}, { new: true })
		await User.findByIdAndUpdate(req.body.friendId, {
			$push: { friends: { user: user._id, status: 'pending' } }
		}, { new: true })

		res.sendStatus(200)

	} catch (error) {
		res.sendStatus(400)
		console.log(error.message);
	}
})


module.exports = { registerUser, authUser, getUserByToken, allUsers, addFriend }