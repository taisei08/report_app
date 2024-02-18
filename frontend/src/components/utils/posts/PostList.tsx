import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from "lib/api/client";
import { PostLists } from "interfaces/index";
import PostItem from './post_item/PostItem';
import { Box, Button, Typography, Container } from '@material-ui/core';

const PostList = () => {
  const [allPosts, setAllPosts] = useState<PostLists[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.get(`/posts?page=${currentPage}`);
        setAllPosts(prevPosts => [...prevPosts, ...response.data.posts]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentPage]);

  const loadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePostClick = (postId: number) => {
    navigate(`/article/${postId}`);
  };

  return (
    <>
      <Typography variant="h2" gutterBottom style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          新着投稿
      </Typography>
      <Box style={{ width: '90vw' }}>
        {allPosts.map(post => (
          <PostItem 
            key={post.postId} 
            post={post} 
            handlePostClick={handlePostClick} 
          />
        ))}
      </Box>
      <Container style={{ display: 'flex', justifyContent: 'center' }}>
        <Button onClick={loadMore} variant="contained" style={{ width: '50vw', backgroundColor: 'white' }}>
          さらに読み込む
        </Button>
      </Container>
    </>
  );
};

export default PostList;
