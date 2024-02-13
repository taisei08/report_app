import { Avatar, Typography, makeStyles, Box, IconButton } from '@material-ui/core';
import ExpandText from './ExpandText';
import { User } from 'interfaces';

interface UserProfileProps {
  userData: User;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    margin: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    margin: theme.spacing(2),
  },
  userName: {
    fontWeight: 'bold',
  },
  accountName: {
    fontWeight: 'bold',
  },
  userInfo: {
    margin: theme.spacing(1),
  },
  profileStatement: {
    color: theme.palette.text.secondary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

const UserProfile: React.FC<UserProfileProps> = ({ userData }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Avatar
        className={classes.avatar}
        alt={userData.userName}
        src={userData.iconPath.url}
      />
      <Typography variant="body1" className={classes.userName}>
        @{userData.userName}
      </Typography>
      {userData.accountName && (
        <Typography variant="h5" className={`${classes.userInfo} ${classes.accountName}`}>
          {userData.accountName}
        </Typography>
      )}
      {userData.school && (
        <Typography variant="body1" className={classes.userInfo}>
          学校名: {userData.school}
        </Typography>
      )}
      {userData.facultyDepartment && (
        <Typography variant="body1" className={classes.userInfo}>
          専攻: {userData.facultyDepartment}
        </Typography>
      )}
      <ExpandText statement={userData.profileStatement} length={50}/>
    </Box>
  );
};

export default UserProfile;