const express = require('express');
const path = require('path');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const pipedrive = require('pipedrive');
var bodyParser = require('body-parser');


const api = require('./api');
const config = require('./config');
const User = require('./db/user');
const { application } = require('express');	

User.createTable();

const app = express();
const port = process.env.PORT || 3000;

let stageId = null;

passport.use(
	'pipedrive',
	new OAuth2Strategy({
			authorizationURL: 'https://oauth.pipedrive.com/oauth/authorize',
			tokenURL: 'https://oauth.pipedrive.com/oauth/token',
			clientID: config.clientID || '',
			clientSecret: config.clientSecret || '',
			callbackURL: config.callbackURL || ''
		}, async (accessToken, refreshToken, profile, done) => {
			const userInfo = await api.getUser(accessToken);
			const user = await User.add(
				userInfo.data.name,
				accessToken,
				refreshToken
			);

			done(null, { user });
		}
	)
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(async (req, res, next) => {
	req.user = await User.getById(1);
	console.log(req.user)
	next();
});
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/auth/pipedrive', passport.authenticate('pipedrive'));
app.get('/auth/pipedrive/callback', passport.authenticate('pipedrive', {
	session: false,
	failureRedirect: '/',
	successRedirect: '/'
}));
app.get('/pipelines', async (req, res) => {
	try {
		const deals = await api.getDeals(req.user[0].access_token);
		const sum = await api.getSummary(req.user[0].access_token);
		res.render('deals', {
			name: req.user[0].username,
			deals: deals.data,
			sum: sum.data.total_currency_converted_value
		});
	} catch (error) {
		return res.send(error.message);
	}
});
app.get('/', async (req, res) => {
	if (req.user.length < 1) {
		return res.redirect('/auth/pipedrive');
	}
	try {
		
		const pipelines = await api.getPipeline(req.user[0].access_token);
		res.render('pipelines', {
			name: req.user[0].username,
			pipelines: pipelines.data
			
		});
	} catch (error) {

		return res.send(error.message);
	}
});

app.get('/pipelines/:id/deals', async (req, res) => {
	try {
		const piped = await api.getPipelineDeal(req.params.id, req.user[0].access_token);
		stageId = (await api.getStage(req.params.id, req.user[0].access_token)).data[0].id
		const sum = await api.getSummary(stageId, req.user[0].access_token);
		const users = await api.getUsers(req.user[0].access_token)
		res.render('piped', {
			name: req.user[0].username,
			piped: piped.data,
			sum: sum.data.total_currency_converted_value,
			users: users.data.name
		});
		let op = users.data.map(function(item) {
			return item.name;});
		console.log(users);
		console.log(op);
		console.log(stageId)
		return stageId;

	} catch (error) {
		return res.send(error.message);
	}
});


app.get('/deals/won/:id', async (req, res) => {
	const outcome = 'won';
	try {
		await api.updateDeal(req.params.id, outcome, req.user[0].access_token);

		res.render('outcome', { outcome });
		
	} catch (error) {
		return res.send(error.message);
	}
});
app.get('/deals/lost/:id', async (req, res) => {
	const outcome = 'lost';
	try {
		await api.updateDeal(req.params.id, outcome, req.user[0].access_token);
		console.log(req.user)
		res.render('outcome', { outcome });
	} catch (error) {
		return res.send(error.message);
	}
});
app.post('/createdeal', async(req, res) =>{
	let title = req.body.title;
	let desc = req.body.desc;
	let value = req.body.value;
	const outcome = 'open'
		 const data = {
			title: title + " " + "deal",
			value: value,
			currency: 'USD',
			stage_id: stageId,
			a36f5dbc5c71899db6ef48f66000841eeb7dcb8e: desc,
		} 

	try {
		await api.addDeal(data, req.user[0].access_token)
		res.render('outcome', { outcome });
} catch (err) {
	const errorToLog = err.context?.body || err;
	console.log('Adding failed', errorToLog);
}
});

app.put('/updeal/:id'), async(req,res) => {
	const titlen = req.body.titlen;
	const descn = req.body.descn;
	const valuen = req.body.valuen;
		const data = {
			title: titlen,
			value: valuen,
			description: descn,
			currency: 'USD',
			stage_id: stageId,
		}
		try{
			await api.updateDeall(req.params.id, data, req.user[0].access_token);
			console.log(req.user)
			res.send(data)
		}catch (error) {
		return res.send(error.message);
	}
		
}

app.get('/itemSearch', async (req, res) => {
	const term = req.query.term;

	try{
		const resp = await api.searchDeal(term, req.user[0].access_token)
		res.send(resp)
		res.render('search', {
			searchres: resp.items.item 
		});
	} catch (err) {
		const errorToLog = err.context?.body || err;
		console.log('Adding failed', errorToLog);
	}
});


app.listen(port, () => console.log(`App listening on port ${port}`));