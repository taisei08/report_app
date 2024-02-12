import { Link } from 'react-router-dom';
import { Box, makeStyles, Typography } from '@material-ui/core';
import Avatar from "react-avatar";
import ExpandText from 'components/utils/userpage/ExpandText';
import Tag from 'components/utils/posts/post_item/Tag';
import { formatDate } from "lib/function";
import { PostLists } from 'interfaces';

interface Props {
  postData: PostLists;
}

const useStyles = makeStyles((theme) => ({
  avatarContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
  userLink: {
    textDecoration: "none",
    color: "inherit",
    fontWeight: 'bold',
    display: "flex",
    alignItems: "center",
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

const PostInfo: React.FC<Props> = ({ postData }) => {
  const classes = useStyles();
  console.log(postData.iconPath)

  return (
    <>
      <Box className={classes.avatarContainer}>
        <Link to={`/userpage/${postData.userId}`} className={classes.userLink}>
          <Avatar
            name={postData.userName}
            size="25"
            round={true}
            src={postData.iconPath}
            className={classes.avatar}
          />
          <Typography variant="body2" className={classes.user}>
            @{postData.userName}
          </Typography>
        </Link>
      </Box>
      <Typography variant="h6" style={{ marginBottom: 10, fontWeight: "bold", fontSize: "1.4rem" }}>
        {postData.title}
      </Typography>
      {postData.tags.map((tag, index) => (
        <Tag key={index} tagName={tag.tagName} tagId={tag.tagId} />
      ))}
      <Typography variant="body2" color="textSecondary" style={{ marginTop: 10, marginBottom: 40 }}>
        最終更新日: {formatDate(postData.updatedAt)} 投稿日: {formatDate(postData.createdAt)}
      </Typography>
      <ExpandText statement={postData.description} />
    </>
  );
};

export default PostInfo;