import { Button, ButtonProps, Flex, useColorMode } from '@chakra-ui/react';
import { BsSun, BsMoonStarsFill } from 'react-icons/bs';

export default function ThemeSwitcher(props: ButtonProps) {
	const { colorMode, toggleColorMode } = useColorMode();
	return (
		<Button aria-label="Toggle Color Mode" onClick={toggleColorMode} _focus={{ boxShadow: 'none' }} {...props}>
			{colorMode === 'light' ? <BsMoonStarsFill /> : <BsSun />}
		</Button>
	);
}
