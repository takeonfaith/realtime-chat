require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path')
const cors = require('cors');
const CORS_CONFIG = {
	origin: process.env.CLIENT_URL,
	methods: ["POST", "PUT", "GET"],
	credentials: true,
	allowEIO3: true
}

app.use(cors(
	CORS_CONFIG
));


const connectDB = require('./config/db')
const { notFound, errorHandler } = require('./middleware/error')
// For Allowing Cross Site Origin Requests

const router = require('./routes/user-routes')
const chatRouter = require('./routes/chat-routes')
const messageRouter = require('./routes/message-routes');

connectDB()
app.use(express.json())

const PORT = process.env.PORT

const http = require('http').Server(app);
const io = require('socket.io')(http, {
	pingTimeout: 60000,
	cors: CORS_CONFIG,
	transport: ['websocket']
});


io.on('connection', function (socket) {
	console.log('A user connected');

	socket.on('setup', (userData) => {
		socket.join(userData._id)
		console.log(userData._id);
		socket.emit("connected")
	})

	socket.on('join chat', (room) => {
		socket.join(room)
		console.log('User joined room', room);
	})

	socket.on('typing', (room) => {
		socket.in(room).emit('typing')
	})
	socket.on('stop typing', (room) => {
		socket.in(room).emit('stop typing')
	})

	socket.on('new message', (newMessage) => {
		let chat = newMessage.chat

		if (!chat.users) return console.log('В чате нет пользователей');

		chat.users.forEach((user) => {
			if (user._id === newMessage.sender._id) return
			console.log('message sent to', user.name);
			socket.in(user._id).emit('message received', newMessage)
		})
	})

	socket.off('setup', () => {
		console.log('user disconected from chat');
		socket.leave(userData._id)
	})

	socket.on('disconnect', function () {
		console.log('A user disconnected');
	});
});

app.use('/api/user', router)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)

// ------------- Deploy -------------

const __dirname1 = path.resolve().slice(0, path.resolve().length - 7)
if (process.env.NODE_ENV === 'production') {
	console.log(__dirname1);
	app.use(express.static(path.join(__dirname1, '/client/build')))

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname1, 'client', 'build', 'index.html'))
	})
} else {
	app.get('/', (req, res) => {
		res.send("API is running successfully")
	})
}

// ------------- Deploy -------------

app.use(notFound)
app.use(errorHandler)

http.listen(PORT, function () {
	console.log(`listening on ${PORT}`);
});

