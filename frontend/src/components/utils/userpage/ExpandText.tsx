import { useState } from 'react';
import { IconButton, Typography, makeStyles } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  userInfo: {
    margin: theme.spacing(1),
  },
  profileStatement: {
    color: theme.palette.text.secondary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

interface Props {
  statement: string;
}

const ExpandText: React.FC<Props> = ({ statement }) => {
  const classes = useStyles();

  const [showFullProfile, setShowFullProfile] = useState<boolean>(false);

  const toggleShowFullProfile = () => {
    setShowFullProfile(!showFullProfile);
  };

  const renderProfileStatement = () => {
    if (showFullProfile || statement.length <= 50) {
      return statement;
    } else {
      return `${statement.slice(0, 50)}...`;
    }
  };

  return (
    <Typography variant="body1" className={`${classes.userInfo} ${classes.profileStatement}`}>
      {renderProfileStatement()}
      {statement.length > 50 && !showFullProfile && (
        <IconButton size="small" onClick={toggleShowFullProfile}>
          <ExpandMoreIcon />
        </IconButton>
      )}
    </Typography>
  );
};

export default ExpandText;
