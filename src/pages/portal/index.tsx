import Aviso from '@/components/Aviso';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import useAuth from '@/hooks/useAuth';
import { listarAulasPorAluno } from '@/services/api';
import { Avatar, Box, Flex, Skeleton, Stack, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, useStatStyles } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface AulaAluno {
	id: string;
    titulo : string;
    alunoId : string;
    materialId: string;
    professorId: string;
    data: string;
    status: string;
    professor: {
      nome: string;
      sobrenome: string;
      email: string;
      userId: string;
      avatarUrl: string;
    }
}

export default function Portal() {
	const { user } = useAuth();
	const [aulas, setAulas] = useState<AulaAluno[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(()=>{
		user?.sub && listarAulasPorAluno(user?.sub).then((response)=>{
			setAulas(response.data);
			setLoading(false)
		})
	}, []);

	return (
		<>
			<NavBar />
			<Flex width={'100%'} height={"75vh"}  alignItems="center" bgColor="gray.100" overflowX="unset" flexDir="column">
				<Aviso/>
				{
					loading ? 
					<Flex width={'90%'}>
						<Stack>
							<Skeleton height='40px' />
							<Skeleton height='40px' />
							<Skeleton height='40px' />
						</Stack>
					</Flex>
					:
			<TableContainer width={'90%'} height="fit-content" backgroundColor={"#FFF"} borderRadius="10px" marginTop="50px">
						<Table variant='simple'>
							<TableCaption>Próximas Aulas</TableCaption>
							<Thead>
							<Tr>
								<Th>Professor</Th>
								<Th>Assunto</Th>
								<Th>Data</Th>
							</Tr>
							</Thead>
							<Tbody>
								{aulas.map((item, key)=>{
									return(
									<Tr key={key}>
										<Td>
											<Flex gap={"10px"} alignItems={"center"}>
												<Avatar
													size="sm"
													name={`${item.professor.nome} ${item.professor.sobrenome}`}
													src={item.professor.avatarUrl}
												/>
												{`${item.professor.nome} ${item.professor.sobrenome}`}
											</Flex>
										</Td>
										<Td>{item.titulo}</Td>
										<Td>{item.data}</Td>
									</Tr>)
								})}
							</Tbody>
						</Table>
				</TableContainer>
				}
			</Flex>
			<Footer />
		</>
	);
}
