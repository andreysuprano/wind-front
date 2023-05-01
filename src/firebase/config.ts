import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyAodJCLLKARUKcSKrEXU6VQwE-PIUqoC3M',
	authDomain: 'projetcs-storage.firebaseapp.com',
	projectId: 'projetcs-storage',
	storageBucket: 'projetcs-storage.appspot.com',
	messagingSenderId: '41518615828',
	appId: '1:41518615828:web:fc73400aea1e6f32120601',
	measurementId: 'G-WXHLBHNC1P'
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage();
