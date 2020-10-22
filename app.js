const express = require("express");
const app = express();
const axios = require("axios");
const userVisitor = require("./Schema").userVisitor;
const userPremiseOwner = require("./Schema").userPremiseOwner;
const premiseQRCode = require("./Schema").premiseQRCode;
const checkInRecord = require("./Schema").checkInRecord;
const visitorDependent = require("./Schema").visitorDependent;
const healthRiskAssessmentRecord = require("./Schema")
	.healthRiskAssessmentRecord;
const savedCasualContactsGroup = require("./Schema").savedCasualContactsGroup;
const savedConfirmedCaseCheckIn = require("./Schema").savedConfirmedCaseCheckIn;
const savedCasualContactCheckIn = require("./Schema").savedCasualContactCheckIn;
const hotspot = require("./Schema").hotspot;
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
// passport remember me
// const passport = require("passport");
// const passportRememberMe = require("passport-remember-me");
// const RememberMeStrategy = require("passport-remember-me").Strategy;
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(passport.authenticate("remember-me"));

// Nodejs encryption with CTR
const crypto = require("crypto"),
	algorithm = "aes-256-ctr",
	password = "vfAd1e7A8bu39sb13aF2";

// cookie parser
var cookieParser = require("cookie-parser");
app.use(cookieParser());

// express session
// const session = require("express-session");
// app.use(
// 	session({
// 		secret: "vfAd1e7A8bu39sb13aF2",
// 		resave: true, // false=dont force session to be saved back to the session store, even if the session was never modified during the request
// 		saveUninitialized: true, // true=forces a session that is "uninitialized" to be saved to the store
// 		// cookie: { secure: true }
// 	})
// );
// google vision api
// const vision = require("@google-cloud/vision");
// const client = new vision.ImageAnnotatorClient({
// 	keyFilename: "my-key.json",
// });

// initialize express session
// const session = require("express-session");
// app.set("trust proxy", 1); // trust first proxy
// app.use(
// 	session({
// 		secret: "vfAd1e7A8bu39sb13aF2",
// 		resave: true, // false=dont force session to be saved back to the session store, even if the session was never modified during the request
// 		saveUninitialized: true, // true=forces a session that is "uninitialized" to be saved to the store
// 		// cookie: { secure: true }
// 	})
// );

var path = require("path");
// const { version } = require("punycode");

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// passport.use(
// 	new RememberMeStrategy(
// 		function (token, done) {
// 			Token.consume(token, function (err, user) {
// 				if (err) {
// 					return done(err);
// 				}
// 				if (!user) {
// 					return done(null, false);
// 				}
// 				return done(null, user);
// 			});
// 		},
// 		function (user, done) {
// 			var token = utils.generateToken(64);
// 			Token.save(token, { userId: user.id }, function (err) {
// 				if (err) {
// 					return done(err);
// 				}
// 				return done(null, token);
// 			});
// 		}
// 	)
// );

// app.post("/save_ic_info", (req, res) => {
// 	sess = req.session;
// 	sess.ic_num = req.query.ic_num;
// 	sess.ic_fname = req.query.ic_fname;
// 	sess.ic_address = req.query.ic_address;
// 	sess.save();
// 	console.log(sess.ic_num);
// 	res.send("done");
// });

function encrypt(text) {
	var cipher = crypto.createCipher(algorithm, password);
	var crypted = cipher.update(text, "utf8", "hex");
	crypted += cipher.final("hex");
	return crypted;
}

function decrypt(text) {
	var decipher = crypto.createDecipher(algorithm, password);
	var dec = decipher.update(text, "hex", "utf8");
	dec += decipher.final("utf8");
	return dec;
}

app.post("/getExistingIcNum", (req, res) => {
	userVisitor
		.findOne({ ic_num: req.body.ic_num })
		.then((response) => {
			if (response) {
				res.send(true);
			}
			// else {
			// 	res.send(false);
			// }
		})
		.catch((error) => {
			res.status(400).json(error);
		});

	visitorDependent
		.findOne({
			$and: [{ ic_num: req.body.ic_num }, { active: true }],
		})
		.then((response) => {
			if (response) {
				res.send(true);
			} else {
				res.send(false);
			}
		});
	// .catch((error) => {
	// 	res.status(400).json(error);
	// });
});

// app.post("/save_phone_no", (req, res) => {
// 	sess = req.session;
// 	sess.phone_no = req.query.phone_no;
// 	sess.save();
// 	console.log(sess.phone_no);
// 	res.send("done");
// });

