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
// const artistSchema = new mongoose.Schema({
// 	ID: { type: Number },
// 	Name: { type: String },
// 	PictureURL: { type: String },
// 	AlbumNum: { type: Number },
// 	FansNum: { type: Number },
// 	UserID: { type: String }, //to identify saved artist of each user
// });

// user visitor schema
const userVisitorSchema = new mongoose.Schema({
	ic_num: { type: String, required: true },
	ic_fname: { type: String, required: true },
	ic_address: { type: String, required: true },
	phone_no: { type: String, required: true },
	email: { type: String, required: true },
	home_lat: { type: Number, required: true },
	home_lng: { type: Number, required: true },
	home_id: { type: String, required: true },
	password: { type: String, required: true },
	// date_created: { type: String, required: true },
	// date_created: { type: Date, default: Date.now },
	date_created: { type: Date },
});

// user premise owner schema
const userPremiseOwnerSchema = new mongoose.Schema({
	owner_fname: { type: String, required: true },
	premise_name: { type: String, required: true },
	phone_no: { type: String, required: true },
	email: { type: String, required: true },
	premise_address: { type: String, required: true },
	premise_postcode: { type: String, required: true },
	premise_state: { type: String, required: true },
	premise_lat: { type: Number, required: true },
	premise_lng: { type: Number, required: true },
	premise_id: { type: String, required: true },
	password: { type: String, required: true },
	date_created: { type: Date },
	// premise_qr_codes: [
	// 	{ type: mongoose.Schema.Types.ObjectId, ref: "premise_qr_code" },
	// ],
});

// premise qr code schema
const premiseQRCodeSchema = new mongoose.Schema({
	entry_point: { type: String, required: true },
	user_premiseowner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user_premiseowner",
	},
	date_created: { type: Date },
});

// check in record schema
const checkInRecordSchema = new mongoose.Schema({
	user_visitor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user_visitor",
	},
	user_premiseowner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user_premiseowner",
	},
	premise_qr_code: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "premise_qr_code",
	},
	date_created: { type: Date },
});

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "client", "build", "index.html"));
	});
}

const userVisitor = mongoose.model("user_visitor", userVisitorSchema);
const userPremiseOwner = mongoose.model(
	"user_premiseowner",
	userPremiseOwnerSchema
);
const premiseQRCode = mongoose.model("premise_qr_code", premiseQRCodeSchema);
const checkInRecord = mongoose.model("check_in_record", checkInRecordSchema);

module.exports.userVisitor = userVisitor;
module.exports.userPremiseOwner = userPremiseOwner;
module.exports.premiseQRCode = premiseQRCode;
module.exports.checkInRecord = checkInRecord;
