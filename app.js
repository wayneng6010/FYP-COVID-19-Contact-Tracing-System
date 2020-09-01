const express = require("express");
const app = express();
const axios = require("axios");
const userVisitor = require("./Schema").userVisitor;
const userPremiseOwner = require("./Schema").userPremiseOwner;
const premiseQRCode = require("./Schema").premiseQRCode;
const checkInRecord = require("./Schema").checkInRecord;
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
			} else {
				res.send(false);
			}
		})
		.catch((error) => {
			res.status(400).json(error);
		});
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
			{ user_premiseowner: decrypt(remember_me.encryptedUid) },
		],
	});
	if (Object.keys(existedEntryPointName).length === 0) {
		var now = new Date();
		const qrcode = new premiseQRCode({
			entry_point: req.body.new_entry_point,
			user_premiseowner: decrypt(remember_me.encryptedUid),
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

app.post("/check_in_premise", async (req, res) => {
	if (req.body.for === "COVID-19_Contact_Tracing_App") {
		const remember_me = req.cookies["remember_me"];
		const existedPremiseOwner = await userPremiseOwner.findOne({
			_id: req.body.pid,
		});
		if (Object.keys(existedPremiseOwner).length === 0) {
			res.send("failed");
		} else {
			const existedQRCode = await premiseQRCode.findOne({ _id: req.body.qrid });
			if (Object.keys(existedQRCode).length === 0) {
				res.send("failed");
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
						res.send("success");
					} else {
						res.send("failed");
					}
				} catch (error) {
					res.status(400).json(error);
				}
			}
		}
	} else {
		res.send("failed");
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

app.post("/get_all_premise_qrcode", async (req, res) => {
	const remember_me = req.cookies["remember_me"];
	const allQRCode = await premiseQRCode.find({
		user_premiseowner: decrypt(remember_me.encryptedUid),
	});
	res.send(allQRCode);
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

app.post("/sendTacCode", (req, res) => {
	const phone_number = req.body.item.phone_no;
	const tac_code = req.body.item.tac_code;
	var message_content =
		tac_code + " is your TAC code for COVID-19 Contact Tracing App";

	// const querystr = `http://192.168.0.130:8090/SendSMS?username=yuanshen&password=12341234&phone=${phone_number}&message=${message_content}`;
	const querystr = `http://192.168.0.103:8090/SendSMS?username=yuanshen&password=12341234&phone=${phone_number}&message=${message_content}`;

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
			pass: "pass",
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
