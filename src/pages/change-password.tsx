import { UserContext } from "@/contexts/authContext";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Image,
  useToast,
  InputRightElement,
  InputGroup,
  Avatar,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

export default function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { setUser } = useContext(UserContext);
  const [show, setShow] = useState(false);

  const handleSendToken = () => {
    setIsLoading(true);
  };

  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          align={"center"}
          justify={"center"}
        >
          <Heading fontSize={"2xl"}>Mude sua senha</Heading>
          <FormControl id="codigo">
            <FormLabel>Código enviado por e-mail</FormLabel>
            <Input
              type="codigo"
              placeholder="Insira seu código"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              disabled={isLoading}
            />
          </FormControl>
          <FormControl id="senha">
            <FormLabel>Nova senha</FormLabel>
            <Input
              type={show ? "text" : "password"}
              placeholder="*********"
              value={password}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              disabled={isLoading}
            />
          </FormControl>

          <Stack spacing={6}>
            <Stack
              direction={{ base: "column", sm: "row" }}
              align={"start"}
              justify={"space-between"}
            ></Stack>
            <Button
              colorScheme={"blue"}
              variant={"solid"}
              onClick={handleSendToken}
              isLoading={isLoading}
            >
              Alterar senha
            </Button>
            <Button
              colorScheme="blue"
              variant="outline"
              onClick={() => router.push("/forgot-password")}
            >
              Voltar
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </Stack>
  );
}
