import React, { ReactNode } from "react";
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
  MenuList,
  Img,
} from "@chakra-ui/react";
import { FiMenu, FiChevronDown } from "react-icons/fi";
import {
  FaUserTie,
  FaUserGraduate,
  FaBook,
  FaChalkboardTeacher,
  FaHome,
} from "react-icons/fa";
import { IconType } from "react-icons";
import { ReactText } from "react";
import useAuth from "@/hooks/useAuth";
import { ModalPerfil } from "../ModalPerfil";
import { useRouter } from "next/router";

interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
}


export default function SidebarWithHeader({
  children,
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box 
      minH="100vh" 
      bg={'#254C80'}
      bgGradient='linear(to-r, #254C80, #004edc)'
    >
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
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
  const { user, logout } = useAuth();
  const LinkItems: Array<LinkItemProps> = [
    { name: "Home", icon: FaHome, href: "/dashboard" },
    { name: "Professores", icon: FaUserTie, href: "/dashboard/professores" },
    { name: "Alunos", icon: FaUserGraduate, href: "/dashboard/alunos" },
    { name: "Books", icon: FaBook, href: "/dashboard/books" },
    //{ name: "Homeworks", icon: FaBook, href: "/dashboard/homeworks" },
    { name: "Aulas", icon: FaChalkboardTeacher, href: "/dashboard/aulas" },
  ];
  
  const LinkItemsProfessor: Array<LinkItemProps> = [
    { name: "Home", icon: FaHome, href: "/dashboard" },
    { name: "Alunos", icon: FaUserGraduate, href: "/dashboard/alunos" },
    { name: "Books", icon: FaBook, href: "/dashboard/books" },
    {
      name: "Aulas",
      icon: FaChalkboardTeacher,
      href: `/dashboard/aulas-professor?id=${user?.username}`,
    },
  ];
  return (
    <Box
      transition="3s ease"
      bg="#171A1D"
      borderRight="1px"
      borderRightColor="gray.700"
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Flex justifyContent="center" alignItems="center" gap={"10px"}>
          <Img src={'https://firebasestorage.googleapis.com/v0/b/projetcs-storage.appspot.com/o/windfall%2FWhatsApp%20Image%202023-03-29%20at%2014.04.46.jpeg?alt=media&token=1095f376-9566-4936-99c3-5eb9e3c1a541'} width="50px" borderRadius="10px" boxShadow="lg" />
          <Text fontSize="lg" fontFamily="Poppins" fontWeight="bold" color="#DDD">
            Windfall
          </Text>
        </Flex>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} 
          color="white"
        />
      </Flex>
      {user?.userType == "PROFESSOR"
        ? LinkItemsProfessor.map((link) => (
            <NavItem key={link.name} icon={link.icon} href={link.href}>
              {link.name}
            </NavItem>
          ))
        : LinkItems.map((link) => (
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
  const router = useRouter();
  return (
    <Link
      onClick={()=>{router.push(href)}}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        color="#DDD"
        cursor="pointer"
        _hover={{
          bg: "#254C80",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
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
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg="#171A1D"
      borderBottomWidth="1px"
      borderBottomColor="gray.700"
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={menuOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu color="white"/>}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
        color="white"
      >
        Windfall
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar size={"sm"} src={user?.avatar} />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm" color="#DDD">{user?.name}</Text>
                  <Text fontSize="xs" color="#DDD">
                    {user?.userType}
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown color="#DDD"/>
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem onClick={onOpen}>Perfil</MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
      <ModalPerfil
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        user={user}
      />
    </Flex>
  );
};
