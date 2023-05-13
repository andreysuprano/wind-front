import { IUser, UserContext } from '@/contexts/authContext';
import { auth, buscarProfessorPorEmail } from '@/services/api';
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
	InputGroup,
	Avatar,
	Img
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
								router.push('/portal');
							} else {
								if (decoded.userType === 'PROFESSOR') {
									buscarProfessorPorEmail(decoded.username).then((response) => {
										localStorage.setItem('@professorID', response.data.id);
									});
								}
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
					setIsLoading(false);

					toast({
						title: `Email ou senha incorretos.`,
						status: 'error',
						isClosable: true
					});
					setIsLoading(false);
				});
		} else {
			setIsLoading(false);

			toast({
				title: `Email e senha são obrigatórios.`,
				status: 'warning',
				isClosable: true
			});
		}
	};

	return (
		<Stack minH={'100vh'} bg={'#254C80'} bgGradient="linear(to-r, #254C80, #004edc)">
			<Flex p={8} flex={1} align={'center'} justify={'center'}>
				<Stack
					spacing={4}
					w={'full'}
					maxW={'md'}
					align={'center'}
					justify={'center'}
					backgroundColor={'gray.700'}
					padding={'40px'}
					borderRadius="20px"
				>
					<Img
						src={
							'https://firebasestorage.googleapis.com/v0/b/projetcs-storage.appspot.com/o/windfall%2FWhatsApp%20Image%202023-03-29%20at%2014.04.46.jpeg?alt=media&token=1095f376-9566-4936-99c3-5eb9e3c1a541'
						}
						width="100px"
						borderRadius="10px"
						boxShadow="lg"
					/>
					<Heading color="white" fontSize={'2xl'}>
						Windfall Language Institute 🤩
					</Heading>
					<FormControl id="email">
						<FormLabel color="white">Seu email</FormLabel>
						<Input
							type="email"
							placeholder="seuemail@seuemail.com"
							value={username}
							onChange={(e) => {
								setUsername(e.target.value);
							}}
							disabled={isLoading}
							color="white"
							border="none"
							bgColor="gray.600"
						/>
					</FormControl>
					<FormControl id="password">
						<FormLabel color="white">Senha</FormLabel>
						<InputGroup size="md">
							<Input
								type={show ? 'text' : 'password'}
								placeholder="*********"
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
								}}
								disabled={isLoading}
								color="white"
								border="none"
								bgColor="gray.600"
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
							<Link color={'blue.500'} onClick={() => router.push('/forgot-password')}>
								Esqueceu sua senha?
							</Link>
						</Stack>
						<Button colorScheme={'blue'} variant={'solid'} onClick={handleLogin} isLoading={isLoading}>
							Entrar
						</Button>
					</Stack>
				</Stack>
			</Flex>
		</Stack>
	);
}
