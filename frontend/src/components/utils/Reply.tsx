import { useState, useEffect } from 'react';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';

// 返信フォームコンポーネント
export const ReplyForm = (props) => {
  const [replyText, setReplyText] = useState('');

  const handleReplySubmit = () => {
    // 返信を送信
    client.post('/replies', { reviewId: props.id, reply: replyText },
    { headers: getAuthHeaders() })
    .then(response => {
      console.log('Reply data sent successfully:', response.data);
    })
    .catch(error => {
      console.error('Error sending rating data:', error);
    });
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
export const ReplyList = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // 総ページ数
  const [replies, setReplies] = useState([]);
  console.log(props.id)

  useEffect(() => {
    // データを取得するための関数
    const fetchData = async () => {
      try {
        const [response, response1] = await Promise.all([
          client.get(`/replies?page=${currentPage}`, { params: {reviewId: props.id} }),
          client.get('/reply_counts', { params: {reviewId: props.id} }),
        ]);
        console.log("Response from server:", response1.data.length);
        const tempdata = response.data.replies
        const totalItemCount = response1.data.length
        console.log(tempdata)
        console.log(totalItemCount)
        setReplies(prevReplies => [...prevReplies, ...tempdata]);
        const pageSize = 10; // ページあたりのアイテム数
        const pages = Math.ceil(totalItemCount / pageSize); // 総ページ数を計算
        setTotalPages(pages);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // fetchData関数を呼び出し

  }, [currentPage]); // useEffectがマウント時に一度だけ実行されるように空の依存リストを指定

  const loadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      <ul>
        {replies.map(reply => (
          <li key={reply.replyId}>
              <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                <div>
                <Link
                to={`/userpage/${reply.userId}`}
                >
                  <Avatar
                  name={reply.userName}
                  size="40"
                  round={true}
                  src={reply.iconPath}
                  /> {/* Avatar コンポーネント */}
                  <span style={{ marginLeft: '10px' }}>{reply.userName}</span> {/* ユーザー名 */}
                  </Link>
                </div>
                <div>
                  <span>Created At: {reply.createdAt}</span> {/* 最終更新日 */}
                </div>
                <div>
                  <p>{reply.reply}</p>
                </div>
              </div>
          </li>
        ))}
        <button onClick={loadMore}>Load More</button>
      </ul>
      </div>
      );
};

