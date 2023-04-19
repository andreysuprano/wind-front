import { useContext } from 'react';
import { UserContext } from '../contexts/authContext';

const useAuth = () => {
	const value = useContext(UserContext);

	return value;
};

export default useAuth;
