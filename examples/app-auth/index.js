// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------
var express = require('express'),
	exphbs = require('express-handlebars'),
	session = require('express-session'),
	path = require('path'),
	fs = require('fs'),
	util = require('util'),
	multipart = require('express-formidable').parse,
	bodyParser = require('body-parser'),
	BoxSDK = require('box-node-sdk');

// ------------------------------------------------------------------------------
// Application Parameters - Fill in with your app's values
// ------------------------------------------------------------------------------

/*var CLIENT_ID = 'YOUR CLIENT ID',                                                      original code for assigning authetification variables
 CLIENT_SECRET = 'YOUR CLIENT SECRET',
 PUBLIC_KEY_ID = 'YOUR PUBLIC KEY ID',
 PRIVATE_KEY_PATH = './path/to/your_private_key.pem',
 PRIVATE_KEY_PASSPHRASE = 'YOUR PRIVATE KEY PASSPHRASE',
 ENTERPRISE_ID = 'YOUR ENTERPRISE ID';

Set up Express and the Box SDK
 var app = express(),
 sdk = new BoxSDK({
 clientID: CLIENT_ID,
 clientSecret: CLIENT_SECRET,
 appAuth: {
 keyID: PUBLIC_KEY_ID,
 privateKey: fs.readFileSync(path.resolve(__dirname, PRIVATE_KEY_PATH)),
 passphrase: PRIVATE_KEY_PASSPHRASE
 }
 });*/


var CLIENT_ID = 'zjnyu56jkre6pmpva2l1sqrrjtyqfktq',
	CLIENT_SECRET = 'PJOG2jAFw8ZlKs46yzNCDCAvwa0JxAnM',
	PUBLIC_KEY_ID = 'pwgcmlf1',
	//PRIVATE_KEY_PATH = 'private_key.pem',                                            pathway to a .pem file i cruduely created, now hardcoded below instead
	ENTERPRISE_ID = '23593372';

// Set up Express and the Box SDK
var app = express(),
	sdk = new BoxSDK({
		clientID: 'zjnyu56jkre6pmpva2l1sqrrjtyqfktq',
		clientSecret: 'PJOG2jAFw8ZlKs46yzNCDCAvwa0JxAnM',
		appAuth: {
			keyID: 'pwgcmlf1',
			privateKey: '-----BEGIN ENCRYPTED PRIVATE KEY-----MIIFDjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQI0pgBe6JZUTwCAggAMBQGCCqGSIb3DQMHBAjKBzGKhbf1xQSCBMhhwz4PSNVibq2CmwnN780GHzEMjHy4c/ArDkL4/2KkIt2ENCdR2GEWb2bXDk8cxcKllxgfF3uLid8/h8lkiO7/z3vCaBgr1vILg6H3W4775h7jQT1axmUKJduq6tzlQC3GNrXBI4Hd3OZMDAy1WsLTr9HEbZQ91caIfSpn/FvJAeFur8iaZOmHFQzuXsPrrM6cQBQnycUbNaLLjSkdcNa8ybbEPtpHDA5EVmq51UVBRH//9U1V1rEkwX3kG4ydSRWRokjJ6H2IoN4JUGazwAPdubnoFNwhYc0mFnexg7nPtZp90711+gu1P8paq2/4V5+5pkO0xhVE3TkSOz5dx6YQ7MMFv3vXG/gr9vRiZYplYOu8Hn0PgxHDC1yEQ0HGzJXZtRmL1jvKJYHUgWYk065RKlz0giywWdxEYbS1J2ioH97hjFjwbyuQNFsEnLXOlwuZp7/91zZiaGzHQlmDl4mBmNyTySSUBB6HqE0ulUXq/IEmkl66RmZsCHWEyAjYhURMvmjhYlhYu5Z3pJOHEDsWZACQjzx9Q9YKsk4F6w7EIKQkqVuc/R84PsY4RLUzs5oQ8W2t6uraDpC0TXYzhfzejiUTcser4tGEXLFGzGB5elDqaheij4gFM6rLpwle3cxvZ5PwTnKWAtyOfiIe41OF6FhX7XevdCgB3WuqY13YVu7/r/3Kn9h9ruM4BMawI2GaAs8ia9WewT6eSZGGbk7QJkVvR9vE7LwlKFai0Mfu9bFJ0QnoXUlSNhVsXd8mZLrq7mPPwI88IrPaRKTSHHTksvVTlGYZBtRLdK45eJpBy9oph6pz6bOm5ujcGYU0C2CAzlXgjtRc6XoGuu46PlA4roRaG4oIhk1S6N/hjJ7lNqmu5kB35R9r9HX3pEOfI2TPcqrn2CCePkd6e/NBJWWlEBuGdSBq/NjqUyiEu3cICcAo2vJt3DCq0wrAl3eiWTK1ozlKETRaXQwAYHeCtBTeFyDfFB3wf72Y9BKUNPXBAKPA8J2i573YCCHxJK18MBsjWKPII45vIrM56VKGc4t3Te5MqU9NoKXwtKyQ8J9dzaLWgbbAPsnGZ20G86n3KKNMA5ZdNtM5LrGy/9+PM7no92ey5IJwYwAN5dZ1WDdEkoyskrUUiub5ukrGZmZ6SU6Il2f6nkLXpliaUg8ql8p/u/Y3hqmMghIuw/IaQZftNyQ266sV5Tt2MMObPNoiHvVe3XSoSmGMLBe7063CqJ0ZyJPzle85OOYE0p1lCsjBAl3gQtt1AE0VCCdJiscPhtnbBNMNS7O158j1c9zwZVZNsvqnfbKMN4vbKRv4NRZnbM3EolGCOj7J7S6oHi5IjrDncUn3hngTdZwgLayslgf0Pq1UJhmo6O2sAbysTbAnJ2Mc7r03Mj9oej9unqfnx/0FxSCPAQQgBl0vqU2DJ3V6gQEkne38SpgV5pnZR6CCM9lmpoygx9xVsNwxfo/AN09hIfdcCMAmc9GK2Xk8wooc8lWWeGKSC7nBtXX9KKDCF4X8rSwPMeVQQOqjfh53dpPWC9bRgo0oMA02G2/tpN19tcodFLslK3nyXmTjH549N9Irj837Nvxo/7IwVDlk4y6Rf2ltj6XMdpr2b8=-----END ENCRYPTED PRIVATE KEY-----',
			passphrase: '2b9ce20fb9c73dfef059581787ee2905'
		}
	});

