import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Typography, makeStyles, IconButton, Box } from '@material-ui/core';
import { NavigateBefore, NavigateNext, ZoomIn, ZoomOut } from '@material-ui/icons';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`; 

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: '650px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '10px',
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      width: '90vw',
      height: '600px'
    },
  },
  pdfContainer: {
    justifyContent: 'center',
    maxWidth: '650px',
    height: '700px',
    overflow: 'auto',
    touchAction: 'manipulation',
    [theme.breakpoints.down('sm')]: {
      width: '90vw'
    },
  },
  pageInfo: {
    color: '#fff',
    margin: '0.5rem 0',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1rem',
  },
}));

interface PdfViewerProps {
  fileData: string;
}

const PdfViewer: React.FC<PdfViewerProps> = (props) => {
  const classes = useStyles();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  const handleZoom = (newScale: number) => {
    setScale(newScale);
  };

  const renderPage = (pageNumber: number) => (
    <Page
      key={`page_${pageNumber}`}
      pageNumber={pageNumber}
      scale={scale}
    />
  );

  return (
    <Box className={classes.container}>
      <Box className={classes.pdfContainer}>
        <Document
          file={props.fileData}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {renderPage(pageNumber)}
        </Document>
      </Box>
      <Typography variant="body1" className={classes.pageInfo}>
        Page {pageNumber} of {numPages}
      </Typography>
      <Box className={classes.buttonGroup}>
        <IconButton
          onClick={() => handlePageChange(Math.max(1, pageNumber - 1))}
          disabled={pageNumber <= 1}
          style={{color: 'white'}}
        >
          <NavigateBefore />
        </IconButton>
        <IconButton
          onClick={() => handlePageChange(Math.min(pageNumber + 1, numPages || 1))}
          disabled={pageNumber >= (numPages || 1)}
          style={{color: 'white'}}
        >
          <NavigateNext />
        </IconButton>
        <IconButton 
          onClick={() => handleZoom(Math.max(0.8, scale - 0.2))} 
          disabled={scale <= 0.8} 
          style={{color: 'white'}}
        >
          <ZoomOut />
        </IconButton>
        <IconButton 
          onClick={() => handleZoom(Math.min(2, scale + 0.2))} 
          disabled={scale >= 2} 
          style={{color: 'white'}}
        >
          <ZoomIn />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PdfViewer;
