import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { Box, Card, CardContent, Typography } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { blue } from '@material-ui/core/colors';
import Tag from "./Tag";
import { PostLists } from "interfaces";
import { trimText } from "lib/function";
import UserInfo from "./UserInfo";
import { Styles } from "lib/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2),
  },
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
  user: {
    fontWeight: 400,
    display: 'inline-block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    position: 'relative',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  tag: {
    display: 'inline-block',
    border: '1px solid #ccc',
    padding: theme.spacing(0.25),
    margin: theme.spacing(0.25),
    borderRadius: theme.shape.borderRadius,
    fontSize: '0.8rem',
    transition: 'background-color 0.1s',
    '&:hover': {
      backgroundColor: theme.palette.grey[300],
    },
  },
}));

interface PostItemProps {
  post: PostLists;
  handlePostClick: (postId: number) => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, handlePostClick }) => {
  const classes = useStyles();
  const importClasses = Styles();


  return (
    <Box key={post.postId} style={{ textDecoration: "none", color: "inherit" }}>
      <Link
        to={`/article/${post.postId}`}
        style={{ textDecoration: "none", color: "inherit" }}
        onClick={(e) => {
          e.preventDefault();
          handlePostClick(post.postId);
        }}
      >
        <Card className={classes.card}>
          <CardContent>
            <UserInfo
              userId={post.userId}
              userName={post.userName}
              iconPath={post.iconPath}
              createdAt={post.createdAt}
            />
            <Typography
              variant="h6"
              style={{ fontWeight: "bold", fontSize: "1.4rem" }}
            >
              <Link
                to={`/article/${post.postId}`}
                onClick={(e) => {
                  e.preventDefault();
                  handlePostClick(post.postId);
                }}
                className={importClasses.link} // ここでスタイルを適用
              >
                {trimText(post.title, 30)}
              </Link>
            </Typography>
            <Typography
              variant="body2"
              style={{ color: "rgba(0, 0, 0, 0.6)" }}
            >
              {trimText(post.description, 90)}
            </Typography>
            <Rating
              name={`rating-${post.postId}`}
              value={post.averageRating}
              readOnly
              precision={0.5}
              emptyIcon={<StarBorderIcon style={{ color: blue[500], fontSize: 16 }} />}
              icon={<StarIcon style={{ color: blue[500], fontSize: 16 }} />}
            />
            <Box className={classes.tagsContainer}>
              {post.tags.map((tag, index) => (
                <Tag key={index} tagName={tag.tagName} tagId={tag.tagId} />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Link>
    </Box>
  );
};

export default PostItem;
