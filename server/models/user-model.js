const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");


const userSchema = mongoose.Schema(
	{
		name: { type: String, required: true },
		login: { type: String, required: true },
		password: { type: String, required: true },
		friends: [{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"
				// 'requested' | 'added' | 'pending'
			}, status: { type: String, required: true }
		}],
	}
)

userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
	if (!this.isModified) {
		next()
	}

	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
})


const User = mongoose.model("User", userSchema)

module.exports = User