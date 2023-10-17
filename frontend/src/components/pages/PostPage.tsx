import { useState, useEffect } from 'react';
import client from 'lib/api/client';
import Avatar from 'react-avatar';
import Rating from 'react-rating';
import { useParams } from 'react-router-dom';
import PdfViewer from 'components/utils/PdfViewer';




const PostPage = () => {
  const [postData, setPostData] = useState({});
  const [reviews, setReviews] = useState([]);
  const [reviewComment, setReviewComment] = useState('');
  const [rating, setRating] = useState(0);
  const Id = useParams()
  const postId = {
    postCurrentId: Id.postId,
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.get('/post_detail', { params: postId });
        console.log("Response from server:", response.data.posts[0]);
        setPostData(response.data.posts[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [postId.postCurrentId]);

  const handleRatingChange = value => {
    setRating(value);
    console.log(value)
    // You may want to handle the rating change here, e.g., send it to the server.
  };

  const handleReviewSubmit = () => {
    // You may want to submit the review comment and rating to the server.
    // Update the reviews state after successful submission.
  };

  return (
    <div>
      <div>
        <Avatar size="50" name={postData.userName} />
        <span>{postData.uid}</span>
      </div>
      <h2>{postData.title}</h2>
      <p>Created at: {postData.createdAt}</p>
      <p>Last Updated: {postData.updatedAt}</p>
      <PdfViewer fileData={"http://localhost:3010/uploads/post/document_path/125/Discussion_Debate_Task_Guide-1.pdf"}>
      </PdfViewer>
      <Rating
        initialRating={rating}
        onChange={handleRatingChange}
      />
      <p>{postData.description}</p>
      <div>
        <textarea
          value={reviewComment}
          onChange={e => setReviewComment(e.target.value)}
        />
        <button onClick={handleReviewSubmit}>Submit Review</button>
      </div>
      <div>
        {reviews.map(review => (
          <div key={review.review_id}>
            <Avatar size="30" name={review.uid} />
            <span>{review.uid}</span>
            <p>{review.review}</p>
            <Rating
              readonly
              initialRating={review.rating}
              fractions={2}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostPage;