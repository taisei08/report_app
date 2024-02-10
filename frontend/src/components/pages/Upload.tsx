import { useState } from 'react';
import Post2 from '../utils/upload/Post2';
import Post from './5';

const Post3 = () => {
  const [filePath, setFilePath] = useState();

  const handleFileData = (sendData) => {
    setFilePath(sendData);
  };
  const fileData = filePath


  return (
    <div>

      <h1>Upload Page</h1>
      {fileData ? (
        <>
          <Post submitFile={fileData}/>
        </>
      ) : (
        // fileData がない場合に <Post /> を表示
        <Post2 handleFileData={handleFileData} />
      )}
    </div>
  );
};

export default Post3;