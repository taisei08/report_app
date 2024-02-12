import { useState } from 'react';
import Rating from '@material-ui/lab/Rating';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { blue } from '@material-ui/core/colors';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';
import AlertMessage from 'components/utils/error/AlertMessage';
import { useFormState } from "../../utils/error/useFormState";

interface Props {
  postId: number;
  initialRating: number;
  readOnly?: boolean;
}

const CustomRating: React.FC<Props> = ({ postId, initialRating = 0, readOnly = false }) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [formState, setFormState] = useFormState();

  const handleRatingChange: (e: React.ChangeEvent<{}>, newValue: number | null) => void = (e, newValue) => {
    try {
      setFormState({ alertMessageOpen: false });
      if (newValue === null) return;
      setRating(newValue);  
      client
      .post('/ratings', { postId: postId, value: newValue }, { headers: getAuthHeaders() })
      setFormState({ alertSeverity: 'success', alertMessage: '評価の更新に成功しました' });
      console.log('Rating data sent successfully:');
    } catch (error) {
      setFormState({ alertSeverity: 'error', alertMessage: '評価の更新に失敗しました' });
      console.error('Error setting rating:', error);
    } finally {
      setFormState({ alertMessageOpen: true });
    }
  };
  

  return (
    <>
      <Rating
        name={`rating-${postId}`}
        value={rating}
        onChange={handleRatingChange}
        precision={0.5}
        emptyIcon={<StarBorderIcon style={{ color: blue[500], fontSize: 30 }} />}
        icon={<StarIcon style={{ color: blue[500], fontSize: 30 }} />}
        readOnly={readOnly}
      />
      {formState.alertSeverity && (
        <AlertMessage
          open={formState.alertMessageOpen}
          setOpen={(isOpen: boolean) => setFormState({ alertMessageOpen: isOpen })}
          severity={formState.alertSeverity}
          message={formState.alertMessage}
        />
      )}
    </>
  );
};

export default CustomRating;
