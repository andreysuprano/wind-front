import SidebarWithHeader from '@/components/SideBar';
import { listarProfessores, adicionarProfessor, updateProfessor } from '@/services/api';
import {
	Avatar,
	Badge,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Button,
	Flex,
	Input,
	InputGroup,
	InputLeftElement,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
	Text,
	Box,
	Stack,
	Skeleton,
	useToast,
	Switch
} from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { FaSearch, FaPlus, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { client } from '@/services/client';

export type ProfessorType = {
	nome: string;
	sobrenome: string;
	cpf: string;
	email: string;
	id: string;
	senha: string;
	user: {
		ativo: true;
		avatarUrl: string;
	};
	userId: string;
};

type ProfessorTypePost = {
	nome: string;
	sobrenome: string;
	cpf: string;
	email: string;
	senha?: string;
	id: string;
	ativo: boolean;
	// avatarUrl: string;
};

type ProfessorNormalizadoType = {
	nome: string;
	sobrenome: string;
	cpf: string;
	email: string;
	id: string;
	senha: string;
	ativo: true;
	avatarUrl: string;
};

export default function Alunos() {
	const [ editingProfCPF, setEditingProfCPF ] = useState('');

	const { formState: { errors }, control, handleSubmit, setValue, unregister } = useForm<ProfessorTypePost>({
		defaultValues: {
			nome: '',
			sobrenome: '',
			cpf: '',
			email: '',
			ativo: true
			// avatarUrl: "",
		}
	});

	const [ updateData, setUpdateData ] = useState(false);
	const [ search, setSearch ] = useState('');
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [ professores, setProfessores ] = useState<ProfessorType[]>([]);
	const [ loading, setLoading ] = useState(true);

	const editingProf = useMemo(() => professores.find((professor) => professor.cpf === editingProfCPF), [
		professores,
		editingProfCPF
	]);

	async function buscarProfessores() {
		setLoading(true);
		listarProfessores()
			.then((response) => {
				setLoading(false);
				setProfessores(response.data);
			})
			.catch((error) => {
				if (!error.response) return;
				setLoading(false);
				toast({
					title: `Não foi possível listar professores.`,
					status: 'error',
					isClosable: true
				});
			});
	}

	useEffect(() => {
		buscarProfessores();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(
		() => {
			if (updateData) {
				buscarProfessores();
				setUpdateData(false);
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		[ updateData ]
	);

	useEffect(
		() => {
			if (editingProf) {
				setValue('nome', editingProf.nome);
				setValue('sobrenome', editingProf.sobrenome);
				setValue('cpf', editingProf.cpf);
				setValue('email', editingProf.email);
				unregister('ativo');
				// setValue("avatarUrl", editingProf.user.avatarUrl);
			} else {
				setValue('nome', '');
				setValue('sobrenome', '');
				setValue('cpf', '');
				setValue('email', '');
				setValue('ativo', true);
				// setValue("avatarUrl", "");
			}
		},
		[ editingProf, setValue ]
	);

	const handleAddTeacher: SubmitHandler<any> = (formData) => {
		setLoading(true);
		adicionarProfessor(formData)
			.then(() => {
				onClose();
				setLoading(false);
				setUpdateData(true);
				toast({
					title: `Professor(a) adicionado com sucesso.`,
					status: 'success',
					isClosable: true
				});
			})
			.catch((error) => {
				setLoading(false);
				if (!error.response) return;
				toast({
					title: `Não foi possível adicionar professor(a).`,
					status: 'error',
					isClosable: true
				});
			});
	};

	const handleUpdateTeacher: SubmitHandler<any> = (formData) => {
		setLoading(true);
		updateProfessor(formData)
			.then(() => {
				onClose();
				setEditingProfCPF('');
				setLoading(false);
				setUpdateData(true);
				toast({
					title: `Professor(a) editado com sucesso.`,
					status: 'success',
					isClosable: true
				});
			})
			.catch((error) => {
				setLoading(false);
				if (!error.response) return;
				toast({
					title: `Não foi possível editar professor(a).`,
					status: 'error',
					isClosable: true
				});
			});
	};

	const deleteUser = (id: string, value: boolean) => {
		const result = value ? 'habilitado' : 'desabilitado';
		const action = value ? 'habilitar' : 'desabilitar';
		setLoading(true);
		client
			.post(`/v1/professor/${id}/block/${value}`)
			.then(() => {
				setUpdateData(true);
				setLoading(false);
				toast({
					title: `Professor(a) ${result}`,
					status: 'success',
					isClosable: true
				});
			})
			.catch((error: any) => {
				if (!error.response) return;
				setLoading(false);
				toast({
					title: `Não foi possível ${action} professor.`,
					status: 'error',
					isClosable: true
				});
			});
	};

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
							<BreadcrumbLink href="">Professores</BreadcrumbLink>
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
							placeholder="Buscar professores..."
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
				<Stack>
					<Skeleton height="20px" />
					<Skeleton height="40px" />
					<Skeleton height="40px" />
					<Skeleton height="40px" />
					<Skeleton height="20px" />
				</Stack>
			) : (
				<TableContainer backgroundColor="gray.700" borderRadius="10px" maxH={'70vh'} overflowY={'auto'}>
					<Table variant="unstyled" color="#DDD">
						<Thead position="sticky" top={0} zIndex="docked" bgColor={'gray.700'} borderBottom={'gray.300'}>
							<Tr>
								<Th color="#DDD">Nome</Th>
								<Th color="#DDD">CPF</Th>
								<Th color="#DDD">Email</Th>
								<Th color="#DDD">Status</Th>
							</Tr>
						</Thead>
						<Tbody>
							{professores.map((professor, index) => {
								var professoreNormalizado: ProfessorNormalizadoType = {
									ativo: professor.user.ativo,
									avatarUrl: professor.user.avatarUrl,
									cpf: professor.cpf,
									email: professor.email,
									id: professor.id,
									nome: professor.nome,
									senha: professor.senha,
									sobrenome: professor.sobrenome
								};
								// @ts-ignore
								if (
									Object.values(professoreNormalizado)
										.map(
											(variavel) =>
												typeof variavel === 'boolean'
													? variavel ? 'ativo' : 'desabilitado'
													: variavel
										)
										.reduce((a, b) => (b = a + ' ' + b))
										.toLowerCase()
										.includes(search.toLowerCase())
								)
									return (
										<Tr
											key={index}
											_hover={{ bgColor: 'gray.500', cursor: 'pointer' }}
											borderColor="gray.700"
											color="#DDD"
										>
											<Td
												onClick={() => {
													setEditingProfCPF(professor.cpf);
													onOpen();
												}}
											>
												<Flex gap={'10px'} alignItems={'center'}>
													<Avatar
														size="sm"
														name={professor.nome + ' ' + professor.sobrenome}
														src={professor.user.avatarUrl}
													/>
													{professor.nome + ' ' + professor.sobrenome}
												</Flex>
											</Td>
											<Td
												onClick={() => {
													setEditingProfCPF(professor.cpf);
													onOpen();
												}}
											>
												{professor.cpf}
											</Td>
											<Td
												onClick={() => {
													setEditingProfCPF(professor.cpf);
													onOpen();
												}}
											>
												{professor.email}
											</Td>
											<Td>
												<Stack align="center" direction="row">
													<Switch
														size="lg"
														isChecked={professor.user.ativo}
														onChange={() =>
															deleteUser(professor.userId, !professor.user.ativo)}
													/>
												</Stack>
											</Td>
										</Tr>
									);
							})}
						</Tbody>
					</Table>
				</TableContainer>
			)}

			<Modal
				onClose={() => {
					onClose();
					setEditingProfCPF('');
				}}
				isOpen={isOpen}
				isCentered
			>
				<ModalOverlay />
				<form onSubmit={handleSubmit(editingProf ? handleUpdateTeacher : handleAddTeacher)}>
					<ModalContent>
						<ModalHeader>{`${editingProf ? 'Editar' : 'Adicionar novo'} professor(a)`}</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<Flex flexDir={'column'} gap={'15px'}>
								<Flex gap={'15px'}>
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
										name="sobrenome"
										control={control}
										rules={{ required: true }}
										render={({ field }) => (
											<Box>
												<Text>Sobrenome</Text>
												<Input placeholder="Sobrenome" required={true} {...field} />
											</Box>
										)}
									/>
								</Flex>

								<Controller
									name="cpf"
									control={control}
									rules={{ required: true }}
									render={({ field }) => (
										<Box>
											<Text>Cpf</Text>
											<Input placeholder="Cpf" required={true} {...field} />
										</Box>
									)}
								/>

								<Controller
									name="email"
									control={control}
									rules={{ required: true }}
									render={({ field }) => (
										<Box>
											<Text>Email</Text>
											<Input placeholder="Email" required={true} {...field} />
										</Box>
									)}
								/>
								{!editingProf && (
									<Controller
										name="senha"
										control={control}
										rules={{ required: true }}
										render={({ field }) => (
											<Box>
												<Text>Senha</Text>
												<Input placeholder="Senha" required={true} {...field} />
											</Box>
										)}
									/>
								)}
							</Flex>
						</ModalBody>
						<ModalFooter gap={'15px'}>
							<Button
								onClick={() => {
									onClose();
									setEditingProfCPF('');
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
