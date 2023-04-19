import { IUser, UserContext } from '@/contexts/authContext';
import { auth } from '@/services/api';
import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Link,
	Stack,
	Image,
	useToast,
	InputRightElement,
	InputGroup
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import jwt from 'jsonwebtoken';

import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

export default function Login() {
	const [ username, setUsername ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ isLoading, setIsLoading ] = useState(false);

	const toast = useToast();
	const router = useRouter();
	const { setUser } = useContext(UserContext);

	const [ show, setShow ] = useState(false);
	const handleClick = () => setShow(!show);

	const handleLogin = () => {
		setIsLoading(true);
		if (username && password) {
			auth({
				username,
				password
			})
				.then(({ data }) => {
					setIsLoading(false);
					localStorage.setItem('token', data.access_token.toString());
					try {
						const decoded = jwt.decode(data.access_token) as IUser;
						if (decoded) {
							setUser(decoded);
							if (decoded.userType === 'ALUNO') {
								router.push('/portal/home');
							} else {
								router.push('/dashboard');
							}
						} else {
							localStorage.removeItem('token');
							router.push('/');
						}
					} catch (error) {
						toast({
							title: `Erro tente novamente!`,
							status: 'error',
							isClosable: true
						});
					}
				})
				.catch(() => {
					toast({
						title: `Email ou senha incorretos.`,
						status: 'error',
						isClosable: true
					});
					setIsLoading(false);
				});
		} else {
			toast({
				title: `Email e senha são obrigatórios.`,
				status: 'warning',
				isClosable: true
			});
		}
	};

	return (
		<Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
			<Flex p={8} flex={1} align={'center'} justify={'center'}>
				<Stack spacing={4} w={'full'} maxW={'md'}>
					<Heading fontSize={'2xl'}>Bem vindo de volta 🤩</Heading>
					<FormControl id="email">
						<FormLabel>Seu email</FormLabel>
						<Input
							type="email"
							placeholder="seuemail@seuemail.com"
							value={username}
							onChange={(e) => {
								setUsername(e.target.value);
							}}
							disabled={isLoading}
						/>
					</FormControl>
					<FormControl id="password">
						<FormLabel>Senha</FormLabel>
						<InputGroup size="md">
							<Input
								type={show ? 'text' : 'password'}
								placeholder="*********"
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
								}}
								disabled={isLoading}
							/>
							<InputRightElement width="4.5rem">
								<Button h="1.75rem" size="sm" onClick={handleClick} variant={'unstyled'}>
									{show ? <AiFillEyeInvisible size={'25'} /> : <AiFillEye size={'25'} />}
								</Button>
							</InputRightElement>
						</InputGroup>
					</FormControl>
					<Stack spacing={6}>
						<Stack direction={{ base: 'column', sm: 'row' }} align={'start'} justify={'space-between'}>
							<Link color={'blue.500'}>Esqueceu sua senha?</Link>
						</Stack>
						<Button colorScheme={'blue'} variant={'solid'} onClick={handleLogin} isLoading={isLoading}>
							Entrar
						</Button>
					</Stack>
				</Stack>
			</Flex>
			<Flex flex={1}>
				<Image
					alt={'Login Image'}
					objectFit={'cover'}
					src={
						'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
					}
				/>
			</Flex>
		</Stack>
	);
}
