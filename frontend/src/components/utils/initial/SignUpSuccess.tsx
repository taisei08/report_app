import { useState, useEffect } from 'react';
import { Typography, Box, makeStyles, Fade, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '5rem',
    paddingBottom: theme.spacing(8),
    textAlign: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 'clamp(20px, 6vw, 36px)',
    lineHeight: 1.5,
  },
  button: {
    marginTop: theme.spacing(4),
  },
}));

interface Props {
  onNext: () => void;
}

const SignUpSuccess: React.FC<Props> = ({ onNext }) => {
  const classes = useStyles();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = () => {
    onNext();
  };

  return (
    <Box className={classes.root}>
      <Fade in={isVisible} timeout={500}>
        <Box>
          <Typography variant="h4" className={classes.text} style={{fontWeight: 'bold'}} gutterBottom>
            登録が成功しました
          </Typography>
          <Typography variant="body1" gutterBottom>
            ボタンをクリックしてプロフィールを設定してください
          </Typography>
          <Button variant="contained" color="primary" className={classes.button} onClick={handleNavigate}>
            プロフィールの設定
          </Button>
        </Box>
      </Fade>
    </Box>
  );
};

export default SignUpSuccess;