import { useState } from 'react';
import { Box, Typography } from '@material-ui/core';
import { blue, grey } from '@material-ui/core/colors';
import AlertMessage from 'components/utils/error/AlertMessage';
import { useFormState } from 'components/utils/error/useFormState';

interface Props {
  handleFileData: (file: File) => void;
}

const ChooseFile: React.FC<Props> = ({ handleFileData }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [formState, setFormState] = useFormState();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      handleFileData(droppedFile);
    } else {
      setFormState({ alertSeverity: 'error', alertMessageOpen: true,
      alertMessage: 'PDFファイル以外はアップロードできません'});
    }
  };
  

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      handleFileData(selectedFile);
    }
  };
  

  return (
    <Box
      style={{
        width: 'calc(min(600px, 90vw))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '20rem',
        border: `2px dashed ${isDragging ? blue[500] : grey[500]}`,
        borderRadius: 10,
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <Typography variant="h5" style={{  fontWeight: 'bold' }}>
        ファイルをドラッグ＆ドロップ
      </Typography>
      <Typography variant="body2" color="textSecondary" style={{ marginTop: '1rem' }}>
        または
      </Typography>
      <Box mt={1}>
        <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
          <Typography variant="body1" color="primary" component="span">
            ここをクリックしてファイルを選択
          </Typography>
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileInputChange}
          accept=".pdf"
          style={{ display: 'none' }}
        />
      </Box>
      {formState.alertSeverity && (
        <AlertMessage
          open={formState.alertMessageOpen}
          setOpen={(isOpen: boolean) => setFormState({ alertMessageOpen: isOpen })}
          severity={formState.alertSeverity}
          message={formState.alertMessage}
        />
      )}
    </Box>
  );
};

export default ChooseFile;
