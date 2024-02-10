import React, { useState } from 'react'; // Reactをインポート

import { Box, Typography } from '@material-ui/core';
import { blue, grey } from '@material-ui/core/colors'; // 青の色を追加

const Post2 = (props: any) => {
  const [isDragging, setIsDragging] = useState(false); // useStateフックを使用してisDragging状態を管理

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false); // ドロップされたので、isDraggingをfalseに設定
    const droppedFile = e.dataTransfer.files[0];
    props.handleFileData(droppedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true); // ドラッグ中なので、isDraggingをtrueに設定
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false); // ドラッグが領域外に出たので、isDraggingをfalseに設定
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files[0];
    props.handleFileData(selectedFile);
  };

  return (
    <Box
      display='flex'
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave} // ドラッグが領域外に出たときにイベントをトリガーする
      style={{
        display: 'flex',
        paddingTop: '10rem',
        paddingBottom: '10rem',
        justifyContent: 'center',
        alignContent: 'center',
        width: '90vw',
        border: `2px dashed ${isDragging ? blue[500] : grey[500]}`, // ドラッグ中は青、それ以外はグレーの枠を設定
        borderRadius: 10, // スタイリッシュな枠の角丸を増やす
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // 影を追加
      }}
    >
      <Box style={{justifyItems: 'center'}}>
      <Typography variant="h5" style={{fontWeight: 'bold'}}>
        ファイルをドラッグ&ドロップ
      </Typography>
      <input
        type="file"
        onChange={handleFileInputChange}
        accept=".pdf,.doc,.docs"
        style={{ display: 'none' ,justifyContent: 'center'}}
      />
      <Typography variant="body2" color="textSecondary">
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
      </Box>
    </Box>
  );
};

export default Post2;

