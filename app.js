const express = require("express");
const app = express();
const axios = require("axios");
const Artist = require("./Artist").Artist;
const User = require("./Artist").User;
var path = require("path");
const nodemailer = require("nodemailer");
// google vision api
// const vision = require("@google-cloud/vision");
// const client = new vision.ImageAnnotatorClient({
// 	keyFilename: "my-key.json",
// });

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

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
	const api_key = "AIzaSyDV2M6vNxqRZbKeWuJJ4kMyt9K1hOgSvlo";
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

app.get("/sendTacCode", (req, res) => {
	const phone_number = req.query.phone_number;
	const tac_code = req.query.tac_code;
	var message_content =
		tac_code + " is your TAC code for COVID-19 Contact Tracing App";

	// const querystr = `http://192.168.0.130:8090/SendSMS?username=yuanshen&password=12341234&phone=${phone_number}&message=${tac_code}`;
	const querystr = `http://192.168.0.103:8090/SendSMS?username=yuanshen&password=12341234&phone=${phone_number}&message=${message_content}`;

	axios
		.get(querystr)
		.then((response) => {
			// console.log("tac code sent");
			res.send(true);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

app.post("/sendVerificationEmail", async (req, res) => {
	const email = req.query.email;
	const verification_code = req.query.verification_code;

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
		text: verification_code + " is your verification code for COVID-19 Contact Tracing App registration",
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log("Email sent: " + info.response);
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

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
