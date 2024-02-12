import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@material-ui/core';
import client from "lib/api/client";
import ReviewItem from './ReviewItem';
import CustomPagination from '../posts/CustomPagination';

export interface UserReviews {
  iconPath: string;
  postId: number;
  postCreatedAt: string;
  reviewId: number;
  review: string;
  reviewCreatedAt: string;
  title: string;
  userId: number;
  userName: string;
  value: number;
}

interface Props {
  userId: string;
}

const UserLikePosts: React.FC<Props> = ({ userId }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allReviews, setAllReviews] = useState<UserReviews[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const navigate = useNavigate();
  const boxRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response, response2] = await Promise.all([
          client.get(`/reviews_by_user?page=${currentPage}`, { params: { userId } }),
          client.get('/review_counts', { params: { userId } }),
        ]);
        console.log(response.data)
        const fullLength = response2.data;
        setAllReviews(response.data.reviews);
        setTotalPages(Math.ceil(fullLength.length / 10));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentPage, userId]);

  const handlePostClick = (postId: number) => {
    navigate(`/article/${postId}`);
  };

  const scrollToTop = () => {
    if (boxRef.current) {
      boxRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePageChange = (e: React.ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage);
    scrollToTop();
  };

  return (
    <Box {...{ ref: boxRef }} style={{ width: '90vw' }}>
      {allReviews.length === 0 ? (
        <Typography
          variant="h5"
          style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '40px' }}
        >
          まだレビューはありません
        </Typography>
      ) : (
          <>
            {allReviews.map(review => (
              <ReviewItem 
                key={review.postId} 
                review={review} 
                handlePostClick={handlePostClick} 
              />
            ))}
            <CustomPagination
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
          </>
        )}
    </Box>
  );
};

export default UserLikePosts;