import SidebarWithHeader from "@/components/SideBar";
import { buscarMaterialPorId } from "@/services/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "@/styles/general.module.css";
//@ts-ignore
import useKeypress from "react-use-keypress";
import { Button, useToast } from "@chakra-ui/react";

export default function MateriaisId() {
  const toast = useToast();
  const [denied, setDenied] = useState(false);
  useKeypress(["Control", "Shift", "Alt"], () => {
    setDenied(true);
    toast({
      title: `Informação de conteúdo privado!`,
      status: "warning",
      isClosable: true,
    });
  });

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    document.addEventListener("keydown", function (event) {
      console.log(
        `Key: ${event.key} with keycode ${event.keyCode} has been pressed`
      );
    });
  }, []);

  useEffect(() => {
    if (id) {
      buscarMaterialPorId(id[0]);
    }
  }, []);

  return (
    <div className={styles.wrap}>
      {denied ? (
        <div className={styles.wrapdenied}>
          <Button
            colorScheme="orange"
            onClick={() => {
              window.location.reload();
            }}
          >
            VOLTAR
          </Button>
          <h1 className={styles.message}>Conteúdo privado!!!</h1>
          <h5 className={styles.subMessage}>
            Não divulgue ou utilize de forma inapropriada ou sem consentimento
            pelos criadores do mesmo.
          </h5>
        </div>
      ) : (
        <>
          <iframe
            src="https://www.canva.com/design/DAFfjzE1aJY/view?embed"
            width="100%"
            height={595}
            allowFullScreen={false}
            sandbox="allow-scripts"
          ></iframe>
        </>
      )}
    </div>
  );
}
