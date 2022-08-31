const axios = require('axios');

const Entity = {
	getAllEntities: async () => {
		const { data } = await axios.get('https://raman.rumsan.net/api/v1/entities?limit=100');
		if (!data) return [];
		return data.data;
	}
};

module.exports = { Entity };
