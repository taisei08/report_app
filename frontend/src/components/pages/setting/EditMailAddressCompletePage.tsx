import { useState, useEffect } from 'react';
import { Typography, Box, makeStyles, Fade } from '@material-ui/core';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

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

const EditMailAddressCompletePage: React.FC = () => {
  const classes = useStyles();
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const handleBeforeUnload = () => {
    Cookies.remove('_new_email');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    const newUid = Cookies.get("_new_email");
    if (newUid) {
    Cookies.set("_uid", newUid, { expires: 1 });
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleNavigate = () => {
    handleBeforeUnload();
    navigate('/');
  };

  return (
    <Box className={classes.root}>
      <Fade in={isVisible} timeout={500}>
        <Box>
          <Typography variant="h4" className={classes.text} style={{fontWeight: 'bold'}} gutterBottom>
            メールアドレスの変更が完了しました
          </Typography>
          <Typography variant="body1" gutterBottom>
            今後は新しいメールアドレスでログインできます
          </Typography>
          <Button variant="contained" color="primary" className={classes.button} onClick={handleNavigate}>
            ホームヘ
          </Button>
        </Box>
      </Fade>
    </Box>
  );
};

export default EditMailAddressCompletePage;