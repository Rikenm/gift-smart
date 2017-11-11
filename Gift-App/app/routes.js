var User = require('./models/user');
const request = require('request-promise');


module.exports = function(app, passport){

	app.get('/', function(req, res){
		res.render('index.ejs');
	});

	app.get('/login', function(req, res){
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	app.get('/signup', function(req, res){
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});


	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	app.get('/profile', isLoggedIn, function(req, res){

		res.render('profile.ejs', { user: req.user });

	});

	app.get('/result',isLoggedIn, function(req,res){

					//console.log(req.query.search);
					var query = req.query.search;  //replace this with face_token


          query = "http://everydayshouldbefun.com/wp-content/uploads/2017/01/1435305770-36a7c3951a2bb484f033814ee652156a-600x398.jpg"

					const userFieldSet = query;
					// for friends' likes
					//https://graph.facebook.com/me/friends?fields=name,id,likes.limit(100).fields(id,name)&limit=100



 				const options = {
	 			method: 'POST',
	 			uri: `https://api-us.faceplusplus.com/facepp/v3/detect`,
	 			qs: {
		 		api_key: "3vRtvVYa4DDJUwuKPGiA44LJpPAf6H5i",
				api_secret:"HkO0rQkGTS2Pi3OuPEQ-y8qLYIeONGW6",
				image_url:query,
				return_attributes: "emotion"
	 		   }
       	};
	 	 		request(options, function(error, response,body){

		 			if (!error && response.statusCode == 200){
			 			var parsedData = JSON.parse(body);

			 			res.render("result.ejs",{parsedData : parsedData });
		 			}
		 			else {
						console.log("error");
					}

	 		});

	});

	app.get('/music',isLoggedIn, function(req,res){


					//var query = req.query.search;



				const options = {
				method: 'GET',
				uri: `https://c109317344.web.cddbp.net/webapi/json/1.0/radio/recommend`,
				qs: {
				client: "109317344-838C752F1A38763006AAEB09295D9F21",
				user:"43446129425491942-0AD171CD3A77BD28269F257DABF8E46C",
        seed:"(mood_65323);(text_artist_blink-182)",
				return_count:"10"
				 }
				};
				request(options, function(error, response,body){

					if (!error && response.statusCode == 200){
						var parsedData = JSON.parse(body);

						res.render("result.ejs",{parsedData : parsedData });
					}
					else {
						console.log("error");
					}

			});

	});






	app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email','user_likes','user_friends']}));

	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { successRedirect: '/profile',
	                                      failureRedirect: '/' }));


	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	})



} //my

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/login');
}