app.post("/getExistingPhoneNo", (req, res) => {
	userVisitor
		.findOne({ phone_no: req.body.phone_no })
		.then((response) => {
			if (response) {
				res.send(true);
			} else {
				res.send(false);
			}
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

app.post("/getExistingPhoneNo_PO", (req, res) => {
	userPremiseOwner
		.findOne({ phone_no: req.body.phone_no })
		.then((response) => {
			if (response) {
				res.send(true);
			} else {
				res.send(false);
			}
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

// app.post("/save_email", (req, res) => {
// 	sess = req.session;
// 	// console.log(sess.phone_no);
// 	sess.email = req.query.email;
// 	sess.save();
// 	console.log(sess.email);
// 	res.send("done");
// });

app.post("/getExistingEmail", (req, res) => {
	userVisitor
		.findOne({ email: req.body.email })
		.then((response) => {
			if (response) {
				res.send(true);
			} else {
				res.send(false);
			}
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

app.post("/getExistingEmail_PO", (req, res) => {
	userPremiseOwner
		.findOne({ email: req.body.email })
		.then((response) => {
			if (response) {
				res.send(true);
			} else {
				res.send(false);
			}
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

// app.post("/save_location", (req, res) => {
// 	sess = req.session;

// 	// sess.email = sess.email;
// 	sess.home_lat = req.query.home_lat;
// 	sess.home_lng = req.query.home_lng;
// 	sess.home_id = req.query.home_id;
// 	sess.save();
// 	console.log(sess.home_lat);
// 	res.send("done");
// });
app.post("/save_premise_qrcode", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	const existedMainQRCode = await premiseQRCode
		.find({
			// $and: [
			// 	{ entry_point: "Main" },
			// 	{ user_premiseowner: decrypt(remember_me.encryptedUid) },
			// ],
			user_premiseowner: decrypt(remember_me.encryptedUid),
		})
		.populate("user_premiseowner");
	if (Object.keys(existedMainQRCode).length === 0) {
		var now = new Date();
		const qrcode = new premiseQRCode({
			entry_point: "Main",
			user_premiseowner: decrypt(remember_me.encryptedUid),
			date_created: new Date(now.getTime() + 480 * 60000),
		});
		try {
			const savedQRCode = await qrcode.save();
			if (savedQRCode) {
				// const userById = await userPremiseOwner.findById(
				// 	decrypt(remember_me.encryptedUid)
				// );
				// // console.log(qrcode._id);
				// userById.premise_qr_codes.push(qrcode);
				// await userById.save();
				res.send("success");
			} else {
				res.send("failed");
			}
		} catch (error) {
			res.status(400).json(error);
		}
	} else {
		res.send("failed");
	}
});

app.post("/save_new_entry_point", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	const existedEntryPointName = await premiseQRCode.find({
		$and: [
			{ entry_point: req.body.new_entry_point },
			{ active: true },
			{ user_premiseowner: decrypt(remember_me.encryptedUid) },
		],
	});
	if (Object.keys(existedEntryPointName).length === 0) {
		var now = new Date();
		const qrcode = new premiseQRCode({
			entry_point: req.body.new_entry_point,
			user_premiseowner: decrypt(remember_me.encryptedUid),
			active: true,
			date_created: new Date(now.getTime() + 480 * 60000),
		});
		try {
			const savedQRCode = await qrcode.save();
			if (savedQRCode) {
				res.send("success");
			} else {
				res.send("failed");
			}
		} catch (error) {
			res.status(400).json(error);
		}
	} else {
		res.send("existed");
	}
});

app.post("/edit_entry_point_name", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	const existedEntryPointName = await premiseQRCode.find({
		$and: [
			{ _id: { $ne: req.body.selected_entry_point_id } },
			{ entry_point: req.body.edit_entry_point_name },
			{ active: true },
			{ user_premiseowner: decrypt(remember_me.encryptedUid) },
		],
	});
	if (Object.keys(existedEntryPointName).length === 0) {
		premiseQRCode.update(
			{
				$and: [
					{ _id: req.body.selected_entry_point_id },
					{ user_premiseowner: decrypt(remember_me.encryptedUid) },
				],
			},
			{ $set: { entry_point: req.body.edit_entry_point_name } },
			(err, place) => {
				if (err) return res.send("failed");
				return res.send("success");
			}
		);
	} else {
		res.send("existed");
	}
});

app.post("/delete_dependent", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	visitorDependent.update(
		{
			$and: [
				{ _id: req.body.dependent_id },
				{ user_visitor: decrypt(remember_me.encryptedUid) },
			],
		},
		{ $set: { active: false } },
		(err, place) => {
			if (err) return res.send("failed");
			return res.send("success");
		}
	);
});

app.post("/regenerate_dependent_qrcode", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	visitorDependent.update(
		{
			$and: [
				{ _id: req.body.dependent_id },
				{ user_visitor: decrypt(remember_me.encryptedUid) },
			],
		},
		{ $set: { active: false } },
		(err, place) => {
			if (err) return res.send("failed");
			// return res.send("success");
		}
	);

	var now = new Date();
	const dependent = new visitorDependent({
		ic_num: req.body.ic_num,
		ic_fname: req.body.ic_fname,
		relationship: req.body.relationship,
		user_visitor: decrypt(remember_me.encryptedUid),
		active: true,
		date_created: new Date(now.getTime() + 480 * 60000),
	});
	try {
		const savedDependent = await dependent.save();
		if (savedDependent) {
			res.send("success");
		} else {
			res.send("failed");
		}
	} catch (error) {
		res.status(400).json(error);
	}
});

app.post("/delete_entry_point", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	premiseQRCode.update(
		{
			$and: [
				{ _id: req.body.selected_entry_point_id },
				{ user_premiseowner: decrypt(remember_me.encryptedUid) },
			],
		},
		{ $set: { active: false } },
		(err, place) => {
			if (err) return res.send("failed");
			return res.send("success");
		}
	);
});

app.post("/regenerate_entry_point", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	premiseQRCode.update(
		{
			$and: [
				{ _id: req.body.selected_entry_point_id },
				{ user_premiseowner: decrypt(remember_me.encryptedUid) },
			],
		},
		{ $set: { active: false } },
		(err, place) => {
			if (err) return res.send("failed");
			// return res.send("success");
		}
	);

	var now = new Date();
	const qrcode = new premiseQRCode({
		entry_point: req.body.selected_entry_point,
		user_premiseowner: decrypt(remember_me.encryptedUid),
		active: true,
		date_created: new Date(now.getTime() + 480 * 60000),
	});
	try {
		const savedQRCode = await qrcode.save();
		if (savedQRCode) {
			res.send("success");
		} else {
			res.send("failed");
		}
	} catch (error) {
		res.status(400).json(error);
	}
});

app.post("/check_in_premise", async (req, res) => {
	if (req.body.for === "COVID-19_Contact_Tracing_App") {
		const remember_me = req.cookies["remember_me"];
		const existedPremiseOwner = await userPremiseOwner.findOne({
			_id: req.body.pid,
		});
		if (Object.keys(existedPremiseOwner).length === 0) {
			res.send([]);
		} else {
			const existedQRCode = await premiseQRCode.findOne({
				$and: [{ _id: req.body.qrid }, { active: true }],
			});
			if (Object.keys(existedQRCode).length === 0) {
				res.send([]);
			} else {
				var now = new Date();
				const check_in = new checkInRecord({
					user_visitor: decrypt(remember_me.encryptedUid),
					user_premiseowner: req.body.pid,
					premise_qr_code: req.body.qrid,
					date_created: new Date(now.getTime() + 480 * 60000),
				});
				try {
					const savedCheckIn = await check_in.save();
					if (savedCheckIn) {
						const health_risk = await healthRiskAssessmentRecord.findOne({
							$and: [
								{ user_visitor: decrypt(remember_me.encryptedUid) },
								{ visitor_dependent: { $exists: false } },
							],
						});
						// console.log(health_risk.result);
						var health_risk_result;

						if (!health_risk) {
							health_risk_result = "Unknown";
						} else {
							health_risk_result = health_risk.result;
						}
						// savedCheckIn["entry_point"] = existedQRCode.entry_point;
						var return_check_in_data = {
							_id: savedCheckIn._id,
							date_created: savedCheckIn.date_created,
							premise_name: existedPremiseOwner.premise_name,
							entry_point: existedQRCode.entry_point,
							health_risk_result: health_risk_result,
						};
						// console.log(return_check_in_data);
						res.send(return_check_in_data);
					} else {
						res.send([]);
					}
				} catch (error) {
					res.status(400).json(error);
				}
			}
		}
	} else {
		res.send([]);
	}
});

app.post("/check_in_premise_dependent", async (req, res) => {
	if (
		req.body.for === "COVID-19_Contact_Tracing_App" &&
		req.body.role === "dependent"
	) {
		const remember_me = req.cookies["remember_me"];
		const existedDependent = await visitorDependent.findOne({
			$and: [{ _id: req.body.did }, { active: true }],
		});
		const existedVisitor = await userVisitor.findOne({
			_id: req.body.uid,
		});
		if (
			Object.keys(existedDependent).length === 0 ||
			Object.keys(existedVisitor).length === 0
		) {
			res.send([]);
		} else {
			var now = new Date();
			const check_in = new checkInRecord({
				user_visitor: req.body.uid,
				user_premiseowner: decrypt(remember_me.encryptedUid),
				premise_qr_code: req.body.selected_entry_point_id,
				visitor_dependent: req.body.did,
				date_created: new Date(now.getTime() + 480 * 60000),
			});
			try {
				const savedCheckIn = await check_in.save();
				if (savedCheckIn) {
					const health_risk = await healthRiskAssessmentRecord.findOne({
						$and: [
							{ user_visitor: req.body.uid },
							{ visitor_dependent: req.body.did },
						],
					});
					// console.log(health_risk.result);
					var health_risk_result;

					if (!health_risk) {
						health_risk_result = "Unknown";
					} else if (health_risk.result == true) {
						health_risk_result = "High";
					} else if (health_risk.result == false) {
						health_risk_result = "Low";
					}

					var return_check_in_data = {
						_id: savedCheckIn._id,
						date_created: savedCheckIn.date_created,
						health_risk_result: health_risk_result,
					};
					res.send(return_check_in_data);
				} else {
					res.send([]);
				}
			} catch (error) {
				res.status(400).json(error);
			}
		}
	} else {
		res.send([]);
	}
});

app.post("/get_main_premise_qrcode", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	const mainQRCode = await premiseQRCode.find({
		$and: [
			{ entry_point: req.body.entry_point },
			{ user_premiseowner: decrypt(remember_me.encryptedUid) },
		],
	});
	res.send(mainQRCode);
});

app.post("/get_premise_info", async (req, res) => {
	const remember_me = req.cookies["remember_me"];

	const premise_info = await userPremiseOwner.findOne({
		_id: decrypt(remember_me.encryptedUid),
	});

	res.send(premise_info);
});

app.post("/get_all_premise_qrcode", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	const premise_name = req.cookies["pname"];

	const allQRCode = await premiseQRCode.find({
		$and: [
			{ user_premiseowner: decrypt(remember_me.encryptedUid) },
			{ active: true },
		],
	});
	allQRCode.premise_name = premise_name;
	res.send(allQRCode);
});

app.post("/get_health_risk_assessment_record", async (req, res) => {
	const remember_me = req.cookies["remember_me"];

	if (req.body.role == "visitor") {
		const record = await healthRiskAssessmentRecord.findOne({
			$and: [
				{ user_visitor: decrypt(remember_me.encryptedUid) },
				{ visitor_dependent: { $exists: false } },
			],
		});
		res.send(record);
	} else {
		const record = await healthRiskAssessmentRecord.findOne({
			$and: [
				{ user_visitor: decrypt(remember_me.encryptedUid) },
				{ visitor_dependent: req.body.dependent_id },
			],
		});
		res.send(record);
	}
});

app.post("/save_health_risk_assessment_result", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	var now = new Date();
	var record;
	if (req.body.role == "visitor") {
		record = new healthRiskAssessmentRecord({
			user_visitor: decrypt(remember_me.encryptedUid),
			responses: req.body.responses,
			result: req.body.result,
			date_created: new Date(now.getTime() + 480 * 60000),
		});
	} else {
		record = new healthRiskAssessmentRecord({
			user_visitor: decrypt(remember_me.encryptedUid),
			visitor_dependent: req.body.dependent_id,
			responses: req.body.responses,
			result: req.body.result,
			date_created: new Date(now.getTime() + 480 * 60000),
		});
	}

	try {
		const savedRecord = await record.save();
		if (savedRecord) {
			res.send("success");
		} else {
			res.send("failed");
		}
	} catch (error) {
		res.status(400).json(error);
	}
});

app.post("/update_health_risk_assessment_result", async (req, res) => {
	// const remember_me = req.cookies["remember_me"];
	var now = new Date();
	healthRiskAssessmentRecord.updateOne(
		{
			_id: req.body.response_record_id,
		},
		{
			$set: {
				responses: req.body.responses,
				result: req.body.result,
				date_created: new Date(now.getTime() + 480 * 60000),
			},
		},
		(err, place) => {
			if (err) return res.send("failed");
			return res.send("success");
		}
	);
});

app.post("/get_all_hotspot", async (req, res) => {
	const allHotspot = await hotspot
		.find()
		.populate("check_in_record")
		.populate("user_premiseowner")
		.exec();
	res.send(allHotspot);
});

app.post("/get_saved_home_location", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	const savedHomeLocation = await userVisitor.findOne({
		_id: decrypt(remember_me.encryptedUid),
	});
	res.send(savedHomeLocation);
});

app.post("/get_premise_owner_info", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	const po_info = await userPremiseOwner.findOne({
		_id: decrypt(remember_me.encryptedUid),
	});
	if (!po_info) {
		return res.send(false);
	}
	res.send(po_info);
});

app.post("/get_premise_owner_hotspot", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	const is_hotspot = await hotspot.findOne({
		user_premiseowner: decrypt(remember_me.encryptedUid),
	});
	if (!is_hotspot) {
		return res.send(false);
	}
	res.send(true);
});

app.post("/get_visitor_confirmed_case_list", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	// console.log(req.body.check_in_id);
	const savedCheckIns = await savedConfirmedCaseCheckIn
		// .find({ saved_confirmed_case_check_in: req.body.check_in_id })
		.find({
			user_premiseowner: decrypt(remember_me.encryptedUid),
		})
		// .populate("check_in_record", "date_created")
		// .populate("saved_confirmed_case_check_in", "date_created")
		// .populate("visitor_dependent")
		.populate({
			path: "check_in_record",
			populate: {
				path: "premise_qr_code",
			},
		})
		.exec();

	if (!savedCheckIns || Object.keys(savedCheckIns).length === 0) {
		return res.send(false);
	}
	res.send(savedCheckIns);
});

app.post("/get_visitor_casual_contact_list", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	// console.log(req.body.check_in_id);
	const savedCheckIns = await savedCasualContactCheckIn
		// .find({ saved_confirmed_case_check_in: req.body.check_in_id })
		.find({
			$and: [
				{ user_visitor: decrypt(remember_me.encryptedUid) },
				{ visitor_dependent: { $exists: false } },
			],
		})
		.populate({
			path: "check_in_record",
			// populate: {
			// 	path: "premise_qr_code",
			// 	select: "entry_point",
			// },
			populate: [
				{
					path: "user_premiseowner",
				},
				{ path: "premise_qr_code" },
			],
		})
		.populate("saved_confirmed_case_check_in", "date_created")
		// .populate("visitor_dependent")
		.exec();

	if (!savedCheckIns || Object.keys(savedCheckIns).length === 0) {
		return res.send(false);
	}
	res.send(savedCheckIns);
});

app.post("/get_dependent_casual_contact_list", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	// console.log(req.body.check_in_id);
	const savedCheckIns = await savedCasualContactCheckIn
		// .find({ saved_confirmed_case_check_in: req.body.check_in_id })
		.find({
			$and: [
				{ user_visitor: decrypt(remember_me.encryptedUid) },
				{ visitor_dependent: { $exists: true } },
			],
		})
		.populate({
			path: "check_in_record",
			// populate: {
			// 	path: "premise_qr_code",
			// 	select: "entry_point",
			// },
			populate: [
				{
					path: "user_premiseowner",
				},
				{ path: "premise_qr_code" },
			],
		})
		.populate("saved_confirmed_case_check_in", "date_created")
		.populate("visitor_dependent")
		.exec();

	if (!savedCheckIns || Object.keys(savedCheckIns).length === 0) {
		return res.send(false);
	}
	// console.log(savedCheckIns);
	res.send(savedCheckIns);
});

