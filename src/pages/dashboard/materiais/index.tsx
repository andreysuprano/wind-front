import CardMaterial, { MaterialData } from '@/components/CardMaterial';
import SidebarWithHeader from '@/components/SideBar';
import { listarMateriais } from '@/services/api';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Button,
	Flex,
	Input,
	InputGroup,
	InputLeftElement,
	Skeleton
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa';

export default function Materiais() {
	const [ materiais, setMateriais ] = useState<MaterialData[]>([]);
	const [ loading, setLoading ] = useState(true);

	const buscarMateriais = async () => {
		listarMateriais().then((res) => {
			setLoading(false);
			setMateriais(res.data);
		});
	};

	useEffect(() => {
		buscarMateriais();
	});

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
						<Input type="tel" placeholder="Buscar Material" />
						<Button leftIcon={<FaPlus />} colorScheme="blue" variant="solid">
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
						return (
							<CardMaterial
								key={index}
								thumbnail={material.thumbnail}
								descricao={material.descricao}
								driveUrl={material.driveUrl}
								id={material.id}
								nome={material.nome}
							/>
						);
					})}
				</Flex>
			)}
		</SidebarWithHeader>
	);
}
