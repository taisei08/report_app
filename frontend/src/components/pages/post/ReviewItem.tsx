import { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Box, Card, CardContent, Typography, Grid, Button } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { blue } from '@material-ui/core/colors';
import UserInfo from "components/utils/posts/post_item/UserInfo";
import { UserReviews } from "interfaces";
import LikeButton from "components/utils/postpage/LikeButton";
import ReplyForm from "components/utils/postpage/ReplyForm";
import { ReplyList } from "components/utils/postpage/Reply";

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2),
  },
  review: {
    color: "rgba(0, 0, 0, 0.8)",
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
}

const ReviewItem: React.FC<Props> = ({ review }) => {
  const classes = useStyles();
  const [replyFormVisible, setReplyFormVisible] = useState<boolean>(false);
  const [replyData, setReplyData] = useState<boolean>(false);

  const toggleReplyForm = () => {
    setReplyFormVisible((prevVisible) => !prevVisible);
  };

  const toggleReplies = () => {
    setReplyData((prevData) => !prevData);
  };

  if (!review.review) return null;

  return (
    <Box key={review.postId} style={{ textDecoration: "none", color: "inherit" }}>
        <Card className={classes.card}>
          <CardContent>
            <UserInfo
              userId={review.userId}
              userName={review.userName}
              iconPath={review.iconPath}
              createdAt={review.createdAt}
            />
            <Box className={classes.review}>
              <Typography
                style={{ textDecoration: "none", color: "inherit" }}
                variant="body2"
              >
                {review.review}
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
            </Grid>

            <Button onClick={toggleReplyForm}>
              {replyFormVisible ? '閉じる' : '返信'}
            </Button>

            {review.review !== "" && review.replyLength > 0 && (
              <Button onClick={toggleReplies}>
                {replyData ? '隠す' : `${review.replyLength}件のリプライ`}
              </Button>
            )}

            <LikeButton id={review.reviewId} type="review" />

            {replyFormVisible && (
              <ReplyForm id={review.reviewId} />
            )}

            {replyData && (
              <>
                <ReplyList id={review.reviewId} />
                <ReplyForm id={review.reviewId} />
              </>
            )}

          </CardContent>
        </Card>
    </Box>
  );
};

export default ReviewItem;