app.post("/save_new_dependent", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	var now = new Date();
	const newDependent = new visitorDependent({
		ic_num: req.body.ic_number,
		ic_fname: req.body.full_name,
		relationship: req.body.relationship,
		user_visitor: decrypt(remember_me.encryptedUid),
		date_created: new Date(now.getTime() + 480 * 60000),
	});
	try {
		const savedDependent = await newDependent.save();
		if (savedDependent) {
			res.send("success");
		} else {
			res.send("failed");
		}
	} catch (error) {
		res.status(400).json(error);
	}
});

app.post("/get_user_dependent", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	const allDependent = await visitorDependent.find({
		$and: [
			{ user_visitor: decrypt(remember_me.encryptedUid) },
			{ active: true },
		],
	});

	if (Object.keys(allDependent).length === 0) {
		res.send([]);
	}

	var counter = 0;
	var all_dependent_arr = new Array();
	allDependent.forEach(async function (item) {
		const health_risk = await healthRiskAssessmentRecord.findOne({
			$and: [
				{ user_visitor: decrypt(remember_me.encryptedUid) },
				{ visitor_dependent: item._id },
			],
		});

		if (!health_risk) {
			all_dependent_arr.push({
				_id: item._id,
				ic_fname: item.ic_fname,
				ic_num: item.ic_num,
				relationship: item.relationship,
				health_risk: "Unknown",
				date_created: item.date_created,
			});
		} else if (health_risk.result == true) {
			all_dependent_arr.push({
				_id: item._id,
				ic_fname: item.ic_fname,
				ic_num: item.ic_num,
				relationship: item.relationship,
				health_risk: "High",
				date_created: item.date_created,
			});
		} else if (health_risk.result == false) {
			all_dependent_arr.push({
				_id: item._id,
				ic_fname: item.ic_fname,
				ic_num: item.ic_num,
				relationship: item.relationship,
				health_risk: "Low",
				date_created: item.date_created,
			});
		}
		if (counter == allDependent.length - 1) {
			// console.log(all_dependent_arr);
			res.send(all_dependent_arr);
		}
		counter += 1;
	});

	// res.send(allDependent);
});

