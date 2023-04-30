import { useContext } from 'react';
import { UserContext } from '../contexts/authContext';

const useAuth = () => {
	return useContext(UserContext);
};

export default useAuth;
