import { useState } from 'react';


// 返信フォームコンポーネント
export const ReplyForm = () => {
  const [replyText, setReplyText] = useState('');

  const handleReplySubmit = () => {
    // 返信を送信
    setReplyText('');
  };

  return (
    <div>
      <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} />
      <button onClick={handleReplySubmit}>送信</button>
    </div>
  );
};

// リプライリストコンポーネント
export const ReplyList = ({ replies }) => {
  return (
    <div>
      {replies.map((reply, index) => (
        <div key={index} style={{ border: '1px solid #000', padding: '10px', marginBottom: '10px' }}>
          {/* リプライの内容を表示 */}
          <p>{reply}</p>
        </div>
      ))}
    </div>
  );
};

