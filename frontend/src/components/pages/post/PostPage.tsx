import { useState, useEffect } from 'react';
import { Grid, Box, Typography, Container } from '@material-ui/core';
import client from 'lib/api/client';
import Avatar from 'react-avatar';
import CustomRating from './CustomRating';
import Rating from 'react-rating';
import { useParams } from 'react-router-dom';
import PdfViewer from 'components/utils/postpage/PdfViewer';
import { getAuthHeaders } from "lib/api/auth"
import { ReplyForm, ReplyList } from 'components/utils/postpage/Reply';
import { useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import FollowButton from 'components/utils/userpage/FollowButton';
import LikeButton from 'components/utils/postpage/LikeButton';
import HamburgerMenu from './HamburgerMenu';
import PostInfo from './PostInfo';
import { UserReviews } from 'interfaces';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
const PostPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get("type");
  const [isYourPost, setIsYourPost] = useState<boolean>(false);
  const [postData, setPostData] = useState({});
  const [paramReview, setParamReview] = useState();
  const [currentUserReview, setCurrentUserReview] = useState<UserReviews | false>();
  const [reviews, setReviews] = useState([]);
  const [reviewComment, setReviewComment] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number>(0)
  const [replyFormVisible, setReplyFormVisible] = useState({}); // レビューIDをキーとした返信フォームの表示ステート
  const [replyData, setReplyData] = useState({}); // レビューIDをキーとしたリプライデータ
  const Id = useParams()
  const postId = {
    postId: Id.postId,
  };

  useEffect(() => {
    const fetchData = async () => {
      if (paramValue) {
        // paramが存在する場合の処理
  
        try {
          const response = await client.get('/review_or_reply_spotted', {
            params: { [paramValue]: queryParams.get("id") } // キーと値をセットで指定
          });
  
          // レスポンスからデータを取り出す
          console.log(response.data.resource)
          setParamReview(response.data.resource);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
  
    fetchData(); // useEffect内で関数を呼ぶ
  }, []);
  
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await client.get('/post_detail', { params: postId });
        console.log(response.data)
        setPostData(response.data.post);
        setIsYourPost(response.data.isOwner)
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };
  
    fetchPostData();
  }, [postId.postId]);
  
  useEffect(() => {
    fetchReviews();
  }, [postId.postId]);  

  const fetchReviews = async () => {
    try {
      const response = await client.get('/reviews', { params: postId, headers: getAuthHeaders() });
      setReviews(response.data.reviews);
      setCurrentUserId(response.data.currentUserId);
      console.log(response.data.ownReview)
      if (response.data.ownReview) {
        setCurrentUserReview(response.data.ownReview)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const toggleReplyForm = (reviewId) => {
    // 返信フォームの表示を切り替える
    setReplyFormVisible((prevVisible) => ({
      ...prevVisible,
      [reviewId]: !prevVisible[reviewId],
    }));
  };

  const toggleReplies = (reviewId) => {
    // リプライの表示を切り替える
    setReplyData((prevData) => ({
      ...prevData,
      [reviewId]: !prevData[reviewId],
    }));
    console.log(replyData)

  };

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedReviewText, setEditedReviewText] = useState('');

  const handleEditReview = (reviewId, reviewText) => {
    // 編集ボタンがクリックされたときの処理
    setEditingReviewId(reviewId);
    setEditedReviewText(reviewText);
  };

  const handleCancelEdit = () => {
    // キャンセルボタンがクリックされたときの処理
    setEditingReviewId(null);
  };

  const handleSaveReview = () => {
    console.log(editedReviewText)
    client.put(`/reviews/${editingReviewId}`, { review: editedReviewText },
    { headers: getAuthHeaders() })
    .then(response => {
      console.log('Rating data sent successfully:', response.data);
    })
    .catch(error => {
      console.error('Error sending rating data:', error);
    });
    setEditingReviewId(null)
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      const response = await client.delete(`/reviews/${reviewId}`, { headers: getAuthHeaders() });
      console.log('削除が成功しました', response);
      setCurrentUserReview(false)
      handleCloseDeleteModal();
      setReviewComment('')
    } catch (error) {
      console.error('削除中にエラーが発生しました', error);
      handleCloseDeleteModal();
    }
  };  

  if (postData.documentPath == undefined) {
    return null;
  }

  return (
    <Box>
      <PostInfo postData={postData} />
      <PdfViewer fileData={postData.documentPath.url} />
      <LikeButton
      id = {postData.postId}
      type = "post"
      />
      <Grid container xs={12} spacing={2} style={{ display: 'flex', justifyContent: 'center' }}>
        <Grid item>
          <HamburgerMenu isYourPost={isYourPost} />
        </Grid>
        <Grid item>
          <Typography variant="body1">評価</Typography>
          <CustomRating postId={postData.postId} initialRating={currentUserReview ? currentUserReview.value : 0} />
        </Grid>
      </Grid>
      {!isYourPost && <FollowButton id={postData.userId} />}
      {!isYourPost && (!currentUserReview || !currentUserReview.review) && (
                  <Container style={{marginTop: 10, marginBottom: 10, width: 'calc(min(1000px, 90vw))'}}>
        <ReviewForm
          reviewComment = {reviewComment}
          setReviewComment = {setReviewComment}
          fetchReviews = {fetchReviews}
        />
        </Container>
      )}
  

  <div>
  {paramReview && paramReview.length > 0 &&
    paramReview.map((review) => (
      // 条件に基づいてレビューを表示
        <div key={review.reviewId} style={{ border: '1px solid #000', padding: '10px', marginBottom: '10px' }}>
          <Avatar
            size="30"
            name={review.userName}
            round={true}
            src={review.iconPath}
          />
          <span>
            {review.userName} {review.createdAt}
          </span>
          {editingReviewId === review.reviewId ? (
            // Edit mode
            <div>
              <textarea
                value={editedReviewText}
                onChange={(e) => setEditedReviewText(e.target.value)}
              />
              <button
                onClick={() => {
                  handleSaveReview(review.reviewId);
                  review.review = editedReviewText;
                }}
              >
                保存
              </button>
              <button onClick={handleCancelEdit}>キャンセル</button>
            </div>
          ) : (
            <div>
              <p>{review.review}</p>
              <button onClick={() => handleEditReview(review.reviewId, review.review)}>
                編集
              </button>
            </div>
          )}
          <div>
            {/* メニュー内の削除ボタン */}
            <button onClick={handleShowDeleteModal}>削除</button>
            {/* 削除モーダル */}
            <Modal
              isOpen={showDeleteModal}
              onRequestClose={handleCloseDeleteModal}
              contentLabel="削除の確認"
            >
              <h2>削除の確認</h2>
              <p>本当に削除してもよろしいですか？</p>
              <div>
                <button onClick={() => handleDeleteReview(review.reviewId)}>削除</button>
              </div>
              <div>
                <button onClick={handleCloseDeleteModal}>中止</button>
              </div>
            </Modal>
          </div>
          <div>
            <Rating readonly initialRating={review.value} fractions={2} />
            {review.review !== "" && (
              <button onClick={() => toggleReplyForm(review.reviewId)}>
                {replyFormVisible[review.reviewId] ? '閉じる' : '返信'}
              </button>
            )}
          </div>

          {review.review !== "" && review.replyLength > 0 && (
            <button onClick={() => toggleReplies(review.reviewId)}>
              {replyData[review.reviewId] ? '隠す' : `${review.replyLength}件のリプライ`}
            </button>
          )}

          {replyFormVisible[review.reviewId] && (
            // 返信フォームを表示
            <ReplyForm id={review.reviewId} />
          )}

          {replyData[review.reviewId] && (
            // リプライを表示
            <>
              <ReplyList id={review.reviewId} />
              <ReplyForm id={review.reviewId} />
            </>
          )}
          <p>注目のレビュー</p>
        </div>
      
    ))
  }
</div>


      {currentUserReview &&
          <Container style={{display: 'flex', alignItems: 'center'}}>

        <ReviewList
          allReviews={[currentUserReview]}
          currentUserId={currentUserId}
          handleDeleteReview={handleDeleteReview}
        />
                  </Container>

      }
          <Container style={{display: 'flex', alignItems: 'center'}}>
      <ReviewList
        allReviews={reviews}
        currentUserId={currentUserId}
        totalpages={1}
        currentPage={1}
        setCurrentPage={(currentPage) => console.log(currentPage)}
      />
    </Container>
    </Box>
  );
  
};

export default PostPage;