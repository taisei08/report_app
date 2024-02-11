import { useState } from 'react';
import { Container, Typography } from '@material-ui/core';
import ChooseFile from '../utils/upload/ChooseFile';
import PostDetail from '../utils/upload/PostDetail';

const UploadPage = () => {
  const [filePath, setFilePath] = useState<File>();

  const handleFileData = (sendData: File) => {
    setFilePath(sendData);
  };

  return (
    <Container>
      <Typography variant="h4" style={{marginBottom: '3rem', textAlign: 'center', fontWeight: 'bold'}}>新しい投稿</Typography>
      {filePath ? (
        <PostDetail submitFile={filePath}/>
      ) : (
        <ChooseFile handleFileData={handleFileData} />
      )}
    </Container>
  );
};

export default UploadPage;