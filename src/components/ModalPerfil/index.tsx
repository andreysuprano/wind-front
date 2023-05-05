import { IUser } from "@/contexts/authContext";
import { sendToken, updateUsuario } from "@/services/api";
import { v4 as uuidv4 } from 'uuid';

import {
  Input,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  Button,
  Stack,
  FormControl,
  FormLabel,
  Avatar,
  Heading,
  AvatarBadge,
  IconButton,
  Flex,
  useToast,
  Progress,
  Link,
  Skeleton,
  Box,
  SkeletonCircle,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useAuth from "@/hooks/useAuth";
import router from "next/router";
import { toBase64, uploadWithBase64 } from "@/util/imageHelper";

type ModalPerfil = {
  onClose: () => void;
  isOpen: boolean;
  onOpen: () => void;
  user: IUser | undefined;
};

type UserTypePost = {
  avatarUrl: string;
  nome: string;
  sobrenome: string;
  email: string;
};

export const ModalPerfil = ({ onOpen, isOpen, onClose }: ModalPerfil) => {
  const { setUser, user } = useAuth();
  const [imageFile, setImageFile] = useState<File>();
  const [image64, setImage64] = useState('');
  const [link, setLink] = useState('');
  const [downloadURL, setDownloadURL] = useState('');

  const toast = useToast();
  const inputFile = useRef<any>();
  const [loading, setLoading] = useState(false);

  const { handleSubmit, control, setValue, watch } = useForm<UserTypePost>({
    defaultValues: {
      nome: user?.name.split(" ")[0],
      sobrenome: user?.name.split(" ")[1],
      avatarUrl: user?.avatar,
      email: user?.username,
    },
  });

  useEffect(() => {
    if(isOpen){
      setImage64('')
    }
  }, [isOpen]);

  const handleChangeAvatar = () => {
    inputFile.current.click();
  };

  const handleSelectedFile = async (files: any) => {
    if (files && files[0].size < 10000000) {
      setImageFile(files[0]);
      const picBase64 = await toBase64(files[0]);
      setImage64(`${picBase64}`);
    } else {
      toast({
        title: `Foto muito pesada, selecione outra!`,
        status: "warning",
        isClosable: true,
      });
    }
  };

  const handleToken = () => {
    sendToken(user?.username+'')
      .then(() => {
        router.push('/change-password/' + user?.username);
      })
      .catch(() => {
        toast({
          title: `Não foi possível enviar o código.`,
          status: 'error',
          isClosable: true
        });
      });
  }

  const handleUpdateUsuario: SubmitHandler<any> = async (formData) => {
    setLoading(true);
    if(imageFile){
      uploadWithBase64(image64).then((link)=>{
        setTimeout(()=>{
          formData.avatarUrl = link;
          console.log(formData)
          updateUsuario(formData)
            .then(() => {
              setUser({
                avatar: link,
                name: watch("nome") + " " + watch("sobrenome"),
                username: watch("email"),
                userType: user?.userType,
                sub: user?.sub,
              });
              setLoading(false);
              setImageFile(undefined);
              onClose();
              toast({
                title: `Usuário editado com sucesso.`,
                status: "success",
                isClosable: true,
              });
              inputFile.current.value = null
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
        }, 1000)
      });
    }else{
      updateUsuario(formData)
            .then(() => {
              setLoading(false);
              setImageFile(undefined);
              setUser({
                avatar: `${user?.avatar}`,
                name: watch("nome") + " " + watch("sobrenome"),
                username: watch("email"),
                userType: user?.userType,
                sub: user?.sub,
              });
              onClose();
              toast({
                title: `Usuário editado com sucesso.`,
                status: "success",
                isClosable: true,
              });
              inputFile.current.value = null
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
    }
    
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <form onSubmit={handleSubmit(handleUpdateUsuario)}>
        <ModalContent>
          <ModalBody>
            <Heading
              lineHeight={1.1}
              fontSize={{ base: "2xl", sm: "3xl" }}
              marginBottom={"20px"}
            >
              Meu Perfil
            </Heading>
            {loading ? (
              <Stack>
                <SkeletonCircle size="100px" />

                <Box padding="6" boxShadow="lg" bg="white">
                  <Skeleton height="20px" />
                </Box>
                <Box padding="6" boxShadow="lg" bg="white">
                  <Skeleton height="20px" />
                </Box>
                <Box padding="6" boxShadow="lg" bg="white">
                  <Skeleton height="20px" />
                </Box>
              </Stack>
            ) : (
              <>
                <FormControl id="userName">
                  <FormLabel>Avatar</FormLabel>
                  <Flex marginBottom={"20px"}>
                    <Avatar size="xl" src={image64 ? image64 : user?.avatar }>
                      <AvatarBadge
                        as={IconButton}
                        size="sm"
                        rounded="full"
                        top="-10px"
                        colorScheme="red"
                        aria-label="remove Image"
                        icon={<FaPencilAlt />}
                        onClick={handleChangeAvatar}
                      />
                    </Avatar>
                    <Input
                      display="none"
                      type="file"
                      ref={inputFile}
                      onChange={(files) =>
                        handleSelectedFile(files.target.files)
                      }
                      accept="image/*"
                      multiple={false}
                    />
                    <Controller
                      name="avatarUrl"
                      control={control}
                      defaultValue={downloadURL}
                      render={({ field }) => <input type="hidden" {...field} />}
                    />
                  </Flex>
                </FormControl>

                <Flex gap={"15px"}>
                  <FormControl id="userName" isRequired>
                    <FormLabel>Nome</FormLabel>
                    <Controller
                      name="nome"
                      control={control}
                      rules={{ required: true }}
                      defaultValue={user?.name.split(" ")[0]}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Nome"
                          _placeholder={{ color: "gray.500" }}
                          type="text"
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl id="lastName" isRequired>
                    <FormLabel>Sobrenome</FormLabel>
                    <Controller
                      name="sobrenome"
                      control={control}
                      rules={{ required: true }}
                      defaultValue={user?.name.split(" ")[1]}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Sobrenome"
                          _placeholder={{ color: "gray.500" }}
                          type="text"
                        />
                      )}
                    />
                  </FormControl>
                </Flex>
                <FormControl id="email" isRequired marginBottom="10px">
                  <FormLabel>Email address</FormLabel>
                  <Controller
                    name="email"
                    control={control}
                    rules={{ required: true }}
                    defaultValue={user?.username}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="your-email@example.com"
                        _placeholder={{ color: "gray.500" }}
                        type="email"
                      />
                    )}
                  />
                </FormControl>
              </>
            )}
            <Link onClick={handleToken}>Trocar minha senha.</Link>
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
                  inputFile.current.files = null;
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
