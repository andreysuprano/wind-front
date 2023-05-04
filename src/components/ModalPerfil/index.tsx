import { IUser } from "@/contexts/authContext";
import { sendToken, updateUsuario } from "@/services/api";

import {
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
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
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/config";
import { FaPencilAlt } from "react-icons/fa";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useAuth from "@/hooks/useAuth";
import router from "next/router";

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
  const [downloadURL, setDownloadURL] = useState(user?.avatar);
  const [isUploading, setIsUploading] = useState(false);
  const [progressUpload, setProgressUpload] = useState(0);
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
    if (imageFile) {
      handleUploadFile();
    }
  }, [imageFile]);

  const handleChangeAvatar = () => {
    inputFile.current.click();
  };

  const handleSelectedFile = (files: any) => {
    if (files && files[0].size < 10000000) {
      setImageFile(files[0]);
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

  const handleUploadFile = () => {
    if (imageFile) {
      const name = user?.sub;
      const storageRef = ref(storage, `windfall/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgressUpload(progress); // to show progress upload
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          toast({
            title: error + "",
            status: "warning",
            isClosable: true,
          });
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setDownloadURL(url);
            setValue("avatarUrl", url);
          });
        }
      );
    } else {
      toast({
        title: "Arquivo não encontrado!",
        status: "warning",
        isClosable: true,
      });
    }
  };

  const handleUpdateUsuario: SubmitHandler<any> = (formData) => {
    setLoading(true);
    updateUsuario(formData)
      .then(() => {
        onClose();
        setLoading(false);
        setUser({
          avatar: watch("avatarUrl"),
          name: watch("nome") + " " + watch("sobrenome"),
          username: watch("email"),
          userType: user?.userType,
          sub: user?.sub,
        });
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
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
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
                  <Progress
                    colorScheme="green"
                    size="sm"
                    value={progressUpload}
                    marginTop={"10px"}
                    marginBottom={"10px"}
                  />

                  <FormLabel>Avatar</FormLabel>
                  <Flex marginBottom={"20px"}>
                    <Avatar size="xl" src={downloadURL}>
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
                disabled={isUploading}
                onClick={() => {
                  onClose();
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
                disabled={isUploading}
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