app.post("/get_user_info_health_risk", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	const user_info = await userVisitor.findOne({
		_id: decrypt(remember_me.encryptedUid),
	});
	const health_risk = await healthRiskAssessmentRecord.findOne({
		user_visitor: decrypt(remember_me.encryptedUid),
	});

	if (!health_risk) {
		var user_info_with_health_risk = {
			_id: user_info._id,
			ic_fname: user_info.ic_fname,
			health_risk: "Unknown",
		};
	} else {
		var user_info_with_health_risk = {
			_id: user_info._id,
			ic_fname: user_info.ic_fname,
			health_risk: health_risk.result,
		};
	}

	res.send(user_info_with_health_risk);
});

app.post("/update_phone_no", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	userVisitor.updateOne(
		{
			_id: decrypt(remember_me.encryptedUid),
		},
		{
			$set: {
				phone_no: req.body.new_phone_no,
			},
		},
		(err, place) => {
			if (err) return res.send("failed");
			return res.send("success");
		}
	);
});

app.post("/update_email", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	userVisitor.updateOne(
		{
			_id: decrypt(remember_me.encryptedUid),
		},
		{
			$set: {
				email: req.body.new_email,
			},
		},
		(err, place) => {
			if (err) return res.send("failed");
			return res.send("success");
		}
	);
});

