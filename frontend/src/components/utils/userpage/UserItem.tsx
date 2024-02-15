import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Card, CardContent, Typography } from "@material-ui/core";
import UserInfo from "../posts/post_item/UserInfo";
import { User } from 'interfaces';

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2),
  },
  userInfoLink: {
    textDecoration: "none",
    color: "inherit",
  },
  userName: {
    color: "rgba(0, 0, 0, 0.6)",
  },
}));

interface Props {
  user: User;
}

const UserItem: React.FC<Props> = ({ user }) => {
  const classes = useStyles();

  return (
    <Box key={user.userId}>
      <Link
        to={`/userpage/${user.userId}`}
        className={classes.userInfoLink}
      >
        <Card className={classes.card}>
          <CardContent>
            <UserInfo
              userId={user.userId}
              userName={user.userName}
              iconPath={user.iconPath.url}
            />
            <Typography variant="body1" className={classes.userName}>
              {user.accountName}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </Box>
  );
};

export default UserItem;
