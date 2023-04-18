import SidebarWithHeader from '@/components/NavBar';
import { listarAlunos, listarProfessores } from '@/services/api';
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
	IconButton,
	Stack,
	Skeleton
} from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaSearch, FaPlus, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';

type ProfessorType = {
	nome: string;
	avatarUrl: string;
	sobrenome: string;
	cpf: string;
	email: string;
	ativo: true;
};

export default function Alunos() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [ professores, setProfessores ] = useState<ProfessorType[]>([]);
	const [ loading, setLoading ] = useState(true);

	const buscarProfessores = async () => {
		setLoading(true);
		listarProfessores()
			.then((response) => {
				setLoading(false);
				console.log(loading);
				setProfessores(response.data);
			})
			.catch((err) => {
				setLoading(false);
				console.log(loading);
				console.log(err);
			});
	};

	useEffect(
		() => {
			buscarProfessores();
		},
		[ onClose ]
	);

	return (
		<SidebarWithHeader>
			<Flex
				flexDir={'column'}
				gap={'20px'}
				backgroundColor={'#FFF'}
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
						<InputLeftElement pointerEvents="none" children={[ <FaSearch /> ]} color={'gray.300'} />
						<Input type="tel" placeholder="Buscar Professores" />
						<Button leftIcon={<FaPlus />} colorScheme="teal" variant="solid" onClick={onOpen}>
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
				<TableContainer backgroundColor={'#FFF'} borderRadius="10px">
					<Table variant="simple">
						<Thead>
							<Tr>
								<Th>Nome</Th>
								<Th>CPF</Th>
								<Th>Email</Th>
								<Th>Status</Th>
								<Th>Actions</Th>
							</Tr>
						</Thead>
						<Tbody>
							{professores.map((professor, index) => {
								return (
									<Tr key={index}>
										<Td>
											<Flex gap={'10px'} alignItems={'center'}>
												<Avatar
													size="sm"
													name={professor.nome + ' ' + professor.sobrenome}
													src={professor.avatarUrl}
												/>
												{professor.nome + ' ' + professor.sobrenome}
											</Flex>
										</Td>
										<Td>{professor.cpf}</Td>
										<Td>{professor.email}</Td>
										<Td>
											{professor.ativo ? (
												<Badge colorScheme="green">ATIVO</Badge>
											) : (
												<Badge colorScheme="red">INATIVO</Badge>
											)}
										</Td>
										<Td>
											<Flex gap={'10px'}>
												<IconButton
													icon={<FaPencilAlt />}
													colorScheme="yellow"
													variant="solid"
													aria-label=""
												/>
												<IconButton
													icon={<FaTrashAlt />}
													colorScheme="red"
													variant="solid"
													aria-label=""
												/>
											</Flex>
										</Td>
									</Tr>
								);
							})}
						</Tbody>
					</Table>
				</TableContainer>
			)}

			<Modal onClose={onClose} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Adicionar novo professor</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex flexDir={'column'} gap={'15px'}>
							<Flex gap={'15px'}>
								<Box>
									<Text>Nome</Text>
									<Input placeholder="Nome" />
								</Box>
								<Box>
									<Text>Sobrenome</Text>
									<Input placeholder="Sobrenome" />
								</Box>
							</Flex>

							<Box>
								<Text>Cpf</Text>
								<Input placeholder="Cpf" />
							</Box>

							<Box>
								<Text>Email</Text>
								<Input placeholder="Email" />
							</Box>

							<Box>
								<Text>Senha</Text>
								<Input placeholder="Senha" />
							</Box>
						</Flex>
					</ModalBody>
					<ModalFooter gap={'15px'}>
						<Button onClick={onClose}>Fechar</Button>
						<Button variant={'solid'} background={'green.200'} onClick={onClose}>
							Salvar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</SidebarWithHeader>
	);
}
