import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { Box, Card, CardContent, Typography, Grid } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { blue } from '@material-ui/core/colors';
import { UserReviews } from "./UserReviews";
import { trimText, formatDate } from "lib/function";
import UserInfo from "../posts/post_item/UserInfo";
import { Styles } from "lib/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2),
  },
  review: {
    color: "rgba(0, 0, 0, 0.6)",
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  review2: {
    color: "rgba(0, 0, 0, 0.6)",
    textAlign: 'right',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

interface Props {
  review: UserReviews;
  handlePostClick: (postId: number) => void;
}

const ReviewItem: React.FC<Props> = ({ review, handlePostClick }) => {
  const classes = useStyles();
  const importClasses = Styles();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    handlePostClick(review.postId);
  };

  return (
    <Box key={review.postId} style={{ textDecoration: "none", color: "inherit" }}>
      <Link
        to={`/article/${review.postId}`}
        style={{ textDecoration: "none", color: "inherit" }}
        onClick={handleLinkClick}
      >
        <Card className={classes.card}>
          <CardContent>
            <UserInfo
              userId={review.userId}
              userName={review.userName}
              iconPath={review.iconPath}
              createdAt={review.reviewCreatedAt}
            />
            <Typography
              variant="h6"
              style={{ fontWeight: "bold", fontSize: "1.4rem" }}
            >
              <span className={importClasses.link}>{trimText(review.title, 15)}</span>
            </Typography>
            <Box className={classes.review}>
              <Typography
                component={Link}
                style={{ textDecoration: "none", color: "inherit" }}
                to={{ pathname: `/article/${review.postId}`,
                      search: `?id=${review.reviewId}&type=reviewId` }}
                onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                  e.stopPropagation();
                }}
                variant="body2"
              >
                へのレビュー<br/>
                {trimText(review.review, 110)}
              </Typography>
            </Box>
            <Grid container style={{ marginTop: "7px" }} alignItems="center">
              {review.value !== 0 && (
                <Grid item>
                  <Rating
                    name={`rating-${review.reviewId}`}
                    value={review.value}
                    readOnly
                    precision={0.5}
                    emptyIcon={<StarBorderIcon style={{ color: blue[500], fontSize: 30 }} />}
                    icon={<StarIcon style={{ color: blue[500], fontSize: 30 }} />}
                  />
                </Grid>
              )}
              <Grid item xs className={classes.review2}>
                <Typography
                  variant="body2"
                  component={Link}
                  to={{ pathname: `/article/${review.postId}`,
                        search: `?id=${review.reviewId}&type=reviewId` }}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                    e.stopPropagation();
                  }}
                  style={{ textDecoration: "none", color: "inherit"}}
                >
                  {formatDate(review.reviewCreatedAt)}に投稿されたレビュー
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Link>
    </Box>
  );
};

export default ReviewItem;
