import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box, Typography } from '@material-ui/core';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';
import { Review } from 'interfaces';

interface Props {
  review: Review;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalOpen: boolean;
}

const ReviewEditForm: React.FC<Props> = ({ review, setModalOpen, modalOpen }) => {
  const [editingReview, setEditingReview] = useState<string>(review.review);

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleReviewUpdate = async () => {
    try {
      const response = await client.put(`/reviews/${review.reviewId}`, { review: editingReview }, { headers: getAuthHeaders() });
      console.log('Review data updated successfully:', response.data);
      review.review = editingReview;
      handleClose();
    } catch (error) {
      console.error('Error updating review data:', error);
    }
  };

  return (
    <Modal
      open={modalOpen}
      onClose={handleClose}
    >
      <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20vh'}}>
        <Card>
          <CardContent>
            <Typography variant="body1" style={{ marginBottom: 10, fontWeight: 'bold' }}>レビューの編集:</Typography>
            <TextField
              label="レビューを入力してください"
              multiline
              rows={4}
              value={editingReview}
              onChange={(e) => setEditingReview(e.target.value)}
              style={{ width: 'calc(min(600px, 90vw))' }}
            />
            <Box style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button variant="contained" onClick={handleReviewUpdate}>編集する</Button>
              <Button variant="contained" onClick={handleClose} style={{ marginLeft: '1rem' }}>キャンセル</Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};

export default ReviewEditForm;