app.post("/check_current_password", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	const user = await userVisitor.findOne({
		_id: decrypt(remember_me.encryptedUid),
	});
	if (!user) {
		return res.send(false);
	}

	// check if password correct
	const validPsw = await bcrypt.compare(
		req.body.current_password,
		user.password
	);
	if (!validPsw) {
		return res.send(false);
	}

	res.send(true);
});

app.post("/change_password", async (req, res) => {
	const remember_me = req.cookies["remember_me"];

	const salt = await bcrypt.genSalt(10); // default complexity 10
	const hashPsw = await bcrypt.hash(req.body.new_password, salt);

	userVisitor.updateOne(
		{
			_id: decrypt(remember_me.encryptedUid),
		},
		{
			$set: {
				password: hashPsw,
			},
		},
		(err, place) => {
			if (err) return res.send("failed");
			return res.send("success");
		}
	);
});

app.post("/update_home_location", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	userVisitor.updateOne(
		{
			_id: decrypt(remember_me.encryptedUid),
		},
		{
			$set: {
				home_lat: req.body.place_lat,
				home_lng: req.body.place_lng,
				home_id: req.body.place_id,
			},
		},
		(err, place) => {
			if (err) return res.send("failed");
			return res.send("success");
		}
	);
});

app.post("/get_user_info", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	const user_info = await userVisitor.findOne({
		_id: decrypt(remember_me.encryptedUid),
	});
	if (!user_info) {
		res.send(false);
	}
	res.send(user_info);
});

app.post("/get_dependent_info", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	const dependent_info = await visitorDependent.findOne({
		$and: [
			{ user_visitor: decrypt(remember_me.encryptedUid) },
			{ _id: req.body.dependent_id },
		],
	});
	res.send(dependent_info);
});

app.post("/get_user_id", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	res.send(decrypt(remember_me.encryptedUid));
});

app.post("/get_check_in_records_visitor", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	const checkInRecords = await checkInRecord
		.find({
			$and: [
				{ user_visitor: decrypt(remember_me.encryptedUid) },
				{ visitor_dependent: { $exists: false } },
			],
		})
		.sort({ date_created: -1 })
		.populate("user_premiseowner")
		.exec();
	res.send(checkInRecords);
});

app.post("/get_check_in_records_dependent", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	const checkInRecords = await checkInRecord
		.find({
			$and: [
				{ user_visitor: decrypt(remember_me.encryptedUid) },
				{ visitor_dependent: req.body.dependent_id },
			],
		})
		.sort({ date_created: -1 })
		.populate("user_premiseowner")
		.exec();
	res.send(checkInRecords);
});

app.post("/get_real_time_check_in_record", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	var check_in_records_arr = new Array();
	// console.log(req.body.selected_entry_point_id);
	const checkInRecords = await checkInRecord
		.find({
			$and: [
				{ user_premiseowner: decrypt(remember_me.encryptedUid) },
				{ visitor_dependent: { $exists: false } },
				{ premise_qr_code: req.body.selected_entry_point_id },
				{ date_created: { $gte: new Date(req.body.time_from) } },
			],
		})
		.sort({ date_created: -1 })
		.exec();

	// console.log(req.body.time_from);
	// console.log(new Date(req.body.time_from));
	if (Object.keys(checkInRecords).length === 0) {
		res.send(false);
	}
	var counter = 0;
	checkInRecords.forEach(async function (item) {
		const health_risk = await healthRiskAssessmentRecord.findOne({
			$and: [
				{ user_visitor: item.user_visitor },
				{ visitor_dependent: { $exists: false } },
			],
		});
		// console.log(health_risk.result);

		if (!health_risk) {
			check_in_records_arr.push({
				_id: item._id,
				health_risk: "?",
				date_created: item.date_created,
			});
		} else {
			check_in_records_arr.push({
				_id: item._id,
				health_risk: health_risk.result,
				date_created: item.date_created,
			});
		}
		if (counter == checkInRecords.length - 1) {
			// console.log(check_in_records_arr);
			res.send(check_in_records_arr);
		}
		counter += 1;
	});
});

