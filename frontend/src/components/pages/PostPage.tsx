import { useState, useEffect } from 'react';
import client from 'lib/api/client';
import Avatar from 'react-avatar';
import { Document, Page } from 'react-pdf';
import Rating from 'react-rating';

const PostPage = () => {
  const [postData, setPostData] = useState({});
  const [reviews, setReviews] = useState([]);
  const [reviewComment, setReviewComment] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    // Fetch post data
    client.get('API_ENDPOINT_TO_FETCH_POST_DATA')
      .then(response => setPostData(response.data))
      .catch(error => console.error('Error fetching post data: ', error));

    // Fetch reviews
    client.get('API_ENDPOINT_TO_FETCH_REVIEWS')
      .then(response => setReviews(response.data))
      .catch(error => console.error('Error fetching reviews: ', error));
  }, []);

  const handleRatingChange = value => {
    setRating(value);
    // You may want to handle the rating change here, e.g., send it to the server.
  };

  const handleReviewSubmit = () => {
    // You may want to submit the review comment and rating to the server.
    // Update the reviews state after successful submission.
  };

  return (
    <div>
      <div>
        <Avatar size="50" name={postData.user_name} />
        <span>{postData.uid}</span>
      </div>
      <h2>{postData.title}</h2>
      <p>Created at: {postData.created_at}</p>
      <p>Last Updated: {postData.updated_at}</p>
      <Document file={postData.document_path}>
        <Page pageNumber={1} />
      </Document>
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
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostPage;