import React, { useEffect, useRef } from 'react';
import { Box, Container, Button } from '@material-ui/core';
import ReplyItem from './ReplyItem';
import { Reply } from 'interfaces';

interface Props {
  currentUserId: number;
  allReplies: Reply[];
  currentPage: number;
  moreReplies: boolean;
  fetchData: (shouldIncrementPage?: boolean) => Promise<void>;
  loadMore: () => void;
  setReplyLength: React.Dispatch<React.SetStateAction<number>>;
}

const ReplyList: React.FC<Props> = ({ currentUserId, allReplies, currentPage, moreReplies, fetchData, loadMore, setReplyLength }) => {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  return (
    <Box {...{ ref: boxRef }} >
      {allReplies.length === 0 ? null : (
        <>
          {allReplies.map(reply => (
            <ReplyItem key={reply.replyId} reply={reply} currentUserId={currentUserId} setReplyLength={setReplyLength}/>
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
