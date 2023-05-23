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
	const [ loading, setLoading ] = useState(true);
	const [ search, setSearch ] = useState('');
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [ editingMaterialbyID, setEditingMaterialbyID ] = useState('');

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
		window.open(
			`/dashboard/materiais/${material}`,
			'',
			'popup_window,width=1280,height=720, resizable=false, fullscreen=false, scrollbars=false'
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
							<BreadcrumbLink href="">HomeWorks</BreadcrumbLink>
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
				<Flex flexWrap="wrap" />
			)}
		</SidebarWithHeader>
	);
}
