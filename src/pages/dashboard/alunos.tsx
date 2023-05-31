import SidebarWithHeader from '@/components/SideBar';
import { adicionarAluno, listarAlunos, listarAlunosPorProfessorId, listarProfessores, updateAluno } from '@/services/api';
import {
	Avatar,
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
	Switch,
  Select
} from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { client } from '@/services/client';
import userAuth from '@/hooks/useAuth';
import { ProfessorType } from './professores';

export type AlunosType = {
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

type AlunosTypePost = {
	nome: string;
	sobrenome: string;
	cpf: string;
	email: string;
	id: string;
	senha?: string;
	ativo: boolean;
	professorId: string | undefined;
};

type AlunosNormalizadoType = {
	nome: string;
	sobrenome: string;
	cpf: string;
	email: string;
	id: string;
	senha: string;
	ativo: true;
	avatarUrl: string;
	userId: string;
};

export default function Alunos() {
	const { user } = userAuth();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [ alunos, setAlunos ] = useState<AlunosType[]>([]);
	const [ professores, setProfessores ] = useState<ProfessorType[]>([]);
	const [ loading, setLoading ] = useState(true);
	const [ professorId, setProfessorId ] = useState('');
	const [ updateData, setUpdateData ] = useState(false);
	const [ search, setSearch ] = useState('');
	const toast = useToast();
	const [ editingAlunoCPF, setEditingAlunoCPF ] = useState('');

	const { formState: { errors }, control, handleSubmit, setValue, unregister } = useForm<Partial<AlunosTypePost>>({
		defaultValues: {
			nome: '',
			sobrenome: '',
			cpf: '',
			email: '',
			ativo: true,
			professorId: ''
		}
	});

	const editingAluno = useMemo(() => alunos.find((aluno) => aluno.cpf === editingAlunoCPF), [
		alunos,
		editingAlunoCPF
	]);

  const filtrarProfessor = (email:string) =>{
    return professores.find((p)=>p.email === email)
  }

  const validateProfessor = () =>{
    if(user?.userType === 'PROFESSOR'){
      const professor = filtrarProfessor(user.username);
      if(professor)
        setProfessorId(professor.id)      
    }
  }
  
  const handleOpenModal = () =>{
    validateProfessor();
    setValue("professorId", professorId);
    onOpen();
  }

	const buscarAlunos = useCallback(
		() => {
			setLoading(true);
				listarAlunos()
					.then((response) => {
						setLoading(false);
						setAlunos(response.data);
					})
					.catch((error) => {
						if (!error.response) return;
						setLoading(false);
						toast({
							title: `Não foi possível listar alunos.`,
							status: 'error',
							isClosable: true
						});
					});
			
		},
		[ alunos ]
	);

	const buscarProfessores = useCallback(
		() => {
			listarProfessores()
				.then((response) => {
					setProfessores(response.data);
          validateProfessor();
				})
				.catch((error) => {
					if (!error.response) return;
					toast({
						title: `Não foi possível buscar os professores.`,
						status: 'error',
						isClosable: true
					});
				});
		},
		[ professores ]
	);

	useEffect(() => {
		buscarAlunos();
		buscarProfessores();
	}, []);

	useEffect(
		() => {
			if (updateData) {
				buscarAlunos();
				setUpdateData(false);
			}
		},
		[ updateData ]
	);

	useEffect(
		() => {
			if (editingAluno) {
				setValue('nome', editingAluno.nome);
				setValue('sobrenome', editingAluno.sobrenome);
				setValue('cpf', editingAluno.cpf);
				setValue('email', editingAluno.email);
				unregister('senha')
				unregister('ativo')
				unregister('professorId')
			} else {
				setValue('nome', '');
				setValue('sobrenome', '');
				setValue('cpf', '');
				setValue('email', '');
				setValue('senha', '');
				setValue('ativo', true);
			}
		},
		[ editingAluno, setValue ]
	);

	const handleAddAluno: SubmitHandler<any> = (formData) => {
    validateProfessor();
		setLoading(true);
		adicionarAluno(formData)
			.then(() => {
				onClose();
				setLoading(false);
				setUpdateData(true);
				toast({
					title: `Aluno(a) adicionado com sucesso.`,
					status: 'success',
					isClosable: true
				});
			})
			.catch((error) => {
				setLoading(false);
				if (!error.response) return;
				toast({
					title: `Não foi possível adicionar aluno(a).`,
					status: 'error',
					isClosable: true
				});
			});
	};

	const handleUpdateAluno: SubmitHandler<any> = (formData) => {
    validateProfessor();
		setLoading(true);
		updateAluno(formData)
			.then(() => {
				onClose();
				setEditingAlunoCPF('');
				setLoading(false);
				setUpdateData(true);
				toast({
					title: `Aluno(a) editado com sucesso.`,
					status: 'success',
					isClosable: true
				});
			})
			.catch((error) => {
				setLoading(false);
				if (!error.response) return;
				toast({
					title: `Não foi possível editar aluno(a).`,
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
			.post(`/v1/aluno/${id}/block/${value}`)
			.then(() => {
				setUpdateData(true);
				setLoading(false);
				toast({
					title: `Aluno(a) ${result}`,
					status: 'success',
					isClosable: true
				});
			})
			.catch((error) => {
				if (!error.response) return;
				setLoading(false);
				toast({
					title: `Não foi possível ${action} aluno.`,
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
							<BreadcrumbLink href="">Alunos</BreadcrumbLink>
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
							placeholder="Buscar alunos..."
							onChange={(e) => setSearch(e.target.value)}
							value={search}
							border="none"
							bgColor="gray.600"
						/>
						<Button leftIcon={<FaPlus />} colorScheme="blue" variant="solid" onClick={handleOpenModal}>
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
				<TableContainer backgroundColor="gray.700" borderRadius="10px" overflowY={'auto'} maxH={'70vh'}>
					<Table variant="unstyled" color="#DDD">
						<Thead position="sticky" top={0} zIndex="docked" bgColor={'gray.700'} borderBottom={'gray.300'}>
							<Tr>
								<Th>Nome</Th>
								<Th>CPF</Th>
								<Th>Email</Th>
								<Th>Status</Th>
							</Tr>
						</Thead>
						<Tbody>
							{alunos.map((aluno, index) => {
								var alunosNormalizado: AlunosNormalizadoType = {
									ativo: aluno.user.ativo,
									avatarUrl: aluno.user.avatarUrl,
									cpf: aluno.cpf,
									email: aluno.email,
									id: aluno.id,
									nome: aluno.nome,
									senha: aluno.senha,
									sobrenome: aluno.sobrenome,
									userId: aluno.userId
								};
								// @ts-ignore
								if (
									Object.values(alunosNormalizado)
										.map(
											(item) =>
												typeof item === 'boolean'
													? item ? 'habilitado' : 'desabilitado'
													: item
										)
										.reduce((a, b) => (b = a + ' ' + b))
										.toLowerCase()
										.includes(search.toLowerCase())
								)
									return (
										<Tr key={index} _hover={{ bgColor: 'gray.500', cursor: 'pointer' }}>
											<Td
												onClick={() => {
													setEditingAlunoCPF(aluno.cpf);
													handleOpenModal();
												}}
											>
												<Flex gap={'10px'} alignItems={'center'}>
													<Avatar
														size="sm"
														name={aluno.nome + ' ' + aluno.sobrenome}
														src={aluno.user.avatarUrl}
													/>
													{aluno.nome + ' ' + aluno.sobrenome}
												</Flex>
											</Td>
											<Td
												onClick={() => {
													setEditingAlunoCPF(aluno.cpf);
													handleOpenModal();
												}}
											>
												{aluno.cpf}
											</Td>
											<Td
												onClick={() => {
													setEditingAlunoCPF(aluno.cpf);
													handleOpenModal();
												}}
											>
												{aluno.email}
											</Td>
											<Td>
												<Stack align="center" direction="row">
													<Switch
														size="lg"
														isChecked={aluno.user.ativo}
														onChange={() => deleteUser(aluno.userId, !aluno.user.ativo)}
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
					setEditingAlunoCPF('');
				}}
				isOpen={isOpen}
				isCentered
			>
				<ModalOverlay />
				<form onSubmit={handleSubmit(editingAluno ? handleUpdateAluno : handleAddAluno)}>
					<ModalContent>
						<ModalHeader>{`${editingAluno ? 'Editar' : 'Adicionar novo'} aluno(a)`}</ModalHeader>
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
								{!editingAluno && (
									<Controller
										name="senha"
										control={control}
										rules={{ required: true }}
										render={({ field }) => (
											<Box>
												<Text>Senha</Text>
												<Input placeholder="Senha" required={true} type="password" {...field} />
											</Box>
										)}
									/>
								)}
                {user?.userType === 'ADMIN' && (
									<Controller
										name="professorId"
										control={control}
										rules={{ required: true }}
										render={({ field }) => (
											<Box>
												<Text>Professor</Text>
                        <Select required={true} {...field}>
                            <option value="">Selecione o Professor</option>;
                            {professores.map((item, index) => {
                              return (
                                <option
                                  value={item.id}
                                  key={index}
                                >{`${item.nome} ${item.sobrenome}`}</option>
                              );
                            })}
                          </Select>
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
									setEditingAlunoCPF('');
								}}
							>
								Fechar
							</Button>
							<Button
								variant={'solid'}
								background={'#254C80'}
								color={'#FFF'}
								type="submit"
								_hover={{ bgColor: '#254D80' }}
							>
								Salvar
							</Button>
						</ModalFooter>
					</ModalContent>
				</form>
			</Modal>
		</SidebarWithHeader>
	);
}
