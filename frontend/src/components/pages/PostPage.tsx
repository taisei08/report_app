import { useState, useEffect } from 'react';
import client from 'lib/api/client';
import Avatar from 'react-avatar';
import Rating from 'react-rating';
import { useParams } from 'react-router-dom';
import PdfViewer from 'components/utils/PdfViewer';
import { getAuthHeaders } from "lib/api/auth"


const PostPage = () => {
  const [postData, setPostData] = useState({});
  const [reviews, setReviews] = useState([]);
  const [reviewComment, setReviewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [userId, setUserId] = useState('')
  const Id = useParams()
  const postId = {
    postId: Id.postId,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response1, response2] = await Promise.all([
          client.get('/post_detail', { params: postId }),
          client.get('/reviews', { params: postId, headers: getAuthHeaders() } ),
        ]);
    
        // レスポンスからデータを取り出す
        setPostData(response1.data.posts[0]);
        setReviews(response2.data.reviews);
        setUserId(response2.data.currentUserId);


        const currentUserId = response2.data.currentUserId;
        console.log(currentUserId)
        const matchingReview = response2.data.reviews
        .find(review => review.userId === currentUserId);

        if (matchingReview) {
          setRating(matchingReview.value);
        }
        
        console.log(response2.data.reviews)

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    
    
    };

    fetchData();
  }, [postId.postId]);

  const handleRatingChange = rate => {
    setRating(rate);
    console.log(rate)

    client.post('/ratings', { postId: Id.postId, value: rate },
    { headers: getAuthHeaders() })
    .then(response => {
      console.log('Rating data sent successfully:', response.data);
    })
    .catch(error => {
      console.error('Error sending rating data:', error);
    });
  };

  const handleReviewSubmit = () => {
    client.post('/reviews', { postId: Id.postId, review: reviewComment },
    { headers: getAuthHeaders() })
    .then(response => {
      console.log('Rating data sent successfully:', response.data);
    })
    .catch(error => {
      console.error('Error sending rating data:', error);
    });
  };

  if (postData.documentPath == undefined) {
    return null;
  }

  return (
    <div>
      <div>
        <Avatar size="50" name={postData.userName} />
        <span>{postData.uid}</span>
      </div>
      <h2>{postData.title}</h2>
      <p>Created at: {postData.createdAt}</p>
      <p>Last Updated: {postData.updatedAt}</p>
      <PdfViewer fileData={postData.documentPath.url} />
      <Rating initialRating={rating} onChange={handleRatingChange} />
      <p>{postData.description}</p>
      {console.log(userId)}
      {!reviews.some(review => review.userId === userId) && (
        <div>
          <textarea
            value={reviewComment}
            onChange={e => setReviewComment(e.target.value)}
          />
          <button onClick={handleReviewSubmit}>Submit Review</button>
        </div>
      )}
  
      <div>
        {reviews.map(review => (
          // 条件に基づいてレビューを表示
          review.userId === userId && (
            <div key={review.reviewId} style={{ border: '1px solid #000', padding: '10px', marginBottom: '10px' }}>
              <Avatar size="30" name={review.userName} />
              <span>{review.userName} {review.createdAt}</span>
              <p>{review.review}</p>
              <Rating readonly initialRating={review.value} fractions={2} />
            </div>
          )
        ))}
      </div>
      <div>
        {reviews.map(review => (
          userId !== review.userId && (
          <div key={review.reviewId} style={{ border: '1px solid #000', padding: '10px', marginBottom: '10px' }}>
            <Avatar size="30" name={review.userName} />
            <span>{review.userName} {review.createdAt}</span>
            <p>{review.review}</p>
            <Rating
              readonly
              initialRating={review.value}
              fractions={2}
            />
          </div>)
        ))}
      </div>
    </div>
  );
  
};

export default PostPage;