app.post("/get_check_in_counts", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	var date_from_arr = req.body.date_from_arr;
	var date_to_arr = req.body.date_to_arr;
	var check_in_count_arr = new Array();
	// console.log(req.body.selected_entry_point_id);
	// console.log(date_from_arr);
	// console.log("////////////");
	// console.log(date_to_arr);

	for (i = 0; i < 7; i++) {
		var checkInCount = await checkInRecord.countDocuments({
			$and: [
				{ user_premiseowner: decrypt(remember_me.encryptedUid) },
				{ date_created: { $gte: new Date(date_from_arr[i]) } },
				{ date_created: { $lt: new Date(date_to_arr[i]) } },
			],
		});
		check_in_count_arr.push(checkInCount);
	}

	res.send(check_in_count_arr);
});

// app.post("/test", async (req, res) => {
// 	const remember_me = req.cookies["remember_me"];
// 	// const user = await userPremiseOwner
// 	// 	.findById(decrypt(remember_me.encryptedUid));
// 	const userByPost = await premiseQRCode.findById("5f427562ba68a73ae08b6d53").populate('user_premiseowner');
// 	res.send(JSON.stringify(userByPost));
// });

app.post("/save_registration", async (req, res) => {
	// sess = req.session;
	// console.log(req.body.formData.password);
	console.log(req.body.formData.ic_num);
	console.log(req.body.formData.ic_fname);
	console.log(req.body.formData.ic_address);
	console.log(req.body.formData.phone_no_sent);
	console.log(req.body.formData.email_sent);
	console.log(req.body.formData.place_lat);
	console.log(req.body.formData.place_lng);
	console.log(req.body.formData.place_id);

	// const userVisitor = new userVisitor({
	// 	ic_num: sess.ic_num,
	// 	ic_fname: sess.ic_fname,
	// 	ic_address: sess.ic_address,
	// 	phone_no: sess.phone_no,
	// 	email: sess.email,
	// 	home_lat: sess.home_lat,
	// 	home_lng: sess.home_lng,
	// 	home_id: sess.home_id,
	// 	password: sess.password,
	// });
	var now = new Date();
	// var date =
	// 	now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
	// var time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
	// var dateTime = date + " " + time;
	// console.log(new Date(now.getTime() + 480 * 60000));
	// hash password
	const salt = await bcrypt.genSalt(10); // default complexity 10
	const hashPsw = await bcrypt.hash(req.body.formData.password, salt);

	const visitor = new userVisitor({
		ic_num: req.body.formData.ic_num,
		ic_fname: req.body.formData.ic_fname,
		ic_address: req.body.formData.ic_address,
		phone_no: req.body.formData.phone_no_sent,
		email: req.body.formData.email_sent,
		home_lat: req.body.formData.place_lat,
		home_lng: req.body.formData.place_lng,
		home_id: req.body.formData.place_id,
		password: hashPsw,
		date_created: new Date(now.getTime() + 480 * 60000),
	});

	try {
		const savedUser = await visitor.save();
		if (savedUser) {
			res.send("success");
		} else {
			res.send("failed");
		}
	} catch (error) {
		res.status(400).json(error);
	}

	// res.end("done");
});

app.post("/save_registration_po", async (req, res) => {
	console.log(req.body.formData.owner_fname);
	console.log(req.body.formData.premise_name);
	console.log(req.body.formData.phone_no_sent);
	console.log(req.body.formData.email_sent);
	console.log(req.body.formData.premise_address);
	console.log(req.body.formData.premise_postcode);
	console.log(req.body.formData.premise_state);
	console.log(req.body.formData.place_id);
	console.log(req.body.formData.place_lat);
	console.log(req.body.formData.place_lng);
	console.log(req.body.formData.password);
	var now = new Date();
	const salt = await bcrypt.genSalt(10); // default complexity 10
	const hashPsw = await bcrypt.hash(req.body.formData.password, salt);

	const premiseOwner = new userPremiseOwner({
		owner_fname: req.body.formData.owner_fname,
		premise_name: req.body.formData.premise_name,
		phone_no: req.body.formData.phone_no_sent,
		email: req.body.formData.email_sent,
		premise_address: req.body.formData.premise_address,
		premise_postcode: req.body.formData.premise_postcode,
		premise_state: req.body.formData.premise_state,
		premise_lat: req.body.formData.place_lat,
		premise_lng: req.body.formData.place_lng,
		premise_id: req.body.formData.place_id,
		password: hashPsw,
		date_created: new Date(now.getTime() + 480 * 60000),
	});

	try {
		const savedUser = await premiseOwner.save();
		if (savedUser) {
			res.send("success");
		} else {
			res.send("failed");
		}
	} catch (error) {
		res.status(400).json(error);
	}

	// res.end("done");
});

app.post("/verify_rememberMe", async (req, res) => {
	// console.log(decrypt(req.cookies["remember_me"].encryptedUid));
	const remember_me = req.cookies["remember_me"];
	// res.clearCookie("remember_me");

	if (!remember_me) {
		return res.send("not logged in");
	}
	// check if user exist
	if (remember_me.role == "visitor") {
		const user = await userVisitor.findOne({
			_id: decrypt(remember_me.encryptedUid),
		});
		if (!user) {
			return res.send("not logged in");
		}
		return res.send("visitor");
	} else if (remember_me.role == "premise owner") {
		const user = await userPremiseOwner.findOne({
			_id: decrypt(remember_me.encryptedUid),
		});
		if (!user) {
			return res.send("not logged in");
		}
		return res.send("premise owner");
	}
	// return res.send(true);
});

app.post("/logout", async (req, res) => {
	const remember_me = req.cookies["remember_me"];

	if (remember_me) {
		res.clearCookie("remember_me");
		return res.send("success");
	} else {
		return res.send("failed");
	}
});

app.post("/login_premiseOwner_phoneNo", async (req, res) => {
	// check if email exist
	const user = await userPremiseOwner.findOne({
		phone_no: req.body.user.phone_no,
	});
	if (!user) {
		return res.send(false);
	}

	// check if password correct
	const validPsw = await bcrypt.compare(req.body.user.password, user.password);
	if (!validPsw) {
		return res.send(false);
	}

	var encryptedUid = encrypt(user._id.toString());
	var remember_me_obj = {
		encryptedUid: encryptedUid,
		role: "premise owner",
	};

	res.cookie("remember_me", remember_me_obj, {
		maxAge: 604800000, // 7 days
		httpOnly: true,
	});

	res.cookie("pid", user._id);
	res.cookie("pname", user.premise_name);

	res.send(true);
});