// Use a single SDK client for the app admin, which will perform all operations
// around user management
var adminAPIClient = sdk.getAppAuthClient('enterprise', ENTERPRISE_ID);

// Set up the templating engine (Handlebars)
app.engine('hbs', exphbs({
	defaultLayout: 'main',
	extname: '.hbs'
}));
app.set('view engine', 'hbs');

// We need to parse POST bodies for form submissions
app.use(bodyParser.urlencoded({
	extended: false
}));

// Set up sessions, so we can log users in and out
app.use(session({
	secret: 'session secret',
	resave: false,
	saveUninitialized: false
}));

// User authentication middleware
// For this sample app, we trust that as long as the user's email has been set
// in the session, that they have been properly authenticated and we can create
// an SDK client for them
app.use(function(req, res, next) {
	if (req.session.email) {
		res.locals.email = req.session.email;
		req.sdk = sdk.getAppAuthClient('user', req.session.userID);
	}
	next();
});

app.get('/', function(req, res) {

	if (req.session.email) {
		// The user is logged in, send them to their files page
		res.redirect('/files');
	} else {
		// The user is logged out, render the home page
		res.render('home');
	}
});

app.get('/login', function(req, res) {
	res.render('login');
});

app.post('/login', function(req, res) {

	var email = req.body.email;

	var requestParams = {
		qs: {
			filter_term: email
		}
	};
	// Make an API request to get all users whose name starts with the provided email address
	// Since we use the Box name field to hold the email address that the user
	// registered with, this should give us the correct user object, if they've already
	// signed up.
	adminAPIClient.get('/users', requestParams, adminAPIClient.defaultResponseHandler(function(err, data) {

		if (err) {
			res.render('login', {
				error: 'An error occurred during login - ' + err.message,
				errorDetails: util.inspect(err)
			});
			return;
		}

		// Since the API call only checks that the filter term is a prefix, we
		// might get many matching records back from the API, so we need to
		// verify that there is an exact match before logging the user in
		var user = data.entries.find(match => match.name === email);
		if (!user) {
			res.render('login', {
				error: 'User not found'
			});
			return;
		}

		// Set up the user's logged-in session
		req.session.email = email;
		req.session.userID = user.id;
		res.redirect('/files');
	}));
});

