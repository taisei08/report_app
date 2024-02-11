import { useState } from 'react';
import { Box, Typography } from '@material-ui/core';
import ChooseFile from '../utils/upload/ChooseFile';
import PostDetail from '../utils/upload/PostDetail';
import { Styles } from 'lib/styles';

const UploadPage = () => {
  const classes = Styles()
  const [filePath, setFilePath] = useState<File>();

  const handleFileData = (sendData: File) => {
    setFilePath(sendData);
  };

  return (
    <Box>
      <Typography variant="h4" style={{marginBottom: '3rem', textAlign: 'center', fontWeight: 'bold'}}>新しい投稿</Typography>
      {filePath ? (
        <PostDetail submitFile={filePath}/>
      ) : (
        <ChooseFile handleFileData={handleFileData} />
      )}
    </Box>
  );
};

export default UploadPage;