app.post("/login_premiseOwner_email", async (req, res) => {
	// check if email exist
	const user = await userPremiseOwner.findOne({ email: req.body.user.email });
	if (!user) {
		return res.send(false);
	}

	// check if password correct
	const validPsw = await bcrypt.compare(req.body.user.password, user.password);
	if (!validPsw) {
		return res.send(false);
	}

	var encryptedUid = encrypt(user._id.toString());
	var remember_me_obj = {
		encryptedUid: encryptedUid,
		role: "premise owner",
	};

	res.cookie("remember_me", remember_me_obj, {
		maxAge: 604800000, // 7 days
		httpOnly: true,
	});

	res.cookie("pid", user._id);
	res.cookie("pname", user.premise_name);

	res.send(true);
});

app.post("/login_visitor_phoneNo", async (req, res) => {
	// check if email exist
	const user = await userVisitor.findOne({ phone_no: req.body.user.phone_no });
	if (!user) {
		return res.send(false);
	}

	// check if password correct
	const validPsw = await bcrypt.compare(req.body.user.password, user.password);
	if (!validPsw) {
		return res.send(false);
	}

	var encryptedUid = encrypt(user._id.toString());
	var remember_me_obj = {
		encryptedUid: encryptedUid,
		role: "visitor",
	};

	res.cookie("remember_me", remember_me_obj, {
		maxAge: 604800000, // 7 days
		httpOnly: true,
	});
	// create and assign a token
	// const token = jwt.sign({ _id: user._id }, "vE7YWqEuJQOXjlKxU7e4SOl");

	// save token and user id to cookie
	// res.cookie("auth-token", token); // to verify if user have login
	// res.cookie("uid", user._id); // while be used while saving artist
	// res.cookie("uname", user.name); // will be display on navigation bar (logged in as UserName)
	res.send(true);
});

app.post("/login_visitor_email", async (req, res) => {
	// check if email exist
	const user = await userVisitor.findOne({ email: req.body.user.email });
	if (!user) {
		return res.send(false);
	}

	// check if password correct
	const validPsw = await bcrypt.compare(req.body.user.password, user.password);
	if (!validPsw) {
		return res.send(false);
	}

	var encryptedUid = encrypt(user._id.toString());
	var remember_me_obj = {
		encryptedUid: encryptedUid,
		role: "visitor",
	};
	// console.log("encryptedUid: " + JSON.stringify(encryptedUid));

	// // console.log(JSON.stringify(user._id));
	// // console.log(hashUid);
	res.cookie("remember_me", remember_me_obj, {
		maxAge: 604800000, // 7 days
		httpOnly: true,
	});

	// console.log(req.cookies["remember_me"].encryptedUid);
	// console.log(encryptedUid);
	// console.log(req.cookies["remember_me"]);
	// console.log(req.cookies["remember_me"].encryptedData);

	// console.log("cookie hashedid: " + JSON.stringify(req.cookies["remember_me"]));

	// console.log(decrypt(req.cookies["remember_me"].toString));
	// console.log("hashedid: " + hashUid);
	// console.log(req.cookies.remember_me);
	// console.log(user._id.toString());
	// if (!validRememberMe) {
	// 	console.log("not remember");
	// } else {
	// 	console.log("remember");
	// }
	// // create and assign a token
	// const token = jwt.sign({ _id: user._id }, "vE7YWqEuJQOXjlKxU7e4SOl");
	// res.cookie("auth-token", token, {
	// 	maxAge: 604800000, // 7 days
	// 	httpOnly: true,
	// });
	// console.log("cookie: " + req.cookies["auth-token"]);
	// try {
	// 	// verify token
	// 	const verified = jwt.verify(token, "vE7YWqEuJQOXjlKxU7e4SOl");
	// 	console.log("Valid token");
	// 	// store user ID and time of token issued to indicate that the user is authenticated
	// 	// req.user = verified;
	// 	// return res.send("Access Granted");
	// } catch (err) {
	// 	console.log("Invalid token");
	// 	// return res.send("Invalid token");
	// }
	// save token and user id to cookie
	// res.cookie("auth-token", token); // to verify if user have login
	// res.cookie("uid", user._id); // while be used while saving artist
	// res.cookie("uname", user.name); // will be display on navigation bar (logged in as UserName)
	// res.clearCookie('remember_me');

	// passport.authenticate("local", {
	// 	failureRedirect: "/login",
	// 	failureFlash: true,
	// }),
	// 	function (req, res, next) {
	// 		// Issue a remember me cookie if the option was checked
	// 		// if (!req.body.remember_me) {
	// 		// 	return next();
	// 		// }

	// 		issueToken(req.user, function (err, token) {
	// 			if (err) {
	// 				return next(err);
	// 			}
	// 			res.cookie("remember_me", token, {
	// 				path: "/",
	// 				httpOnly: true,
	// 				maxAge: 604800000,
	// 			});
	// 			return next();
	// 		});
	// 	},
	// 	function (req, res) {
	// 		res.redirect("/");
	// 	};

	// var cookie = req.cookies.remember_me;
	// if (cookie === undefined) {
	// 	res.cookie("remember_me", "12341234", {
	// 		maxAge: 604800000, // 7 days
	// 		httpOnly: true,
	// 	});
	// 	console.log("cookie created");
	// 	console.log(req.cookies.remember_me);
	// } else {
	// 	console.log("cookie: " + req.cookies.remember_me);
	// }
	res.send(true);
});

