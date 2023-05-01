import { IUser } from "@/contexts/authContext";
import { updateUsuario } from "@/services/api";

import {
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  Button,
  Stack,
  FormControl,
  FormLabel,
  Center,
  Avatar,
  Heading,
  AvatarBadge,
  IconButton,
  Flex,
  useToast,
} from "@chakra-ui/react";

import { FaPencilAlt } from "react-icons/fa";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { client } from "@/services/client";
import { useEffect, useMemo, useState } from "react";

type ModalPerfil = {
  onClose: () => void;
  isOpen: boolean;
  onOpen: () => void;
  user: IUser | undefined;
};

type UserypePost = {
  avatar: string;
  name: string;
  email: string;
  senha: string;
};

export const ModalPerfil = ({ onOpen, isOpen, onClose, user }: ModalPerfil) => {
  const {
    formState: { errors },
    control,
    handleSubmit,
    setValue,
    watch,
  } = useForm<UserypePost>({
    defaultValues: {
      avatar: "",
      name: "",
      email: "",
      senha: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [editingUserbyEmail, setEditingUserbyEmail] = useState("");

  const editingUser = useMemo(() => {
    if (Array.isArray(user)) {
      return user.find((usuario: any) => usuario.email === editingUserbyEmail);
    } else {
      return null;
    }
  }, [user, editingUserbyEmail]);

  useEffect(() => {
    if (editingUser) {
      setValue("avatar", editingUser.avatar);
      setValue("name", editingUser.name);
      setValue("email", editingUser.email);
      setValue("senha", editingUser.senha);
    } else {
      setValue("avatar", "");
      setValue("name", user?.name || "");
      setValue("email", user?.username || "");
      setValue("senha", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingUser, setValue]);

  const handleUpdateUsuario: SubmitHandler<any> = (formData) => {
    setLoading(true);
    updateUsuario(formData)
      .then(() => {
        onClose();
        setEditingUserbyEmail("");
        setLoading(false);
        toast({
          title: `Usuário editado com sucesso.`,
          status: "success",
          isClosable: true,
        });
      })
      .catch((error) => {
        setLoading(false);
        if (!error.response) return;
        toast({
          title: `Não foi possível editar usuário.`,
          status: "error",
          isClosable: true,
        });
      });
  };
  return (
    <Modal
      onClose={() => {
        onClose();
        setEditingUserbyEmail("");
      }}
      isOpen={isOpen}
      isCentered
    >
      <ModalOverlay />
      <form onSubmit={handleSubmit(handleUpdateUsuario)}>
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Heading
              lineHeight={1.1}
              fontSize={{ base: "2xl", sm: "3xl" }}
              marginBottom={"20px"}
            >
              Meu Perfil
            </Heading>
            <FormControl id="userName">
              <FormLabel>Avatar</FormLabel>
              <Flex marginBottom={"20px"}>
                <Avatar size="xl" src={user?.avatar}>
                  <AvatarBadge
                    as={IconButton}
                    size="sm"
                    rounded="full"
                    top="-10px"
                    colorScheme="red"
                    aria-label="remove Image"
                    icon={<FaPencilAlt />}
                  />
                </Avatar>
              </Flex>
            </FormControl>
            <FormControl id="userName" isRequired>
              <FormLabel>Nome</FormLabel>

              <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    placeholder="Nome"
                    _placeholder={{ color: "gray.500" }}
                    type="text"
                    {...field}
                  />
                )}
              />

              {/* <Input
                placeholder="Nome"
                _placeholder={{ color: "gray.500" }}
                type="text"
                value={user?.name.split(" ")[0]}
              /> */}
            </FormControl>
            {/* <FormControl id="lastName" isRequired>
              <FormLabel>Sobrenome</FormLabel>
              <Input
                placeholder="Sobrenome"
                _placeholder={{ color: "gray.500" }}
                type="text"
                value={user?.name.split(" ")[1]}
              />
            </FormControl> */}
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>

              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    placeholder="your-email@example.com"
                    _placeholder={{ color: "gray.500" }}
                    type="email"
                    {...field}
                  />
                )}
              />

              {/* 
              <Input
                placeholder="your-email@example.com"
                _placeholder={{ color: "gray.500" }}
                type="email"
                value={user?.username}
              /> */}
            </FormControl>
            <Flex gap={"15px"}>
              <FormControl id="password" isRequired>
                <FormLabel>Senha</FormLabel>
                <Input
                  placeholder="*******"
                  _placeholder={{ color: "gray.500" }}
                  type="password"
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Repita a senha</FormLabel>
                <Input
                  placeholder="*******"
                  _placeholder={{ color: "gray.500" }}
                  type="password"
                />
              </FormControl>
            </Flex>
            <Stack
              spacing={6}
              direction={["column", "row"]}
              marginTop={"20px"}
              marginBottom={"20px"}
            >
              <Button
                bg={"red.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "red.500",
                }}
                onClick={() => {
                  onClose();
                  setEditingUserbyEmail("");
                }}
              >
                Cancelar
              </Button>
              <Button
                bg={"blue.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "blue.500",
                }}
                type="submit"
              >
                Salvar
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </form>
    </Modal>
  );
};
