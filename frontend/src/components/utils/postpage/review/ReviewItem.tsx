import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Box, Card, CardContent, Typography, Grid, Button, IconButton, Menu, MenuItem } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { blue } from '@material-ui/core/colors';
import UserInfo from "components/utils/posts/post_item/UserInfo";
import LikeButton from "components/utils/postpage/LikeButton";
import ReplyForm from "components/utils/postpage/reply/ReplyForm";
import ReplyList from "components/utils/postpage/reply/ReplyList";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReviewEditForm from "./ReviewEditForm";
import ConfirmationDialog from "components/utils/ConfirmationDialog";
import { Review, Reply } from "interfaces";
import client from "lib/api/client";

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
  review: Review;
  currentUserId: number;
  handleDeleteReview?: (reviewId: number) => void;
}

const ReviewItem: React.FC<Props> = ({ review, currentUserId, handleDeleteReview }) => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [replyFormVisible, setReplyFormVisible] = useState<boolean>(false);
  const [replyData, setReplyData] = useState<boolean>(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const showDialog = () => {
    setShowConfirmation(true);
  };

  const toggleReplyForm = () => {
    setReplyFormVisible((prevVisible) => !prevVisible);
  };

  const toggleReplies = () => {
    setReplyData((prevData) => !prevData);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
    setMenuAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allReplies, setAllReplies] = useState<Reply[]>([]);
  const [moreReplies, setMoreReplies] = useState<boolean>(true);

  const fetchData = async (shouldIncrementPage: boolean = false) => {
    try {
      const response = await client.get(`/replies?page=${currentPage}`, { params: { reviewId: review.reviewId } });
      if (response.data.replies.length < 10) {
        setMoreReplies(false);
      }
      
      if (shouldIncrementPage && !moreReplies && response.data.replies.length === 10) {
        setCurrentPage(prevPage => prevPage + 1);
      }

      setAllReplies((prevReplies: Reply[]) => {
        const newReplies = response.data.replies.filter((newReply: Reply) => !prevReplies.some((oldReply: Reply) => oldReply.replyId === newReply.replyId));
        return [...prevReplies, ...newReplies];
      });      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const loadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  if (!review.review) return null;

  return (
    <>
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
                    emptyIcon={<StarBorderIcon style={{ color: blue[500], fontSize: 25 }} />}
                    icon={<StarIcon style={{ color: blue[500], fontSize: 25 }} />}
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

            {currentUserId === review.userId && (
              <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
            )}

            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleModalOpen}>
                <Typography variant="body2">編集</Typography>
              </MenuItem>
              <MenuItem onClick={showDialog}>
                <Typography variant="body2">削除</Typography>
              </MenuItem>
            </Menu>

            {replyFormVisible && <ReplyForm id={review.reviewId} fetchData={fetchData}/>}

            {replyData && (
              <>
                <ReplyList
                  currentUserId={currentUserId}
                  allReplies ={allReplies}
                  currentPage={currentPage}
                  moreReplies={moreReplies}
                  fetchData={fetchData}
                  loadMore={loadMore}
                />
                <ReplyForm id={review.reviewId} fetchData={fetchData}/>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
      {modalOpen && <ReviewEditForm review={review} setModalOpen={setModalOpen} modalOpen={modalOpen} />}
      <ConfirmationDialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleDeleteReview ? () => handleDeleteReview(review.reviewId) : () => {}  }
        title="投稿の削除"
        content="本当にレビューを削除しますか？"
        cancelText="戻る"
        confirmText="削除"
      />
    </>
  );
};

export default ReviewItem;
