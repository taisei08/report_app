import { useState } from 'react';
import { Typography } from '@material-ui/core';
import ChooseFile from '../utils/upload/ChooseFile';
import PostDetail from '../utils/upload/PostDetail';
import Finish from 'components/utils/Finish';

const UploadPage = () => {
  const [filePath, setFilePath] = useState<File>();
  const [postId, setPostId] = useState<number>();

  const handleFileData = (sendData: File) => {
    setFilePath(sendData);
  };

  if (!postId) {
    return (
      <>
        <Typography variant="h4" style={{marginBottom: '3rem', textAlign: 'center', fontWeight: 'bold'}}>
          新しい投稿
        </Typography>
        {filePath ? (
          <PostDetail submitFile={filePath} setPostId={setPostId}/>
        ) : (
          <ChooseFile handleFileData={handleFileData} />
        )}
      </>
    );
  }

  return (
    <Finish
      mainText="投稿が完了しました"
      subText="ボタンを押して投稿をチェックしましょう"
      buttonText="投稿を見る"
      buttonUrl={`/article/${postId}`}
    />
  );
};

export default UploadPage;