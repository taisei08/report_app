import { Link } from "react-router-dom";
import { Box, Typography } from "@material-ui/core";
import Avatar from "react-avatar";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  avatarContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
  user: {
    fontWeight: 400,
    display: "inline-block",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    position: "relative",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

interface UserInfoProps {
  userId: number;
  userName: string;
  iconPath: string;
  createdAt: string;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}年${month}月${day}日`;
};

const UserInfo: React.FC<UserInfoProps> = ({
  userId,
  userName,
  iconPath,
  createdAt,
}) => {
  const classes = useStyles();

  const handleChildLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.stopPropagation();
  };

  return (
    <Box className={classes.avatarContainer}>
      <Link
        to={`/userpage/${userId}`}
        onClick={handleChildLinkClick}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Avatar
          name={userName}
          size="40"
          round={true}
          src={iconPath}
          className={classes.avatar}
        />
      </Link>
      <Box>
        <Typography variant="body1" className={classes.user}>
          <Link
            to={`/userpage/${userId}`}
            onClick={handleChildLinkClick}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            @{userName}
          </Link>
        </Typography>
        <Typography variant="body2" color="textSecondary">
          投稿日: {formatDate(createdAt)}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserInfo;