app.post("/ic_ocr", async (req, res) => {
	// const fileName = './picture-730550.jpg';
	// console.log("filename:");
	// axios
	// 	.post("https://vision.googleapis.com/v1/images:annotate", {
	// 		body: req.body,
	// 	})
	// 	.then((response) => {
	// 		let responseJson = response.json();
	// 		console.log(responseJson);
	// 		// res.send(response.data);
	// 	})
	// 	.catch((error) => {
	// 		res.status(400).json(error);
	// 	});
	// let responseJson = await response.json();
	// console.log(responseJson);
	// try {
	// 	const [result] = await client.textDetection(req.body.user.ic_uri);
	// 	const detections = result.textAnnotations;
	// 	console.log("Text:");
	// 	detections.forEach((text) => console.log(text));
	// 	res.send(true);
	// } catch (error) {
	// 	console.log(error);
	// 	res.status(400).json(error);
	// }
	// const features = [{ type: "TEXT_DETECTION" }];
	// // Build the image request object for that one image. Note: for additional images you have to create
	// // additional image request objects and store them in a list to be used below.
	// const imageRequest = {
	// 	image: {
	// 		content: req.body.user.ic_base64
	// 	},
	// 	features: features,
	// };
	// // Set where to store the results for the images that will be annotated.
	// const outputConfig = {
	// 	gcsDestination: {
	// 		uri: outputUri,
	// 	},
	// 	batchSize: 2, // The max number of responses to output in each JSON file
	// };
	// // Add each image request object to the batch request and add the output config.
	// const request = {
	// 	requests: [
	// 		imageRequest, // add additional request objects here
	// 	],
	// 	outputConfig,
	// };
	// // Make the asynchronous batch request.
	// const [operation] = await client.asyncBatchAnnotateImages(request);
	// // Wait for the operation to complete
	// const [filesResponse] = await operation.promise();
	// console.log(filesResponse);
	// // The output is written to GCS with the provided output_uri as prefix
	// // const destinationUri = filesResponse.outputConfig.gcsDestination.uri;
	// // console.log(`Output written to GCS with prefix: ${destinationUri}`);
});

// app.post("/register", async (req, res) => {
// 	const user = new User({
// 		name: req.body.user.name,
// 		email: req.body.user.email,
// 		password: req.body.user.psw,
// 	});
// 	try {
// 		const savedUser = await user.save();
// 		res.send(true);
// 	} catch (error) {
// 		res.status(400).json(error);
// 	}
// });

app.get("/searchHomeAddress", (req, res) => {
	const search_query = req.query.search_query;
	const api_key = "api_key";
	const querystr = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${search_query}&components=country:my&types=establishment&key=${api_key}`;

	axios
		.get(querystr)
		.then((response) => {
			// console.log(response.data);
			res.send(response.data);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

app.get("/getHomeLocation", (req, res) => {
	const place_id = req.query.place_id;
	const api_key = "api_key";
	// const querystr = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${home_address}&key=${api_key}`;
	const querystr = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=geometry&key=${api_key}`;

	axios
		.get(querystr)
		.then((response) => {
			// console.log(response.data);
			res.send(response.data);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

app.get("/getHotspotDetails", (req, res) => {
	const place_id = req.query.place_id;
	const api_key = "api_key";
	// const querystr = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${home_address}&key=${api_key}`;
	const querystr = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=formatted_address,name,types,url,photos&key=${api_key}`;

	axios
		.get(querystr)
		.then((response) => {
			// console.log(response.data);
			res.send(response.data);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

app.get("/getPhotoReference", (req, res) => {
	const photo_reference = req.query.photo_reference;
	const api_key = "api_key";
	const querystr = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo_reference}&key=${api_key}
	`;

	axios
		.get(querystr)
		.then((response) => {
			// console.log(response.data);
			res.send(response.data);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

app.post("/sendTacCode", (req, res) => {
	const phone_number = req.body.item.phone_no;
	const tac_code = req.body.item.tac_code;
	var message_content =
		tac_code + " is your TAC code for COVID-19 Contact Tracing App";

	const querystr = `http://192.168.0.130:8090/SendSMS?username=yuanshen&password=12341234&phone=${phone_number}&message=${message_content}`;
	// const querystr = `http://192.168.0.103:8090/SendSMS?username=yuanshen&password=12341234&phone=${phone_number}&message=${message_content}`;

	axios
		.get(querystr)
		.then((response) => {
			console.log(response);
			res.send("success");
		})
		.catch((error) => {
			res.send("failed");
			// res.status(400).json(error);
		});
});

app.post("/sendVerificationEmail", async (req, res) => {
	const email = req.body.item.email;
	const verification_code = req.body.item.verification_code;

	var transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "wayne.ng6010@gmail.com",
			pass: "ozuueiwutugbeakc",
		},
	});

	var mailOptions = {
		from: "wayne.ng6010@gmail.com",
		to: email,
		subject: "Verification email for COVID-19 Contact Tracing App",
		text:
			verification_code +
			" is your verification code for COVID-19 Contact Tracing App registration",
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			// console.log(error);
			res.send(500);
		} else {
			// console.log("Email sent: " + info.response);
			res.send(200);
		}
	});
});

// app.get("/getArtistRelatedNews", (req, res) => {
// 	const artist_name = req.query.artist_name;
// 	const apikey_news = "fbeba8d45b5c49e88f83dbb9b40cbe48";

// 	const querystr = `https://newsapi.org/v2/everything?q="${artist_name}"&apiKey=${apikey_news}`;

// 	axios
// 		.get(querystr)
// 		.then((response) => {
// 			res.send(response.data);
// 		})
// 		.catch((error) => {
// 			res.status(400).json(error);
// 		});
// });

// heroku
if (process.env.NODE_ENV === "production") {
	// Exprees will serve up production assets
	app.use(express.static("client/build"));
	// for express session
	app.set("trust proxy", 1);
	sess.cookie.secure = true;
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
