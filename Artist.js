const mongoose = require("mongoose");
const express = require("express");
const app = express();
const db =
	"mongodb+srv://dbUser:627233@clustertesting-j5vap.mongodb.net/Artist?retryWrites=true&w=majority";
const path = require("path");

//Connect to MongoDB database
mongoose
	.connect(process.env.MONGODB_URI || db, { useNewUrlParser: true })
	.then(() => {
		console.log("Connected to database");
	})
	.catch(() => {
		console.log("Error Connected to database");
	});

// artist schema
const artistSchema = new mongoose.Schema({
	ID: { type: Number },
	Name: { type: String },
	PictureURL: { type: String },
	AlbumNum: { type: Number },
	FansNum: { type: Number },
	UserID: { type: String }, //to identify saved artist of each user
});

// user schema
const userSchema = new mongoose.Schema({
	name: { type: String },
	email: { type: String },
	password: { type: String },
	date: { type: Date, default: Date.now },
});

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "client", "build", "index.html"));
	});
}

const Artist = mongoose.model("Data", artistSchema);
const User = mongoose.model("User", userSchema);

module.exports.Artist = Artist;
module.exports.User = User;
