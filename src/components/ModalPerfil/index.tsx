import { IUser } from "@/contexts/authContext";
import { updateUsuario } from "@/services/api";

import {
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalOverlay,
	ModalContent,
	Button,
	Stack,
	FormControl,
	FormLabel,
	Avatar,
	Heading,
	AvatarBadge,
	IconButton,
	Flex,
	useToast,
	Text,
	Progress,
	Link
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../../firebase/config';
import { FaPencilAlt } from 'react-icons/fa';

type ModalPerfil = {
  onClose: () => void;
  isOpen: boolean;
  onOpen: () => void;
  user: IUser | undefined;
};

type UserypePost = {
  avatar: string;
  name: string;
  email: string;
  senha: string;
};

export const ModalPerfil = ({ onOpen, isOpen, onClose, user }: ModalPerfil) => {
	const [imageFile, setImageFile] = useState<File>();
	const [downloadURL, setDownloadURL] = useState('')
	const [isUploading, setIsUploading] = useState(false)
	const [progressUpload, setProgressUpload] = useState(0)

	const toast = useToast();
	const inputFile = useRef<any>();
	
	useEffect(() => {
		if(imageFile){
			handleUploadFile();
		}
	}, [imageFile]);

	const handleChangeAvatar = () => {
		inputFile.current.click();
	}

	const handleSelectedFile = (files: any) => {
		if (files && files[0].size < 10000000) {
		  setImageFile(files[0])
		  console.log(files[0])
		} else {
			toast({
				title: `Foto muito pesada, selecione outra!`,
				status: "warning",
				isClosable: true,
			});
		}
	  }

	const handleUploadFile = () => {
		if (imageFile) {
			const name = user?.sub;
			const storageRef = ref(storage, `windfall/${name}`)
			const uploadTask = uploadBytesResumable(storageRef, imageFile)
			uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
				setProgressUpload(progress) // to show progress upload
				switch (snapshot.state) {
				case 'paused':
					console.log('Upload is paused')
					break
				case 'running':
					console.log('Upload is running')
					break
				}
			},
			(error) => {
				toast({
					title: error + "",
					status: "warning",
					isClosable: true,
				});
			},
			() => {
					getDownloadURL(uploadTask.snapshot.ref).then((url) => {
					setDownloadURL(url)
				})
			},
			)
		} else {
			toast({
				title: "Arquivo não encontrado!",
				status: "warning",
				isClosable: true,
			});
		}
	}

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
						<Progress colorScheme='green' size='sm' value={progressUpload} marginTop={'10px'}marginBottom={'10px'}/>
						<FormLabel>Avatar</FormLabel>
						<Flex marginBottom={'20px'}>
							<Avatar size="xl" src={downloadURL ? downloadURL : user?.avatar}>
								<AvatarBadge
									as={IconButton}
									size="sm"
									rounded="full"
									top="-10px"
									colorScheme="red"
									aria-label="remove Image"
									icon={<FaPencilAlt />}
									onClick={handleChangeAvatar}
								/>
							</Avatar>
						<Input 
							display="none" 
							type='file' 
							ref={inputFile} 
							onChange={(files) => handleSelectedFile(files.target.files)}
							accept="image/*"
						/>
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
					<FormControl id="email" isRequired marginBottom="10px">
						<FormLabel>Email address</FormLabel>
						<Input placeholder="your-email@example.com" _placeholder={{ color: 'gray.500' }} type="email" value={user?.username}/>
					</FormControl>
					{/* <Flex gap={'15px'}>
						<FormControl id="password" isRequired>
							<FormLabel>Senha</FormLabel>
							<Input placeholder="*******" _placeholder={{ color: 'gray.500' }} type="password" />
						</FormControl>
						<FormControl id="password" isRequired>
							<FormLabel>Repita a senha</FormLabel>
							<Input placeholder="*******" _placeholder={{ color: 'gray.500' }} type="password" />
						</FormControl>
					</Flex> */}
					<Link href="#">Trocar minha senha.</Link>
					<Stack spacing={6} direction={[ 'column', 'row' ]} marginTop={'20px'} marginBottom={'20px'}>
						<Button
							bg={'red.400'}
							color={'white'}
							w="full"
							_hover={{
								bg: 'red.500'
							}}
							disabled={isUploading}
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
							disabled={isUploading}
						>
							Salvar
						</Button>
					</Stack>
				</ModalBody>
			</ModalContent>
		</Modal>
	)
};
