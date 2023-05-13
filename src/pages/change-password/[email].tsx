import { UserContext } from '@/contexts/authContext';
import useAuth from '@/hooks/useAuth';
import { updatePassword } from '@/services/api';
import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Heading,
	Input,
	InputGroup,
	InputRightElement,
	PinInput,
	PinInputField,
	Stack,
	Text,
	useToast
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

export default function ForgotPassword() {
	const [ username, setUsername ] = useState('');
	const [ code, setCode ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ isLoading, setIsLoading ] = useState(false);
	const toast = useToast();
	const router = useRouter();
	const [ show, setShow ] = useState(false);
	const { logout } = useAuth();

	const handleSendToken = () => {
		const { email } = router.query;
		setIsLoading(true);
		if (!email) router.push('/forgot-password');
		if (!code && !username) {
			router.push('/forgot-password');
		}
		console.log(email);
		updatePassword({
			codigo: parseInt(code),
			email: email + '',
			senha: password
		})
			.then((response) => {
				logout();
			})
			.catch(() => {
				setIsLoading(false);
				toast({
					title: `Código inválido.`,
					status: 'error',
					isClosable: true
				});
			});
	};

	const handleClick = () => setShow(!show);
	return (
		<Stack
			minH={'100vh'}
			direction={{ base: 'column', md: 'row' }}
			bg={'#254C80'}
			bgGradient="linear(to-r, #254C80, #004edc)"
		>
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
					color="white"
				>
					<Heading fontSize={'2xl'}>Mude sua senha</Heading>
					<FormControl id="codigo">
						<Flex alignItems="center" flexDir="column">
							<FormLabel>Código enviado por e-mail</FormLabel>
							<Text textAlign="center" marginBottom="20px" marginTop="20px">
								Enviamos um código no seu email, confirme-o e digite a senha nova!
							</Text>
							<HStack>
								<PinInput
									onChange={(e) => {
										setCode(e);
									}}
								>
									<PinInputField color="white" border="none" bgColor="gray.600" />
									<PinInputField color="white" border="none" bgColor="gray.600" />
									<PinInputField color="white" border="none" bgColor="gray.600" />
									<PinInputField color="white" border="none" bgColor="gray.600" />
								</PinInput>
							</HStack>
						</Flex>
					</FormControl>
					<FormControl id="senha">
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

					<Stack spacing={6} width="100%">
						<Stack direction={{ base: 'column', sm: 'row' }} align={'start'} justify={'space-between'} />
						<Button colorScheme={'blue'} variant={'solid'} onClick={handleSendToken} isLoading={isLoading}>
							Alterar senha
						</Button>
						<Button colorScheme="blue" variant="outline" onClick={() => router.push('/forgot-password')}>
							Voltar
						</Button>
					</Stack>
				</Stack>
			</Flex>
		</Stack>
	);
}
