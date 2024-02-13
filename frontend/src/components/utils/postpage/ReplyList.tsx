import { useEffect, useRef } from 'react';
import { Box, Container, Button } from '@material-ui/core';
import ReplyItem from './ReplyItem';
import { Reply } from 'interfaces';
import { all } from 'axios';

interface Props {
  currentUserId: number;
  allReplies: Array<Reply>;
  currentPage: number;
  moreReplies: boolean;
  fetchData: () => Promise<void>;
  loadMore: () => void;
}

const ReplyList: React.FC<Props> = ({ currentUserId, allReplies, currentPage,
 moreReplies, fetchData, loadMore }) => {
  const boxRef = useRef<HTMLDivElement>();
  console.log(allReplies);

  useEffect(() => {

    fetchData();
  }, [currentPage]);

  return (
    <Box {...{ ref: boxRef }} >
      {allReplies.length === 0 ? (
        null
      ) : (
          <>
            {allReplies.map(reply => (
              <>
                <ReplyItem 
                  key={reply.replyId} 
                  reply={reply}
                  currentUserId={currentUserId} 
                />
              </>
            ))}
              <Container style={{ display: 'flex', justifyContent: 'center' }}>
              {moreReplies && (
                <Button onClick={loadMore} variant="contained" style={{ width: 'calc(min(600px, 90vw))', backgroundColor: 'white' }}>
                  さらに読み込む
                </Button>
                )}
              </Container>
          </>
        )}
    </Box>
  );
};

export default ReplyList;