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
	InputLeftElement
} from '@chakra-ui/react';
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import { FaSearch, FaPlus } from 'react-icons/fa';

export default function Materiais() {
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
							<BreadcrumbLink href="">Materiais</BreadcrumbLink>
						</BreadcrumbItem>
					</Breadcrumb>
				</Flex>
				<Flex>
					<InputGroup gap={'20px'}>
						<InputLeftElement pointerEvents="none" color={'gray.300'}>
							<FaSearch />
						</InputLeftElement>
						<Input type="tel" placeholder="Buscar Alunos" />
						<Button leftIcon={<FaPlus />} colorScheme="teal" variant="solid">
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
						</Tr>
					</Tbody>
				</Table>
			</TableContainer>
		</SidebarWithHeader>
	);
}
