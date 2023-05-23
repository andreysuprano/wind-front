import { MaterialData } from '@/components/CardMaterial';
import SidebarWithHeader from '@/components/SideBar';
import { adicionarMaterial, listarMateriais, updateMaterial } from '@/services/api';
import { BsArrowUpRight } from 'react-icons/bs';
import {
	Box,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Button,
	Center,
	Flex,
	Heading,
	Img,
	Input,
	InputGroup,
	InputLeftElement,
	Skeleton,
	useDisclosure,
	useToast,
	Text,
	HStack,
	useColorModeValue,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { client } from '@/services/client';
import { TbEdit } from 'react-icons/tb';
import router from 'next/router';

type MaterialTypePost = {
	nome: string;
	descricao: string;
	driveUrl: string;
	thumbnail: string;
};

export default function Materiais() {
	const { formState: { errors }, control, handleSubmit, setValue } = useForm<MaterialTypePost>({
		defaultValues: {
			nome: '',
			descricao: '',
			driveUrl: '',
			thumbnail: ''
		}
	});

	const [ updateData, setUpdateData ] = useState(false);
	const [ materiais, setMateriais ] = useState<MaterialData[]>([]);
	const [ loading, setLoading ] = useState(true);
	const [ search, setSearch ] = useState('');
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [ editingMaterialbyID, setEditingMaterialbyID ] = useState('');

	const editingMat = useMemo(() => materiais.find((material) => material.id === editingMaterialbyID), [
		materiais,
		editingMaterialbyID
	]);

	const buscarMateriais = async () => {
		listarMateriais().then((res) => {
			setLoading(false);
			setMateriais(res.data);
		});
	};

	useEffect(() => {
		buscarMateriais();
	}, []);

	useEffect(
		() => {
			if (updateData) {
				buscarMateriais();
				setUpdateData(false);
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		[ updateData ]
	);

	useEffect(
		() => {
			if (editingMat) {
				setValue('nome', editingMat.nome);
				setValue('descricao', editingMat.descricao);
				setValue('driveUrl', editingMat.driveUrl);
				setValue('thumbnail', editingMat.thumbnail);
			} else {
				setValue('nome', '');
				setValue('descricao', '');
				setValue('driveUrl', '');
				setValue('thumbnail', '');
			}
		},
		[ editingMat, setValue ]
	);

	const handleAddMaterial: SubmitHandler<any> = (formData) => {
		setLoading(true);
		adicionarMaterial(formData)
			.then(() => {
				onClose();
				setLoading(false);
				setUpdateData(true);
				toast({
					title: `Material adicionado com sucesso.`,
					status: 'success',
					isClosable: true
				});
			})
			.catch((error) => {
				setLoading(false);
				if (!error.response) return;
				toast({
					title: `Não foi possível adicionar material.`,
					status: 'error',
					isClosable: true
				});
			});
	};

	const handleUpdateMaterial: SubmitHandler<any> = (formData) => {
		setLoading(true);
		updateMaterial(editingMaterialbyID, formData)
			.then(() => {
				onClose();
				setEditingMaterialbyID('');
				setLoading(false);
				setUpdateData(true);
				toast({
					title: `Material editado com sucesso.`,
					status: 'success',
					isClosable: true
				});
			})
			.catch((error) => {
				setLoading(false);
				if (!error.response) return;
				toast({
					title: `Não foi possível editar material.`,
					status: 'error',
					isClosable: true
				});
			});
	};
	function openTab(material: any) {
		let win = window.open(
			`/dashboard/materiais/${material}`,
			'',
			'popup_window,width=1280,height=800, resizable=false, fullscreen=false, scrollbars=false'
		);
	}

	return (
		<SidebarWithHeader>
			<Flex
				flexDir={'column'}
				gap={'20px'}
				backgroundColor={'gray.700'}
				color={'white'}
				padding={'20px'}
				borderRadius={'10px'}
				marginBottom={'20px'}
			>
				<Flex>
					<Breadcrumb spacing="8px" separator={'>'}>
						<BreadcrumbItem>
							<BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
						</BreadcrumbItem>

						<BreadcrumbItem>
							<BreadcrumbLink href="">Materiais</BreadcrumbLink>
						</BreadcrumbItem>
					</Breadcrumb>
				</Flex>
				<Flex>
					<InputGroup gap={'20px'}>
						<InputLeftElement pointerEvents="none" color={'gray.300'}>
							<FaSearch />
						</InputLeftElement>
						<Input
							type="tel"
							placeholder="Buscar Material"
							onChange={(e) => setSearch(e.target.value)}
							value={search}
							border="none"
							bgColor="gray.600"
						/>
						<Button leftIcon={<FaPlus />} colorScheme="blue" variant="solid" onClick={onOpen}>
							Novo
						</Button>
					</InputGroup>
				</Flex>
			</Flex>
			{loading ? (
				<Flex flexWrap="wrap" gap={'20px'}>
					<Skeleton w="250px" height="300px" />
					<Skeleton w="250px" height="300px" />
					<Skeleton w="250px" height="300px" />
					<Skeleton w="250px" height="300px" />
					<Skeleton w="250px" height="300px" />
					<Skeleton w="250px" height="300px" />
				</Flex>
			) : (
				<Flex flexWrap="wrap">
					{materiais.map((material, index) => {
						if (
							Object.values(material)
								.map((variavel) => variavel)
								.reduce((a, b) => (b = a + ' ' + b))
								.toLowerCase()
								.includes(search.toLowerCase())
						)
							return (
								<Center py={6} key={index}>
									<Box
										w="250px"
										rounded={'sm'}
										my={5}
										mx={[ 0, 5 ]}
										overflow={'hidden'}
										bg="white"
										border={'1px'}
										borderColor="black"
										// eslint-disable-next-line react-hooks/rules-of-hooks
										boxShadow={useColorModeValue('6px 6px 0 black', '6px 6px 0 cyan')}
									>
										<Box h={'150px'} borderBottom={'1px'} borderColor="black">
											<Img
												src={material.thumbnail}
												roundedTop={'sm'}
												objectFit="cover"
												h="full"
												w="full"
												alt={'Blog Image'}
											/>
										</Box>
										<Box p={4}>
											<Box
												bg="black"
												display={'inline-block'}
												px={2}
												py={1}
												color="white"
												mb={2}
											/>
											<Heading color={'black'} fontSize={'2xl'} noOfLines={1}>
												{material.nome}
											</Heading>
											<Text color={'gray.500'} noOfLines={2}>
												{material.descricao}
											</Text>
										</Box>
										<HStack borderTop={'1px'} color="black">
											<Flex
												p={4}
												alignItems="center"
												justifyContent={'space-between'}
												roundedBottom={'sm'}
												cursor={'pointer'}
												w="full"
											>
												<Text fontSize={'md'} fontWeight={'semibold'}>
													<Button onClick={() => openTab(material.id)}> Abrir</Button>
												</Text>
												<BsArrowUpRight />
											</Flex>
											<Flex
												p={4}
												alignItems="center"
												justifyContent={'space-between'}
												roundedBottom={'sm'}
												borderLeft={'1px'}
												cursor="pointer"
											>
												<TbEdit
													fontSize={'24px'}
													onClick={() => {
														setEditingMaterialbyID(material.id);
														onOpen();
													}}
												/>
											</Flex>
										</HStack>
									</Box>
								</Center>
							);
					})}
				</Flex>
			)}
			<Modal
				onClose={() => {
					onClose();
					setEditingMaterialbyID('');
				}}
				isOpen={isOpen}
				isCentered
			>
				<ModalOverlay />
				<form onSubmit={handleSubmit(editingMat ? handleUpdateMaterial : handleAddMaterial)}>
					<ModalContent>
						<ModalHeader>{`${editingMat ? 'Editar' : 'Adicionar novo'} material`}</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<Flex flexDir={'column'} gap={'15px'}>
								<Controller
									name="nome"
									control={control}
									rules={{ required: true }}
									render={({ field }) => (
										<Box>
											<Text>Nome</Text>
											<Input placeholder="Nome" required={true} {...field} />
										</Box>
									)}
								/>

								<Controller
									name="descricao"
									control={control}
									rules={{ required: true }}
									render={({ field }) => (
										<Box>
											<Text>Descricao</Text>
											<Input placeholder="Descricao" required={true} {...field} />
										</Box>
									)}
								/>

								<Controller
									name="driveUrl"
									control={control}
									rules={{ required: true }}
									render={({ field }) => (
										<Box>
											<Text>Endereco do drive</Text>
											<Input placeholder="Drive url" required={true} {...field} />
										</Box>
									)}
								/>

								<Controller
									name="thumbnail"
									control={control}
									rules={{ required: true }}
									render={({ field }) => (
										<Box>
											<Text>Imagem do material</Text>
											<Input placeholder="thumbnail" required={true} {...field} />
										</Box>
									)}
								/>
							</Flex>
						</ModalBody>
						<ModalFooter gap={'15px'}>
							<Button
								onClick={() => {
									onClose();
									setEditingMaterialbyID('');
								}}
							>
								Fechar
							</Button>
							<Button variant={'solid'} background={'green.200'} type="submit">
								Salvar
							</Button>
						</ModalFooter>
					</ModalContent>
				</form>
			</Modal>
		</SidebarWithHeader>
	);
}
