import { Link } from "react-router-dom";
import { Box, Typography } from "@material-ui/core";
import Avatar from "react-avatar";
import { makeStyles } from "@material-ui/core/styles";
import { formatDate } from "lib/function";
import { trimText } from "lib/function";

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
  createdAt?: string;
}

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
        <Typography variant="body1" className={classes.user} style={{fontWeight: 'bold'}}>
          <Link
            to={`/userpage/${userId}`}
            onClick={handleChildLinkClick}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            @{trimText(userName, 15)}
          </Link>
        </Typography>
        {createdAt && (
          <Typography variant="body2" color="textSecondary">
            投稿日: {formatDate(createdAt)}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default UserInfo;
