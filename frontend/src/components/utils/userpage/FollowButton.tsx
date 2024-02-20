import { useState, useEffect } from 'react';
import { Button, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';
import { useFormState } from '../error/useFormState';

const useStyles = makeStyles((theme) => ({
  followButton: {
    width: "100px",
    color: theme.palette.common.white,
    backgroundColor: blue[500],
    borderRadius: theme.spacing(3),
    '&:hover': {
      backgroundColor: blue[800],
    },
    fontWeight: 'bold',
  },
  removeButton: {
    width: "100px",
    color: theme.palette.common.black,
    borderRadius: theme.spacing(3),
    boxShadow: `0px 2px 5px rgba(0, 0, 0, 0.5)`,
    '&:hover': {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    fontWeight: 'bold',
  },
}));

type Props = {
  id: string;
};

const FollowButton = ({ id }: Props) => {
  const classes = useStyles();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [ formState, setFormState ] = useFormState();

  useEffect(() => {
    fetchFollowStatus();
  }, [id]);

  const fetchFollowStatus = async () => {
    if (formState.isSubmitting) return;
    try {
      const response = await client.get('/follows', {
        params: { userId: id },
        headers: getAuthHeaders()
      });
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error('Error fetching follow status:', error);
    }
  };

  const handleFollow = async () => {
    if (formState.isSubmitting) return;
    try {
      setFormState({ isSubmitting: true })
      await client.post(`/follows`, { userId: id }, { headers: getAuthHeaders() });
      setIsFollowing(true);
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setFormState({ isSubmitting: false })
    }
  };

  const handleUnfollow = async () => {
    try {
      setFormState({ isSubmitting: true })
      await client.delete(`/follows/${id}`, { headers: getAuthHeaders() });
      setIsFollowing(false);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    } finally {
      setFormState({ isSubmitting: false })
    }
  };

  return (
    <Box>
      {isFollowing ? (
        <Button className={classes.removeButton} onClick={handleUnfollow} onKeyDown={(e)=>{e.preventDefault()}}>
          リムーブ
        </Button>
      ) : (
        <Button className={classes.followButton} onClick={handleFollow} onKeyDown={(e)=>{e.preventDefault()}}>
          フォロー
        </Button>
      )}
    </Box>
  );
};

export default FollowButton;
