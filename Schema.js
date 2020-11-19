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
	ic_num: {
		type: String,
		unique: true,
		index: true,
		required: true,
		maxlength: 100,
	},
	ic_fname: { type: String, required: true, maxlength: 100 },
	ic_address: { type: String, required: true, maxlength: 100 },
	phone_no: {
		type: String,
		unique: true,
		index: true,
		required: true,
		maxlength: 100,
	},
	email: {
		type: String,
		unique: true,
		index: true,
		required: true,
		maxlength: 100,
	},
	home_lat: { type: Number, required: true, max: 200 },
	home_lng: { type: Number, required: true, max: 200 },
	home_id: { type: String, required: true, maxlength: 100 },
	password: { type: String, required: true, maxlength: 100 },
	// date_created: { type: String, required: true },
	// date_created: { type: Date, default: Date.now },
	date_created: { type: Date },
});

// user premise owner schema
const userPremiseOwnerSchema = new mongoose.Schema({
	owner_fname: { type: String, required: true, maxlength: 100 },
	premise_name: { type: String, required: true, maxlength: 100 },
	phone_no: {
		type: String,
		unique: true,
		index: true,
		required: true,
		maxlength: 100,
	},
	email: {
		type: String,
		unique: true,
		index: true,
		required: true,
		maxlength: 100,
	},
	premise_address: { type: String, required: true, maxlength: 100 },
	premise_postcode: { type: String, required: true, maxlength: 100 },
	premise_state: { type: String, required: true, maxlength: 100 },
	premise_lat: { type: Number, required: true, max: 200 },
	premise_lng: { type: Number, required: true, max: 200 },
	premise_id: { type: String, required: true, maxlength: 100 },
	password: { type: String, required: true, maxlength: 100 },
	date_created: { type: Date },
	// premise_qr_codes: [
	// 	{ type: mongoose.Schema.Types.ObjectId, ref: "premise_qr_code" },
	// ],
});

// premise qr code schema
const premiseQRCodeSchema = new mongoose.Schema({
	entry_point: { type: String, required: true, maxlength: 100 },
	user_premiseowner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user_premiseowner",
	},
	active: { type: Boolean, required: true },
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
	visitor_dependent: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "visitor_dependent",
	},
	date_created: { type: Date },
});

// dependent schema
const visitorDependentSchema = new mongoose.Schema({
	ic_num: {
		type: String,
		required: true,
		maxlength: 100,
	},
	ic_fname: { type: String, required: true, maxlength: 100 },
	relationship: { type: String, required: true, maxlength: 100 },
	user_visitor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user_visitor",
	},
	active: { type: Boolean, required: true },
	date_created: { type: Date },
});

// health risk assessment record schema
const healthRiskAssessmentRecordSchema = new mongoose.Schema({
	user_visitor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user_visitor",
	},
	visitor_dependent: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "visitor_dependent",
	},
	responses: { type: Array, required: true },
	result: { type: Boolean, required: true },
	date_created: { type: Date },
});

// saved casual contact groups schema
const savedCasualContactsGroupSchema = new mongoose.Schema({
	confirmed_case_visitor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user_visitor",
	},
	confirmed_case_dependent: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "visitor_dependent",
	},
	staff: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "staff",
	},
	day_range_check_in: { type: String, required: true, maxlength: 100 },
	time_range_check_in_before: { type: String, required: true, maxlength: 100 },
	time_range_check_in_after: { type: String, required: true, maxlength: 100 },
	// completed: { type: Boolean, required: true },
	date_created: { type: Date },
});

// dependent schema
const savedConfirmedCaseCheckInSchema = new mongoose.Schema({
	saved_casual_contacts_group: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "saved_casual_contacts_group",
	},
	check_in_record: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "check_in_record",
	},
	user_premiseowner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user_premiseowner",
	},
	// completed: { type: Boolean, required: true },
	date_created: { type: Date },
});

// dependent schema
const savedCasualContactCheckInSchema = new mongoose.Schema({
	saved_casual_contacts_group: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "saved_casual_contacts_group",
	},
	saved_confirmed_case_check_in: {
		type: mongoose.Schema.Types.ObjectId,
		// ref: "saved_confirmed_case_check_in",
		ref: "check_in_record",
	},
	check_in_record: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "check_in_record",
	},
	user_visitor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user_visitor",
	},
	visitor_dependent: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "visitor_dependent",
	},
	// completed: { type: Boolean, required: true },
	date_created: { type: Date },
});

// hotspot
const hotspotSchema = new mongoose.Schema({
	check_in_record: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "check_in_record",
	},
	user_premiseowner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user_premiseowner",
	},
	place_id: { type: String, required: true, maxlength: 100 },
	place_lat: { type: String, required: true, maxlength: 100 },
	place_lng: { type: String, required: true, maxlength: 100 },
	// date_end: { type: Date },
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
const visitorDependent = mongoose.model(
	"visitor_dependent",
	visitorDependentSchema
);
const healthRiskAssessmentRecord = mongoose.model(
	"health_risk_assessment_record",
	healthRiskAssessmentRecordSchema
);
const savedCasualContactsGroup = mongoose.model(
	"saved_casual_contacts_group",
	savedCasualContactsGroupSchema
);
const savedConfirmedCaseCheckIn = mongoose.model(
	"saved_confirmed_case_check_in",
	savedConfirmedCaseCheckInSchema
);
const savedCasualContactCheckIn = mongoose.model(
	"saved_casual_contact_check_in",
	savedCasualContactCheckInSchema
);
const hotspot = mongoose.model("hotspot", hotspotSchema);

module.exports.userVisitor = userVisitor;
module.exports.userPremiseOwner = userPremiseOwner;
module.exports.premiseQRCode = premiseQRCode;
module.exports.checkInRecord = checkInRecord;
module.exports.visitorDependent = visitorDependent;
module.exports.healthRiskAssessmentRecord = healthRiskAssessmentRecord;
module.exports.savedCasualContactsGroup = savedCasualContactsGroup;
module.exports.savedConfirmedCaseCheckIn = savedConfirmedCaseCheckIn;
module.exports.savedCasualContactCheckIn = savedCasualContactCheckIn;
module.exports.hotspot = hotspot;
