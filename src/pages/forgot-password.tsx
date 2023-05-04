import { sendToken } from '@/services/api';
import { Button, Flex, FormControl, FormLabel, Heading, Input, Stack, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function ForgotPassword() {
	const [ username, setUsername ] = useState('');
	const [ isLoading, setIsLoading ] = useState(false);
	const toast = useToast();
	const router = useRouter();

	const handleSendToken = () => {
		setIsLoading(true);
		sendToken(username)
			.then(() => {
				router.push('/change-password/' + username);
				setIsLoading(false);
			})
			.catch(() => {
				toast({
					title: `Não foi possível enviar o código.`,
					status: 'error',
					isClosable: true
				});
			});
	};

	return (
		<Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
			<Flex p={8} flex={1} align={'center'} justify={'center'}>
				<Stack spacing={4} w={'full'} maxW={'md'} align={'center'} justify={'center'}>
					<Heading fontSize={'2xl'}>Recupere sua senha</Heading>
					<FormControl id="email">
						<FormLabel>Digite seu email</FormLabel>
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

					<Stack spacing={6}>
						<Stack direction={{ base: 'column', sm: 'row' }} align={'start'} justify={'space-between'} />
						<Button colorScheme={'blue'} variant={'solid'} onClick={handleSendToken} isLoading={isLoading}>
							Enviar código por e-mail
						</Button>
						<Button colorScheme="blue" variant="outline" onClick={() => router.push('/')}>
							Voltar
						</Button>
					</Stack>
				</Stack>
			</Flex>
		</Stack>
	);
}
