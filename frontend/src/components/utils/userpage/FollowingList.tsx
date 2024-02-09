import { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@material-ui/core';
import UserItem from './UserItem';
import client from "lib/api/client";
import { getAuthHeaders } from 'lib/api/auth';
import CustomPagination from '../posts/CustomPagination';
import { User } from 'interfaces';

interface Props {
  userId: string;
}

const FollowingList: React.FC<Props> = ({ userId }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allFollowings, setAllFollowings] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const boxRef = useRef<HTMLDivElement>();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response, response2] = await Promise.all([
          client.get('/following', { params: { followerId: userId } }),
          client.get('/follow_and_post_counts', {
            params: { userId: userId },
            headers: getAuthHeaders(),
          })
        ]);
        console.log(response2.data.followings)

        const fullLength = response2.data.followings;
        setAllFollowings(response.data.followings);
        setTotalPages(Math.ceil(fullLength / 10));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentPage, userId]);

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
      {allFollowings.length === 0 ? (
      <Typography
        variant="h5"
        style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '40px' }}
      >
        まだフォローしていません
      </Typography>
    ) : (
        <>
          {allFollowings.map(following => (
            <UserItem 
              key={following.userId} 
              follows={following}
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

export default FollowingList;