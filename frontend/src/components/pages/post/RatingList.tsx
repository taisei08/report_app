import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, makeStyles } from '@material-ui/core';
import RatingItem from 'components/utils/postpage/rating/RatingItem';
import client from "lib/api/client";
import { getAuthHeaders } from 'lib/api/auth';
import CustomPagination from 'components/utils/posts/CustomPagination';

const useStyles = makeStyles(() => ({
  link: {
    fontWeight: 'bold',
    color: 'black',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

export interface RatingData {
  iconPath: string;
  id: number;
  ratingCreatedAt: string;
  userId: number;
  userName: string;
  accountName: string;
  value: number;
}

const RatingList: React.FC = () => {
  const classes = useStyles();
  const Id = useParams()
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allLikes, setAllLikes] = useState<RatingData[]>([]);
  const [counts, setCounts] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const boxRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response, response2] = await Promise.all([
          client.get(`/rating_of_users?page=${currentPage}`, { params: {postId: Id.postId} }),
          client.get('/rating_of_users_counts', {
            params: { postId: Id.postId },
            headers: getAuthHeaders(),
          })
        ]);

        const fullLength = response2.data.count;
        setAllLikes(response.data.ratings);
        setCounts(fullLength)
        setTotalPages(Math.ceil(fullLength / 10));
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/not_found');
      }
    };

    fetchData();
  }, [currentPage]);

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
      {allLikes.length === 0 ? (
      <Typography
        variant="h5"
        style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '40px' }}
      >
        まだ評価がありません
      </Typography>
    ) : (
        <>
          <Container style={{display: 'flex', justifyContent: 'center'}}>
            <Typography
              variant='body1'
              component={Link}
              to={`/article/${Id.postId}`}
              className={classes.link}
            >
              記事
            </Typography>
            <Typography variant='body1'>
            に評価をしたユーザー
            </Typography>
          </Container>
          <Typography variant='body1' style={{marginBottom: '1rem'}}>
            {counts}件の評価
          </Typography>
          {allLikes.map(rating => (
            <>
              <RatingItem 
                key={rating.id} 
                rating={rating}
              />
            </>
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

export default RatingList;