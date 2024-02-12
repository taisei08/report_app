import { useRef } from 'react';
import { Box, Typography } from '@material-ui/core';
import ReviewItem from './ReviewItem';
import CustomPagination from 'components/utils/posts/CustomPagination';
import { UserReviews } from 'interfaces/index';

interface Props {
  allReviews: Array<UserReviews>;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (currentPage: number) => void;
}

const ReviewList: React.FC<Props> = ({ allReviews, totalPages, currentPage, setCurrentPage }) => {
  const boxRef = useRef<HTMLDivElement>();


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
                key={review.reviewId} 
                review={review} 
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

export default ReviewList;