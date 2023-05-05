import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';
import { v4 as uuidv4 } from 'uuid';

export const uploadWithBase64 = async (base64: string): Promise<string> =>
	new Promise((resolve, reject) => {
		const name = uuidv4();
		const storageRef = ref(storage, `windfall/profiles/${name}`);
		uploadString(storageRef, base64, 'data_url')
			.then(async (snapshot) => {
				resolve(await getDownloadURL(storageRef));
			})
			.catch((err) => {
				reject(err);
			});
	});

export const toBase64 = async (file: File) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = reject;
	});
