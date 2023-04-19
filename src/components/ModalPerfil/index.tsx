import { IUser } from '@/contexts/authContext';
import {
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalHeader,
	ModalOverlay,
	ModalContent,
	ModalFooter,
	Button,
	Stack,
	FormControl,
	FormLabel,
	Center,
	Avatar,
	Heading,
	AvatarBadge,
	IconButton,
	Flex
} from '@chakra-ui/react';

import { FaPencilAlt } from 'react-icons/fa';

type ModalPerfil = {
	onClose: () => void;
	isOpen: boolean;
	onOpen: () => void;
	user: IUser | undefined;
};

export const ModalPerfil = ({ onOpen, isOpen, onClose, user }: ModalPerfil) => {
	return (
		<Modal onClose={onClose} isOpen={isOpen} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalCloseButton />
				<ModalBody>
					<Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }} marginBottom={'20px'}>
						Meu Perfil
					</Heading>
					<FormControl id="userName">
						<FormLabel>Avatar</FormLabel>
						<Flex marginBottom={'20px'}>
							<Avatar size="xl" src={user?.avatar}>
								<AvatarBadge
									as={IconButton}
									size="sm"
									rounded="full"
									top="-10px"
									colorScheme="red"
									aria-label="remove Image"
									icon={<FaPencilAlt />}
								/>
							</Avatar>
						</Flex>
					</FormControl>
					<FormControl id="userName" isRequired>
						<FormLabel>Nome</FormLabel>
						<Input placeholder="Nome" _placeholder={{ color: 'gray.500' }} type="text" value={user?.name.split(' ')[0]}/>
					</FormControl>
					<FormControl id="lastName" isRequired>
						<FormLabel>Sobrenome</FormLabel>
						<Input placeholder="Sobrenome" _placeholder={{ color: 'gray.500' }} type="text" value={user?.name.split(' ')[1]}/>
					</FormControl>
					<FormControl id="email" isRequired>
						<FormLabel>Email address</FormLabel>
						<Input placeholder="your-email@example.com" _placeholder={{ color: 'gray.500' }} type="email" value={user?.username}/>
					</FormControl>
					<Flex gap={'15px'}>
						<FormControl id="password" isRequired>
							<FormLabel>Senha</FormLabel>
							<Input placeholder="*******" _placeholder={{ color: 'gray.500' }} type="password" />
						</FormControl>
						<FormControl id="password" isRequired>
							<FormLabel>Repita a senha</FormLabel>
							<Input placeholder="*******" _placeholder={{ color: 'gray.500' }} type="password" />
						</FormControl>
					</Flex>
					<Stack spacing={6} direction={[ 'column', 'row' ]} marginTop={'20px'} marginBottom={'20px'}>
						<Button
							bg={'red.400'}
							color={'white'}
							w="full"
							_hover={{
								bg: 'red.500'
							}}
						>
							Cancelar
						</Button>
						<Button
							bg={'blue.400'}
							color={'white'}
							w="full"
							_hover={{
								bg: 'blue.500'
							}}
						>
							Salvar
						</Button>
					</Stack>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
