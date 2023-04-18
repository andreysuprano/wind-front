import SidebarWithHeader from '@/components/NavBar';
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
	IconButton
} from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import { FaSearch, FaPlus, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';

export default function Professores() {
	const { isOpen, onOpen, onClose } = useDisclosure();
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
						<InputLeftElement pointerEvents="none" children={<FaSearch />} color={'gray.300'} />
						<Input type="tel" placeholder="Buscar Professores" />
						<Button leftIcon={<FaPlus />} colorScheme="teal" variant="solid" onClick={onOpen}>
							Novo
						</Button>
					</InputGroup>
				</Flex>
			</Flex>

			<TableContainer backgroundColor={'#FFF'} borderRadius="10px">
				<Table variant="simple">
					<Thead>
						<Tr>
							<Th>Nome</Th>
							<Th>CPF</Th>
							<Th>Email</Th>
							<Th>Status</Th>
							<Th> </Th>
						</Tr>
					</Thead>
					<Tbody>
						<Tr>
							<Td>
								<Flex gap={'10px'} justifyContent={'center'} alignItems={'center'}>
									<Avatar size="sm" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
									João Abramovich
								</Flex>
							</Td>
							<Td>117.784.579-24</Td>
							<Td>andsuprano@gmail.com</Td>
							<Td>
								<Badge colorScheme="green">ATIVO</Badge>
							</Td>
							<Td>
								<Flex gap={'10px'}>
									<IconButton
										icon={<FaPencilAlt />}
										colorScheme="yellow"
										variant="solid"
										aria-label=""
									/>
									<IconButton icon={<FaTrashAlt />} colorScheme="red" variant="solid" aria-label="" />
								</Flex>
							</Td>
						</Tr>
						<Tr>
							<Td>
								<Flex gap={'10px'} justifyContent={'center'} alignItems={'center'}>
									<Avatar size="sm" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
									João Abramovich
								</Flex>
							</Td>
							<Td>117.784.579-24</Td>
							<Td>andsuprano@gmail.com</Td>
							<Td>
								<Badge colorScheme="green">ATIVO</Badge>
							</Td>
							<Td>
								<Flex gap={'10px'}>
									<IconButton
										icon={<FaPencilAlt />}
										colorScheme="yellow"
										variant="solid"
										aria-label=""
									/>
									<IconButton icon={<FaTrashAlt />} colorScheme="red" variant="solid" aria-label="" />
								</Flex>
							</Td>
						</Tr>
						<Tr>
							<Td>
								<Flex gap={'10px'} justifyContent={'center'} alignItems={'center'}>
									<Avatar size="sm" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
									João Abramovich
								</Flex>
							</Td>
							<Td>117.784.579-24</Td>
							<Td>andsuprano@gmail.com</Td>
							<Td>
								<Badge colorScheme="green">ATIVO</Badge>
							</Td>
							<Td>
								<Flex gap={'10px'}>
									<IconButton
										icon={<FaPencilAlt />}
										colorScheme="yellow"
										variant="solid"
										aria-label=""
									/>
									<IconButton icon={<FaTrashAlt />} colorScheme="red" variant="solid" aria-label="" />
								</Flex>
							</Td>
						</Tr>
					</Tbody>
				</Table>
			</TableContainer>

			<Modal onClose={onClose} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Adicionar novo Professor</ModalHeader>
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