app.get('/signup', function(req, res) {
	res.render('signup');
});

app.post('/signup', function(req, res) {
	var requestParams = {
		body: {
			name: req.body.email,
			is_platform_access_only: true
		}
	};
	// Create a new Box user record for this user, using the name field to hold the
	// email address they registered with.  This allows us to use Box to keep track
	// of all our users, so we don't need a separate database for this sample app
	adminAPIClient.post('/users', requestParams, adminAPIClient.defaultResponseHandler(function(err, data) {

		if (err) {
			res.render('signup', {
				error: 'An error occurred during signup - ' + err.message,
				errorDetails: util.inspect(err)
			});
			return;
		}

		// If the user was created correctly, set up their logged-in session
		req.session.email = req.body.email;
		req.session.userID = data.id;
		res.redirect('/files');
	}));
});

app.get('/files', function(req, res) {

	// Guard to make sure the user is logged in
	if (!req.sdk) {
		res.redirect('/');
		return;
	}

	// Get the user's files in their root folder.  Box uses folder ID "0" to
	// represent the user's root folder, where we'll be putting all their files.
	req.sdk.folders.getItems('0', null, function(err, data) {

		res.render('files', {
			error: err,
			errorDetails: util.inspect(err),
			files: data ? data.entries: []
		});
	});
});

// The upload endpoint requires the multipart middleware to parse out the upload
// form body, which writes the uploaded file to disk at a temporary location
app.post('/upload', multipart(), function(req, res) {

	// Guard to make sure the user is logged in
	if (!req.sdk) {
		res.redirect('/');
		return;
	}

	// Get a read stream to the file that the user uploaded
	var fileStream = fs.createReadStream(req.body.file.path);
	// Make an API call to upload the user's file to Box
	req.sdk.files.uploadFile('0', req.body.file.name, fileStream, function(err, data) {

		// Once the upload completes, delete the temporary file from disk
		fs.unlink(req.body.file.path, function() {});

		res.redirect('/files');
	});
});

app.get('/download/:id', function(req, res) {

	// Guard to make sure the user is logged in
	if (!req.sdk) {
		res.redirect('/');
		return;
	}

	// API call to get the temporary download URL for the user's file
	req.sdk.files.getDownloadURL(req.params.id, null, function(err, url) {

		if (err) {
			res.redirect('/files');
			return;
		}

		// Redirect to the download URL, which will cause the user's browser to
		// start the download
		res.redirect(url);
	});
});

app.get('/preview/:id', function(req, res) {

	// Guard to make sure the user is logged in
	if (!req.sdk) {
		res.redirect('/');
		return;
	}

	// The Box file object has a field called "expiring_embed_link", which can
	// be used to embed a preview of the file.  We'll fetch this field only.
	req.sdk.files.get(req.params.id, {fields: 'expiring_embed_link'}, function(err, data) {

		if (err) {
			res.redirect('/files');
			return;
		}

		res.render('preview', {
			file: data
		});
	})
});

app.get('/thumbnail/:id', function(req, res) {

	// Guard to make sure the user is logged in
	if (!req.sdk) {
		res.redirect('/');
		return;
	}

	// API call to get the thumbnail for a file.  This can return either the
	// specific thumbnail image or a URL pointing to a placeholder thumbnail.
	req.sdk.files.getThumbnail(req.params.id, {}, function(err, data) {

		if (err) {
			res.status(err.statusCode || 500).json(err);
			return;
		}

		if (data.file) {
			// We got the thumbnail file, so send the image bytes back
			res.send(data.file);
		} else if (data.location) {
			// We got a placeholder URL, so redirect the user there
			res.redirect(data.location);
		} else {
			// Something went wrong, so return a 500
			res.status(500).end();
		}
	});
});

app.get('/logout', function(req, res) {

	// To log the user out, we can simply destroy their session
	req.session.destroy(function() {
		res.redirect('/');
	});
})

app.listen(3000);
console.log('Server started!');
console.log('Visit http://localhost:3000/ to start.');
