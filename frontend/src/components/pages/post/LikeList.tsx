import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, makeStyles } from '@material-ui/core';
import UserItem from 'components/utils/userpage/UserItem';
import client from "lib/api/client";
import { getAuthHeaders } from 'lib/api/auth';
import CustomPagination from 'components/utils/posts/CustomPagination';
import { User } from 'interfaces';

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

const LikeList: React.FC = () => {
  const classes = useStyles();
  const Id = useParams()
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allLikes, setAllLikes] = useState<User[]>([]);
  const [counts, setCounts] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const boxRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response, response2] = await Promise.all([
          client.get(`/likes?page=${currentPage}`, { params: {postId: Id.postId} }),
          client.get('/like_counts', {
            params: { postId: Id.postId },
            headers: getAuthHeaders(),
          })
        ]);
        const fullLength = response2.data.count;
        setAllLikes(response.data.likes);
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
        まだいいねされていません
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
            にいいねしたユーザー
            </Typography>
          </Container>
          <Typography variant='body1' style={{marginBottom: '1rem'}}>
            {counts}件のいいね
          </Typography>
          {allLikes.map(like => (
            <UserItem 
              key={like.userId} 
              user={like}
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

export default LikeList;