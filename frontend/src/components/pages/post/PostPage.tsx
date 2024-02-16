import { useState, useEffect, useContext, useMemo } from 'react';
import { Divider, Box, Typography, Container } from '@material-ui/core';
import client from 'lib/api/client';
import { AuthContext } from 'App';
import CustomRating from './CustomRating';
import { useParams, useLocation } from 'react-router-dom';
import PdfViewer from 'components/utils/postpage/PdfViewer';
import { getAuthHeaders } from "lib/api/auth"
import LikeButton from 'components/utils/postpage/LikeButton';
import HamburgerMenu from './HamburgerMenu';
import DownloadButton from 'components/utils/postpage/DownloadButton';
import PostInfo from 'components/utils/postpage/PostInfo';
import { Review, PostLists } from 'interfaces';
import ReviewForm from 'components/utils/postpage/review/ReviewForm';
import ReviewList from 'components/utils/postpage/review/ReviewList';

const PostPage = () => {
  const location = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const paramValue: string | null = queryParams.get("type");
  const [isYourPost, setIsYourPost] = useState<boolean>(false);
  const [postData, setPostData] = useState<PostLists | null>(null);
  const [paramReview, setParamReview] = useState<Review | null>(null);
  const [currentUserReview, setCurrentUserReview] = useState<Review | false>(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const { isSignedIn } = useContext(AuthContext)
  const { postId } = useParams<{ postId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      if (paramValue) {
        try {
          const response = await client.get('/review_or_reply_spotted', {
            params: { [paramValue]: queryParams.get("id") }
          });
          setParamReview(response.data.review);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
  }, [paramValue, queryParams]);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await client.get('/post_detail', { params: { postId } , headers: getAuthHeaders()});
        setPostData(response.data.post);
        setIsYourPost(response.data.isOwner)
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };
    fetchPostData();
  }, [postId]);

  useEffect(() => {
    fetchReviews();
  }, [postId]);  

  const fetchReviews = async () => {
    try {
      const [response, response2] = await Promise.all([
        client.get(`/reviews?page=${currentPage}`, { params: { postId }, headers: getAuthHeaders() }),
        client.get('/review_of_post_counts', { params: { postId } })
      ]);
      
      setReviews(response.data.reviews);
      setCurrentUserId(response.data.currentUserId);
      const fullLength = response2.data.length;
      setTotalPages(Math.ceil(fullLength / 10));
      if (response.data.ownReview) {
        setCurrentUserReview(response.data.ownReview)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };


  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

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

  if (!postData) {
    return null;
  }

  return (
    <Box>
      <PostInfo postData={postData}/>
      {postData.documentPath && (<PdfViewer fileData={postData.documentPath.url} />)}
      <Box style={{ textAlign: 'right' }}>
      <Box style={{ margin: '0 0 0 auto' }}>
          <LikeButton id={postData.postId} type="post"/>
          {postData.documentPath && (<DownloadButton url={postData.documentPath.url} />)}
          <HamburgerMenu isYourPost={isYourPost} />
        </Box>
        { isSignedIn && (
        <Box style={{ textAlign: 'center' }}>
          <CustomRating postId={postData.postId} initialRating={currentUserReview ? currentUserReview.value : 0} />
        </Box>
        )}
      </Box>
      {isSignedIn && !isYourPost && (!currentUserReview || !currentUserReview.review) && (
        <Container style={{marginTop: 10, marginBottom: 10, width: 'calc(min(1000px, 90vw))'}}>
          <ReviewForm
            reviewComment={reviewComment}
            setReviewComment={setReviewComment}
            fetchReviews={fetchReviews}
          />
        </Container>
      )}
      <Divider style={{ marginBottom: '10px' }} />
      <Typography variant="h5" style={{ marginBottom: '5px', fontWeight: 'bold' }}>
        レビュー:
      </Typography>
      {paramReview &&
        <>
          <Typography variant="body2" style={{ textAlign: 'center', marginBottom: '5px', fontWeight: 'bold' }}>
            注目のレビュー
          </Typography>
          <Container style={{display: 'flex', alignItems: 'center'}}>
            <ReviewList
              allReviews={[paramReview]}
              currentUserId={currentUserId}
              handleDeleteReview={handleDeleteReview}
            />
          </Container>
          <Divider style={{ marginBottom: '10px' }} />
        </>
      }
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
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </Container>
    </Box>
  );
};

export default PostPage;
