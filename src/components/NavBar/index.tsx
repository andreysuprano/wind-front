import React, { ReactNode } from 'react';
import {
	IconButton,
	Avatar,
	Box,
	CloseButton,
	Flex,
	HStack,
	VStack,
	Icon,
	useColorModeValue,
	Link,
	Drawer,
	DrawerContent,
	Text,
	useDisclosure,
	BoxProps,
	FlexProps,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList
} from '@chakra-ui/react';
import { FiMenu, FiBell, FiChevronDown } from 'react-icons/fi';
import { FaUserTie, FaUserGraduate, FaBook, FaChalkboardTeacher, FaHome } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import ThemeSwitcher from '../ThemeSwitcher';
import useAuth from '@/hooks/useAuth';
import { ModalPerfil } from '../ModalPerfil';

interface LinkItemProps {
	name: string;
	icon: IconType;
	href: string;
}
const LinkItems: Array<LinkItemProps> = [
	{ name: 'Home', icon: FaHome, href: '/dashboard' },
	{ name: 'Professores', icon: FaUserTie, href: '/dashboard/professores' },
	{ name: 'Alunos', icon: FaUserGraduate, href: '/dashboard/alunos' },
	{ name: 'Materiais', icon: FaBook, href: '/dashboard/materiais' },
	{ name: 'Aulas', icon: FaChalkboardTeacher, href: '/dashboard/aulas' }
];

export default function SidebarWithHeader({ children }: { children: ReactNode }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
			<SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
			<Drawer
				autoFocus={false}
				isOpen={isOpen}
				placement="left"
				onClose={onClose}
				returnFocusOnClose={false}
				onOverlayClick={onClose}
				size="full"
			>
				<DrawerContent>
					<SidebarContent onClose={onClose} />
				</DrawerContent>
			</Drawer>
			{/* mobilenav */}
			<MobileNav menuOpen={onOpen} />
			<Box ml={{ base: 0, md: 60 }} p="4">
				{children}
			</Box>
		</Box>
	);
}

interface SidebarProps extends BoxProps {
	onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
	return (
		<Box
			transition="3s ease"
			bg={useColorModeValue('white', 'gray.900')}
			borderRight="1px"
			borderRightColor={useColorModeValue('gray.200', 'gray.700')}
			w={{ base: 'full', md: 60 }}
			pos="fixed"
			h="full"
			{...rest}
		>
			<Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
				<Flex justifyContent="center" alignItems="center" gap={'10px'}>
					<Avatar
						size={'md'}
						src={'https://firebasestorage.googleapis.com/v0/b/projetcs-storage.appspot.com/o/windfall%2FWhatsApp%20Image%202023-03-29%20at%2014.04.46.jpeg?alt=media&token=1095f376-9566-4936-99c3-5eb9e3c1a541'}
					/>
					<Text fontSize="lg" fontFamily="Poppins" fontWeight="bold">
						Windfall E. I.
					</Text>
				</Flex>
				<CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
			</Flex>
			{LinkItems.map((link) => (
				<NavItem key={link.name} icon={link.icon} href={link.href}>
					{link.name}
				</NavItem>
			))}
		</Box>
	);
};

interface NavItemProps extends FlexProps {
	icon: IconType;
	href: string;
	children: ReactText;
}
const NavItem = ({ icon, children, href, ...rest }: NavItemProps) => {
	return (
		<Link href={href} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
			<Flex
				align="center"
				p="4"
				mx="4"
				borderRadius="lg"
				role="group"
				cursor="pointer"
				_hover={{
					bg: 'cyan.400',
					color: 'white'
				}}
				{...rest}
			>
				{icon && (
					<Icon
						mr="4"
						fontSize="16"
						_groupHover={{
							color: 'white'
						}}
						as={icon}
					/>
				)}
				{children}
			</Flex>
		</Link>
	);
};

interface MobileProps extends FlexProps {
	menuOpen: () => void;
}
const MobileNav = ({ menuOpen, ...rest }: MobileProps) => {
	const {user, logout} = useAuth();
	const handleLogout = () =>{
		logout();
	}

	const {isOpen, onClose, onOpen} = useDisclosure();

	return (
		<Flex
			ml={{ base: 0, md: 60 }}
			px={{ base: 4, md: 4 }}
			height="20"
			alignItems="center"
			bg={useColorModeValue('white', 'gray.900')}
			borderBottomWidth="1px"
			borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
			justifyContent={{ base: 'space-between', md: 'flex-end' }}
			{...rest}
		>
			<IconButton
				display={{ base: 'flex', md: 'none' }}
				onClick={menuOpen}
				variant="outline"
				aria-label="open menu"
				icon={<FiMenu />}
			/>

			<Text display={{ base: 'flex', md: 'none' }} fontSize="1xl" fontFamily="monospace" fontWeight="bold">
				Windfall English
			</Text>

			<HStack spacing={{ base: '0', md: '6' }}>
				<Flex alignItems={'center'}>
					<Menu>
						<MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
							<HStack>
								<Avatar
									size={'sm'}
									src={user?.avatar}
								/>
								<VStack
									display={{ base: 'none', md: 'flex' }}
									alignItems="flex-start"
									spacing="1px"
									ml="2"
								>
									<Text fontSize="sm">{user?.name}</Text>
									<Text fontSize="xs" color="gray.600">
										{user?.userType}
									</Text>
								</VStack>
								<Box display={{ base: 'none', md: 'flex' }}>
									<FiChevronDown />
								</Box>
							</HStack>
						</MenuButton>
						<MenuList
							bg={useColorModeValue('white', 'gray.900')}
							borderColor={useColorModeValue('gray.200', 'gray.700')}
						>
							<MenuItem onClick={onOpen}>Perfil</MenuItem>
							<MenuDivider />
							<MenuItem onClick={handleLogout}>Sign out</MenuItem>
						</MenuList>
					</Menu>
				</Flex>
			</HStack>
			<ModalPerfil isOpen={isOpen} onOpen={onOpen} onClose={onClose} user={user}/>
		</Flex>
	);
};
