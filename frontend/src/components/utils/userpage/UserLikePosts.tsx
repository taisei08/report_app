import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@material-ui/core';
import PostItem from '../posts/post_item/PostItem';
import client from "lib/api/client";
import { PostLists } from "interfaces/index";
import CustomPagination from '../posts/CustomPagination';

interface Props {
  userId: string;
}

const UserLikePosts: React.FC<Props> = ({ userId }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allPosts, setAllPosts] = useState<PostLists[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const navigate = useNavigate();
  const boxRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response, response2] = await Promise.all([
          client.get(`/like_posts?page=${currentPage}`, { params: { userId } }),
          client.get('/like_post_counts', { params: { userId } }),
        ]);
        const fullLength = response2.data;
        setAllPosts(response.data.posts);
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
      {allPosts.length === 0 ? (
        <Typography
          variant="h5"
          style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '40px' }}
        >
          まだいいねした投稿はありません
        </Typography>
      ) : (
          <>
            {allPosts.map(post => (
              <PostItem 
                key={post.postId} 
                post={post} 
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