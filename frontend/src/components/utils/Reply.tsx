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

  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editedReplyText, setEditedReplyText] = useState('');
  const [editingReplyIds, setEditingReplyIds] = useState([]); // 編集中のリプライIDの配列
  const [editedReplyTexts, setEditedReplyTexts] = useState({});


  const enableEditing = (replyId, replyText) => {
    if (!editingReplyIds.includes(replyId)) {
      setEditingReplyIds([...editingReplyIds, replyId]);
      setEditedReplyTexts({ ...editedReplyTexts, [replyId]: replyText });
    }
  };

  // 編集モードを無効化する関数
  const disableEditing = (replyId) => {
    setEditingReplyIds(editingReplyIds.filter(id => id !== replyId));
  };

  const isEditing = (replyId) => editingReplyIds.includes(replyId);


  const handleSaveReview = (replyId) => {
    client.put(`/replies/${replyId}`, { reply: editedReplyTexts[replyId] },
    { headers: getAuthHeaders() })
    .then(response => {
      console.log('Rating data sent successfully:', response.data);
    })
    .catch(error => {
      console.error('Error sending rating data:', error);
    });
    setEditingReplyId(null)
  };

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
              {isEditing(reply.replyId) ? (
                <div>
                  <textarea
                    value={editedReplyTexts[reply.replyId] || ''}
                    onChange={e => {
                      // 編集中のリプライテキストを更新
                      setEditedReplyTexts({
                        ...editedReplyTexts,
                        [reply.replyId]: e.target.value
                      });
                    }}
                  />
                  <button onClick={() => handleSaveReview(reply.replyId)}>
                    保存
                  </button>
                  <button onClick={() => {
                    disableEditing(reply.replyId); // キャンセル時に編集モードを無効化
                  }}>
                    キャンセル
                  </button>
                </div>
              ) : (
                <div>
                  <div>
                    <Link to={`/userpage/${reply.userId}`}>
                      <Avatar
                        name={reply.userName}
                        size="40"
                        round={true}
                        src={reply.iconPath}
                      />
                      <span style={{ marginLeft: '10px' }}>{reply.userName}</span>
                    </Link>
                  </div>
                  <div>
                    <span>Created At: {reply.createdAt}</span>
                  </div>
                  <div>
                    <p>{reply.reply}</p>
                    <button onClick={() => {
                      enableEditing(reply.replyId, reply.reply); // 編集ボタンをクリックして編集モードを有効化
                      setEditedReplyText(reply.reply); // 編集モードでテキストを表示
                    }}>
                      編集
                    </button>
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}
        <button onClick={loadMore}>Load More</button>
      </ul>
    </div>
  );
};

