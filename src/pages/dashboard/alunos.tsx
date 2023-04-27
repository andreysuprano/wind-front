import SidebarWithHeader from "@/components/SideBar";
import { adicionarAluno, listarAlunos, updateAluno } from "@/services/api";
import {
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  Box,
  IconButton,
  Stack,
  Skeleton,
  useToast,
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaPlus, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { client } from "@/services/client";
import userAuth from "@/hooks/useAuth";

type AlunosType = {
  nome: string;
  sobrenome: string;
  cpf: string;
  email: string;
  id: string;
  senha: string;
  user: {
    ativo: true;
    avatarUrl: string;
  };
  userId: string;
};

type AlunosTypePost = {
  nome: string;
  sobrenome: string;
  cpf: string;
  email: string;
  id: string;
  senha: string;
  ativo: boolean;
  professorId: string | undefined;
};

type AlunosNormalizadoType = {
  nome: string;
  sobrenome: string;
  cpf: string;
  email: string;
  id: string;
  senha: string;
  ativo: true;
  avatarUrl: string;
  userId: string;
};

export default function Alunos() {
  const { user } = userAuth();

  const {
    formState: { errors },
    control,
    handleSubmit,
    watch,
    setValue,
  } = useForm<AlunosTypePost>({
    defaultValues: {
      nome: "",
      sobrenome: "",
      cpf: "",
      email: "",
      senha: "",
      ativo: true,
      professorId: user?.sub,
    },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [alunos, setAlunos] = useState<AlunosType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const toast = useToast();
  const [editingAlunoCPF, setEditingAlunoCPF] = useState("");
  const editingAluno = useMemo(
    () => alunos.find((aluno) => aluno.cpf === editingAlunoCPF),
    [alunos, editingAlunoCPF]
  );

  async function buscarAlunos() {
    setLoading(true);
    listarAlunos()
      .then((response) => {
        setLoading(false);
        setAlunos(response.data);
      })
      .catch((error) => {
        if (!error.response) return;
        setLoading(false);
        toast({
          title: `Não foi possível listar alunos.`,
          status: "error",
          isClosable: true,
        });
      });
  }

  useEffect(() => {
    buscarAlunos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (editingAluno) {
      setValue("nome", editingAluno.nome);
      setValue("sobrenome", editingAluno.sobrenome);
      setValue("cpf", editingAluno.cpf);
      setValue("email", editingAluno.email);
    } else {
      setValue("nome", "");
      setValue("sobrenome", "");
      setValue("cpf", "");
      setValue("email", "");
    }
  }, [editingAluno, setValue]);

  const handleAddAluno: SubmitHandler<any> = (formData) => {
    formData.professorId = user?.sub;
    setLoading(true);
    adicionarAluno(formData)
      .then(() => {
        onClose();
        setLoading(false);
        window.location.reload();
        toast({
          title: `Aluno(a) adicionado com sucesso.`,
          status: "success",
          isClosable: true,
        });
      })
      .catch((error) => {
        setLoading(false);
        if (!error.response) return;
        toast({
          title: `Não foi possível adicionar aluno(a).`,
          status: "error",
          isClosable: true,
        });
      });
  };

  const handleUpdateAluno: SubmitHandler<any> = (formData) => {
    setLoading(true);
    updateAluno(formData)
      .then(() => {
        onClose();
        setEditingAlunoCPF("");
        setLoading(false);
        window.location.reload();
        toast({
          title: `Aluno(a) editado com sucesso.`,
          status: "success",
          isClosable: true,
        });
      })
      .catch((error) => {
        setLoading(false);
        if (!error.response) return;
        toast({
          title: `Não foi possível editar aluno(a).`,
          status: "error",
          isClosable: true,
        });
      });
  };

  const deleteUser = (id: string, value: boolean) => {
    setLoading(true);
    client
      .post(`/v1/aluno/${id}/block/${value}`)
      .then(() => {
        window.location.reload();
        setLoading(false);
        toast({
          title: `Aluno(a) desabilitado.`,
          status: "success",
          isClosable: true,
        });
      })
      .catch((error: any) => {
        if (!error.response) return;
        setLoading(false);
        toast({
          title: `Não foi possível desabilitar aluno.`,
          status: "error",
          isClosable: true,
        });
      });
  };

  return (
    <SidebarWithHeader>
      <Flex
        flexDir={"column"}
        gap={"20px"}
        backgroundColor={"#FFF"}
        padding={"20px"}
        borderRadius={"10px"}
        marginBottom={"20px"}
      >
        <Flex>
          <Breadcrumb spacing="8px" separator={">"}>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink href="">Alunos</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Flex>
        <Flex>
          <InputGroup gap={"20px"}>
            <InputLeftElement pointerEvents="none" color={"gray.300"}>
              <FaSearch />
            </InputLeftElement>
            <Input
              type="tel"
              placeholder="Buscar alunos..."
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <Button
              leftIcon={<FaPlus />}
              colorScheme="teal"
              variant="solid"
              onClick={onOpen}
            >
              Novo
            </Button>
          </InputGroup>
        </Flex>
      </Flex>
      {loading ? (
        <Stack>
          <Skeleton height="20px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="20px" />
        </Stack>
      ) : (
        <TableContainer backgroundColor={"#FFF"} borderRadius="10px">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>CPF</Th>
                <Th>Email</Th>
                <Th>Status</Th>
                <Th> Alunos </Th>
              </Tr>
            </Thead>
            <Tbody>
              {alunos.map((aluno, index) => {
                var alunosNormalizado: AlunosNormalizadoType = {
                  ativo: aluno.user.ativo,
                  avatarUrl: aluno.user.avatarUrl,
                  cpf: aluno.cpf,
                  email: aluno.email,
                  id: aluno.id,
                  nome: aluno.nome,
                  senha: aluno.senha,
                  sobrenome: aluno.sobrenome,
                  userId: aluno.userId,
                };
                // @ts-ignore
                if (
                  Object.values(alunosNormalizado)
                    .map((item) =>
                      typeof item === "boolean"
                        ? item
                          ? "ativo"
                          : "desabilitado"
                        : item
                    )
                    .reduce((a, b) => (b = a + " " + b))
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                  return (
                    <Tr key={index}>
                      <Td>
                        <Flex gap={"10px"} alignItems={"center"}>
                          <Avatar
                            size="sm"
                            name={aluno.nome + " " + aluno.sobrenome}
                            src={aluno.user.avatarUrl}
                          />
                          {aluno.nome + " " + aluno.sobrenome}
                        </Flex>
                      </Td>
                      <Td>{aluno.cpf}</Td>
                      <Td>{aluno.email}</Td>
                      <Td>
                        {aluno.user.ativo ? (
                          <Badge colorScheme="green">ATIVO</Badge>
                        ) : (
                          <Badge colorScheme="red">DESABILITADO</Badge>
                        )}
                      </Td>
                      <Td>
                        <Flex gap={"10px"}>
                          <IconButton
                            icon={<FaPencilAlt />}
                            colorScheme="yellow"
                            variant="solid"
                            aria-label=""
                            onClick={() => {
                              setEditingAlunoCPF(aluno.cpf);
                              onOpen();
                            }}
                          />
                          <IconButton
                            icon={<FaTrashAlt />}
                            colorScheme="red"
                            variant="solid"
                            aria-label=""
                            onClick={() =>
                              deleteUser(aluno.userId, !aluno.user.ativo)
                            }
                          />
                        </Flex>
                      </Td>
                    </Tr>
                  );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      <Modal
        onClose={() => {
          onClose();
          setEditingAlunoCPF("");
        }}
        isOpen={isOpen}
        isCentered
      >
        <ModalOverlay />
        <form
          onSubmit={handleSubmit(
            editingAluno ? handleUpdateAluno : handleAddAluno
          )}
        >
          <ModalContent>
            <ModalHeader>{`${
              editingAluno ? "Editar" : "Adicionar novo"
            } aluno(a)`}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex flexDir={"column"} gap={"15px"}>
                <Flex gap={"15px"}>
                  <Controller
                    name="nome"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Box>
                        <Text>Nome</Text>
                        <Input placeholder="Nome" required={true} {...field} />
                      </Box>
                    )}
                  />
                  <Controller
                    name="sobrenome"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Box>
                        <Text>Sobrenome</Text>
                        <Input
                          placeholder="Sobrenome"
                          required={true}
                          {...field}
                        />
                      </Box>
                    )}
                  />
                </Flex>
                <Controller
                  name="cpf"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Box>
                      <Text>Cpf</Text>
                      <Input placeholder="Cpf" required={true} {...field} />
                    </Box>
                  )}
                />

                <Controller
                  name="email"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Box>
                      <Text>Email</Text>
                      <Input placeholder="Email" required={true} {...field} />
                    </Box>
                  )}
                />
                <Controller
                  name="senha"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Box>
                      <Text>Senha</Text>
                      <Input
                        placeholder="Senha"
                        required={true}
                        type="password"
                        {...field}
                      />
                    </Box>
                  )}
                />
              </Flex>
            </ModalBody>
            <ModalFooter gap={"15px"}>
              <Button
                onClick={() => {
                  onClose();
                  setEditingAlunoCPF("");
                }}
              >
                Fechar
              </Button>
              <Button variant={"solid"} background={"green.200"} type="submit">
                Salvar
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </SidebarWithHeader>
  );
}
