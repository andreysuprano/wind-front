import SidebarWithHeader from '@/components/SideBar';
import { buscarMaterialPorId } from '@/services/api';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
//@ts-ignore
import useKeypress from 'react-use-keypress';
import { Button, useToast } from '@chakra-ui/react';
import { Document, Page, pdfjs } from 'react-pdf';
import styles from '@/styles/general.module.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function MateriaisId() {
	const toast = useToast();
	const [ denied, setDenied ] = useState(false);
	const [ numPages, setNumPages ] = useState<any>();
	const [ pageNumber, setPageNumber ] = useState(1);

	function onDocumentLoadSuccess(numPages: any) {
		setNumPages(numPages);
		setDenied(false);

	}

	useKeypress([ 'Control', 'Shift', 'Alt', '91' ], () => {
		setDenied(true);
		toast({
			title: `Informação de conteúdo privado!`,
			status: 'warning',
			isClosable: true
		});
	});

	const router = useRouter();
	const { id } = router.query;

	useEffect(() => {
		document.addEventListener('keydown', function(event) {
			console.log(`Key: ${event.key} with keycode ${event.keyCode} has been pressed`);
		});
	}, []);

	useEffect(() => {
		if (id) {
			buscarMaterialPorId(id[0]);
		}
    console.log(pageNumber)
	}, [pageNumber]);

	const goToPrevPage = () =>
		setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

	const goToNextPage = () =>
		setPageNumber(
			pageNumber + 1 >= numPages ? numPages : pageNumber + 1,
		);
  return (
    <div className={styles.wrap}>
      {denied ? (
        <div className={styles.wrapdenied}>
          <Button
            colorScheme="orange"
            onClick={() => {
              setDenied(false)
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
          <div>
            <div className={styles.buttons}>
              <button onClick={goToPrevPage}>Prev</button>
              <button onClick={goToNextPage}>Next</button>
            </div>
            <div>
              <Document
                file="https://firebasestorage.googleapis.com/v0/b/projetcs-storage.appspot.com/o/windfall%2Fmateriais%2FDesign%20sem%20nome.pdf?alt=media&token=d477626a-b333-4bfc-b8d6-292a59ba9383"
                onLoadSuccess={onDocumentLoadSuccess}
                className={styles.pdf}
              >
                <Page pageNumber={pageNumber} />
              </Document>
            </div>
          </div>
        </>
      )}
    </div>
  );	
}
