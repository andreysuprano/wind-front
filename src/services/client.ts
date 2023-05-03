import axios from 'axios';

const defaultOptions = {
	baseURL: 'http://localhost:3001'
};

export const client = axios.create(defaultOptions);

const defaultAuthOptions = {
	baseUrl: 'http://localhost:3001',
	headers: {
		'Content-Type': 'aplication/json',
		Authorization: ''
	}
};

export const authClient = axios.create(defaultAuthOptions);
