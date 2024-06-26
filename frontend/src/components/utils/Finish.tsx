import { useState, useEffect } from 'react';
import { Typography, Box, makeStyles, Fade } from '@material-ui/core';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Props {
  mainText: string;
  subText: string;
  buttonText?: string;
  buttonUrl?: string;
}

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

const Finish: React.FC<Props> = ({ mainText, subText, buttonText, buttonUrl }) => {
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
    if (buttonUrl) {
      navigate(buttonUrl);
    }
  };

  return (
    <Box className={classes.root}>
      <Fade in={isVisible} timeout={500}>
        <Box>
          <Typography variant="h4" className={classes.text} style={{fontWeight: 'bold'}} gutterBottom>
            {mainText}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {subText}
          </Typography>
          {buttonText && buttonUrl && (
            <Button variant="contained" color="primary" className={classes.button} onClick={handleNavigate}>
              {buttonText}
            </Button>
          )}
        </Box>
      </Fade>
    </Box>
  );
};

export default Finish;