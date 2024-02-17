import { useState, useEffect } from 'react';
import { Typography, Box, makeStyles, Fade } from '@material-ui/core';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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

const NotFound: React.FC = () => {
  const classes = useStyles();
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = () => {
    navigate('/');
  };

  return (
    <Box className={classes.root}>
      <Fade in={isVisible} timeout={500}>
        <Box>
          <Typography variant="h4" className={classes.text} style={{fontWeight: 'bold'}} gutterBottom>
            このページは表示できません
          </Typography>
          <Typography variant="body1" gutterBottom>
            お探しのページは利用できないか、移動・削除された可能性があります
          </Typography>
          <Button variant="contained" color="primary" className={classes.button} onClick={handleNavigate}>
            ホームヘ
          </Button>
        </Box>
      </Fade>
    </Box>
  );
};

export default NotFound;