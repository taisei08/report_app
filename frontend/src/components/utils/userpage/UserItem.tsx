import React from "react";
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
  follows: User;
}

const UserItem: React.FC<Props> = ({ follows }) => {
  const classes = useStyles();

  return (
    <Box key={follows.userId}>
      <Link
        to={`/userpage/${follows.userId}`}
        className={classes.userInfoLink}
      >
        <Card className={classes.card}>
          <CardContent>
            <UserInfo
              userId={follows.userId}
              userName={follows.userName}
              iconPath={follows.iconPath.url}
            />
            <Typography variant="body1" className={classes.userName}>
              {follows.accountName}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </Box>
  );
};

export default UserItem;
