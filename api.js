const request = require('request-promise');



async function getUser(accessToken) {
	const requestOptions = {
		uri: 'https://api.pipedrive.com/v1/users/me',
		headers: {
			'Authorization': `Bearer ${accessToken}`
		},
		json: true
	};
	const userInfo = await request(requestOptions);
	return userInfo;
}
async function getUsers(accessToken) {
	const requestOptions = {
		uri: 'https://api.pipedrive.com/v1/users',
		headers: {
			'Authorization': `Bearer ${accessToken}`
		},
		json: true
	};
	const userInfo = await request(requestOptions);
	return userInfo;
}

async function getDeals(accessToken) {
	const requestOptions = {
		uri: 'https://api.pipedrive.com/v1/deals',
		headers: {
			'Authorization': `Bearer ${accessToken}`
		},
		qs: {
			status: 'open'
		},
		json: true
	};
	const deals = await request(requestOptions);

	return deals;
}
async function getPipeline(accessToken) {
	const requestOptions = {
		uri: 'https://api.pipedrive.com/v1/pipelines',
		headers: {
			'Authorization': `Bearer ${accessToken}`
		},
		qs: {
			status: 'open'
		},
		json: true
	};
	const pipelines = await request(requestOptions);

	return pipelines;
}
async function getPipelineDeal(id, accessToken) {
	const requestOptions = {
		uri: `https://api.pipedrive.com/v1/pipelines/${id}/deals`,
		headers: {
			'Authorization': `Bearer ${accessToken}`
		},
		qs: {
			status: 'open'
		},
		json: true
	};
	const pipelinesDeal = await request(requestOptions);
	return pipelinesDeal;
}


async function updateDeal(id, outcome, accessToken) {
	const requestOptions = {
		uri: `https://api.pipedrive.com/v1/deals/${id}`,
		method: 'PUT',
		headers: {
			'Authorization': `Bearer ${accessToken}`
		},
		json: {
			status: outcome
		}
	};
	await request(requestOptions);
}
async function updateDeall(id, data, accessToken) {
	const requestOptions = {
		uri: `https://api.pipedrive.com/v1/deals/${id}`,
		method: 'PUT',
		headers: {
			'Authorization': `Bearer ${accessToken}`
		},
		json:{
			...data
		} 
	};
	await request(requestOptions);
}


async function addDeal(data, accessToken) {
	const requestOptions = {
		uri: 'https://api.pipedrive.com/v1/deals',
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${accessToken}`
		},
		json:{
			...data
		} 
	};
 	await request(requestOptions);
}

async function getStage(id, accessToken) {
	const requestOptions = {
		uri: `https://api.pipedrive.com/v1/stages?pipeline_id=${id}`,
		headers: {
			'Authorization': `Bearer ${accessToken}`
		},
		json: true
	}
	const getStage = await request(requestOptions);
	return getStage;

}

async function searchDeal(term, accessToken){
	const requestOptions = {
		uri: `https://api.pipedrive.com/v1/itemSearch?term=${ term }`,
		headers: {
			'Authorization': `Bearer ${accessToken}`
		},
	};
	const searchDeal = await request(requestOptions);
	console.log({ searchDeal })
	return searchDeal;	
}


async function getSummary(id, accessToken){
	const requestOptions = {
		uri: `https://api.pipedrive.com/v1/deals/summary?stage_id=${id}`,
		headers: {
			'Authorization': `Bearer ${accessToken}`
		},
		json: true,
	}
	const getSum = await request(requestOptions);
	return getSum;


}

module.exports = {
	getUser,
	getDeals,
	updateDeal,
	addDeal,
	getPipeline,
	getPipelineDeal,
	searchDeal,
	getSummary,
	getStage,
	updateDeall,
	getUsers
};