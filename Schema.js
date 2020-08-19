const mongoose = require("mongoose");
const express = require("express");
const app = express();
const db =
	"mongodb+srv://dbUser:627233@clustertesting-j5vap.mongodb.net/COVID19ContactTracing?retryWrites=true&w=majority";
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
const userVisitorSchema = new mongoose.Schema({
	ic_num: { type: String, required: true },
	ic_fname: { type: String, required: true  },
	ic_address: { type: String, required: true  },
	phone_no: { type: String, required: true  },
	email: { type: String, required: true  },
	home_lat: { type: Number, required: true  },
	home_lng: { type: Number, required: true  },
	home_id: { type: String, required: true  },
	password: { type: String, required: true  },
	// date_created: { type: String, required: true },
	// date_created: { type: Date, default: Date.now },
	date_created: { type: Date },
});

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "client", "build", "index.html"));
	});
}

const Artist = mongoose.model("Data", artistSchema);
const userVisitor = mongoose.model("user_visitor", userVisitorSchema);

module.exports.Artist = Artist;
module.exports.userVisitor = userVisitor;
