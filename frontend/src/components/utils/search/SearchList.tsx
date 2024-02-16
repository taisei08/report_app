import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import client from "lib/api/client";
import { Box, Typography } from '@material-ui/core';
import PostItem from '../posts/post_item/PostItem';
import CustomPagination from '../posts/CustomPagination';
import { PostLists } from "interfaces/index";

interface Props {
  searchQuery: string;
}

const SearchList: React.FC<Props> = ({ searchQuery }) => {
  const [allPosts, setAllPosts] = useState<PostLists[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalArticles, setTotalArticles] = useState<number>(0);
  const [prevQuery, setPrevQuery] = useState<string>();
  const navigate = useNavigate();
  const boxRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (prevQuery !== searchQuery)
        {setCurrentPage(1)}
        setPrevQuery(searchQuery)
        const [response, response2] = await Promise.all([
          client.get(`/posts_search?page=${currentPage}`, { params: {q: searchQuery}}),
          client.get('/posts_search_counts', { params: {q: searchQuery}}),
        ]);
        const fullLength = response2.data     
        console.log(response2.data)
        setAllPosts(response.data.posts);
        setTotalArticles(fullLength.length)
        setTotalPages(Math.ceil(fullLength.length / 20));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentPage, searchQuery]);

  const scrollToTop = () => {
    if (boxRef.current) {
      boxRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePageChange = (e: React.ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage);
    scrollToTop();
  };

  const handlePostClick = (postId: number) => {
    navigate(`/article/${postId}`);
  };
  console.log(searchQuery)
  return (
    <Box {...{ ref: boxRef }}>
      <Typography variant="h5" gutterBottom style={{ display: 'flow', textAlign: 'center', fontWeight: 'bold'}}>
        {searchQuery}の検索結果: {totalArticles}件
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
      <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
      />
    </Box>
  );
};

export default SearchList;