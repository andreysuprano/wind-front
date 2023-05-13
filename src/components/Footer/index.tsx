import {
	Avatar,
	Box,
	chakra,
	Container,
	Flex,
	Img,
	Link,
	Stack,
	Text,
	useBreakpointValue,
	useColorModeValue,
	VisuallyHidden
} from '@chakra-ui/react';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { ReactNode } from 'react';

const LOGO_WINDFALL =
	'https://firebasestorage.googleapis.com/v0/b/projetcs-storage.appspot.com/o/windfall%2FWhatsApp%20Image%202023-03-29%20at%2014.04.46.jpeg?alt=media&token=1095f376-9566-4936-99c3-5eb9e3c1a541';

const Logo = (props: any) => {
	return (
		<Flex justify={{ base: 'center', md: 'start' }} alignItems={'center'} gap={'10px'}>
			<Img src={LOGO_WINDFALL} width="40px" borderRadius="10px" boxShadow="lg" />
			<Text
				textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
				fontFamily={'heading'}
				color={useColorModeValue('gray.900', 'white')}
				fontWeight={900}
			>
				Windfall Language
			</Text>
		</Flex>
	);
};

const SocialButton = ({ children, label, href }: { children: ReactNode; label: string; href: string }) => {
	return (
		<chakra.button
			bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
			rounded={'full'}
			w={8}
			h={8}
			cursor={'pointer'}
			as={'a'}
			href={href}
			display={'inline-flex'}
			alignItems={'center'}
			justifyContent={'center'}
			transition={'background 0.3s ease'}
			_hover={{
				bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200')
			}}
		>
			<VisuallyHidden>{label}</VisuallyHidden>
			{children}
		</chakra.button>
	);
};

export default function SmallCentered() {
	return (
		<Box bg={useColorModeValue('gray.50', 'gray.900')} color={useColorModeValue('gray.700', 'gray.200')}>
			<Container as={Stack} maxW={'6xl'} py={4} spacing={4} justify={'center'} align={'center'}>
				<Logo />
				<Stack direction={'row'} spacing={6}>
					<Link href={'#'}>Home</Link>
					<Link href={'#'}>Quem Somos?</Link>
					<Link href={'#'}>Contato</Link>
				</Stack>
			</Container>

			<Box borderTopWidth={1} borderStyle={'solid'} borderColor={useColorModeValue('gray.200', 'gray.700')}>
				<Container
					as={Stack}
					maxW={'6xl'}
					py={4}
					direction={{ base: 'column', md: 'row' }}
					spacing={4}
					justify={{ base: 'center', md: 'space-between' }}
					align={{ base: 'center', md: 'center' }}
				>
					<Text>© 2023 Windfall Language Institute. Todos os direitos reservados.</Text>
					<Stack direction={'row'} spacing={6}>
						{/* <SocialButton label={'Twitter'} href={'#'}>
							<FaTwitter />
						</SocialButton> */}
						<SocialButton label={'YouTube'} href={'#'}>
							<FaYoutube />
						</SocialButton>
						<SocialButton label={'Instagram'} href={'#'}>
							<FaInstagram />
						</SocialButton>
					</Stack>
				</Container>
			</Box>
		</Box>
	);
}
