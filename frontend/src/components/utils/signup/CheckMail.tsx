import { useState, useEffect } from 'react';
import { Typography, Box, makeStyles, Fade } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end', // 下部に配置する
    minHeight: '50vh', // コンテナの高さを画面の高さに設定
    paddingBottom: theme.spacing(8), // 下部の余白を追加
    textAlign: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 'clamp(20px, 6vw, 36px)', // レスポンシブフォントサイズ
    lineHeight: 1.5,
  },
}));

const CheckMail = () => {
  const classes = useStyles();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // コンポーネントがマウントされた後、1秒後にフェードインを開始
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);

    return () => clearTimeout(timer); // クリーンアップ関数でタイマーをクリア
  }, []);

  return (
    <Box className={classes.root}>
      <Fade in={isVisible} timeout={500}>
        <Typography variant="h4" className={classes.text} gutterBottom>
          ご登録のメールアドレスをご確認ください
        </Typography>
      </Fade>
    </Box>
  );
};

export default CheckMail;
