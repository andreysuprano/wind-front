import axios from 'axios';

const defaultOptions = {
	baseURL: 'https://api.windfallinstitute.com.br/'
};

export const client = axios.create(defaultOptions);

const defaultAuthOptions = {
	baseUrl: 'https://api.windfallinstitute.com.br/',
	headers: {
		'Content-Type': 'aplication/json',
		Authorization: ''
	}
};

export const authClient = axios.create(defaultAuthOptions);
