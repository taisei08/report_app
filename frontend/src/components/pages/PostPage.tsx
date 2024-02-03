import { useState, useEffect } from 'react';
import client from 'lib/api/client';
import Avatar from 'react-avatar';
import Rating from 'react-rating';
import { useParams } from 'react-router-dom';
import PdfViewer from 'components/utils/PdfViewer';
import { getAuthHeaders } from "lib/api/auth"
import { ReplyForm, ReplyList } from 'components/utils/Reply';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import FollowButton from 'components/utils/FollowButton';
import LikeButton from 'components/utils/LikeButton';

const PostPage = () => {
  const [postData, setPostData] = useState({});
  const [reviews, setReviews] = useState([]);
  const [reviewComment, setReviewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [userId, setUserId] = useState('')
  const [replyFormVisible, setReplyFormVisible] = useState({}); // レビューIDをキーとした返信フォームの表示ステート
  const [replyData, setReplyData] = useState({}); // レビューIDをキーとしたリプライデータ
  const [menuVisible, setMenuVisible] = useState(false);
  const Id = useParams()
  const postId = {
    postId: Id.postId,
  };

  const [show, setShow] = useState(false);
  const navigate = useNavigate();


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response1, response2] = await Promise.all([
          client.get('/post_detail', { params: postId }),
          client.get('/reviews', { params: postId, headers: getAuthHeaders() } ),
        ]);
    
        // レスポンスからデータを取り出す
        setPostData(response1.data.posts[0]);
        setReviews(response2.data.reviews);
        setUserId(response2.data.currentUserId);
        console.log(response2.data.reviews)

        const currentUserId = response2.data.currentUserId;
        console.log(currentUserId)
        const matchingReview = response2.data.reviews
        .find(review => review.userId === currentUserId);

        if (matchingReview) {
          setRating(matchingReview.value);
        }
        
        console.log(response2.data.reviews)

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    
    
    };

    fetchData();
  }, [postId.postId]);

  const handleRatingChange = rate => {
    setRating(rate);
    console.log(rate)

    client.post('/ratings', { postId: Id.postId, value: rate },
    { headers: getAuthHeaders() })
    .then(response => {
      console.log('Rating data sent successfully:', response.data);
    })
    .catch(error => {
      console.error('Error sending rating data:', error);
    });
  };

  const handleReviewSubmit = () => {
    client.post('/reviews', { postId: Id.postId, review: reviewComment },
    { headers: getAuthHeaders() })
    .then(response => {
      console.log('Rating data sent successfully:', response.data);
    })
    .catch(error => {
      console.error('Error sending rating data:', error);
    });
  };

  const handleDelete = () => {
    // 削除のロジック
    client.delete(`/posts/${Id.postId}`, { headers: getAuthHeaders() })
      .then(response => {
        // 削除が成功した場合の処理
        console.log('削除が成功しました', response);
        handleClose(); // モーダルを閉じる
        navigate('/');
      })
      .catch(error => {
        // エラー処理
        console.error('削除中にエラーが発生しました', error);
        handleClose(); // モーダルを閉じる
      });
  };

  // メニューの表示/非表示を切り替える関数
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleReplyForm = (reviewId) => {
    // 返信フォームの表示を切り替える
    setReplyFormVisible((prevVisible) => ({
      ...prevVisible,
      [reviewId]: !prevVisible[reviewId],
    }));
  };

  const toggleReplies = (reviewId) => {
    // リプライの表示を切り替える
    setReplyData((prevData) => ({
      ...prevData,
      [reviewId]: !prevData[reviewId],
    }));
    console.log(replyData)

  };

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedReviewText, setEditedReviewText] = useState('');

  const handleEditReview = (reviewId, reviewText) => {
    // 編集ボタンがクリックされたときの処理
    setEditingReviewId(reviewId);
    setEditedReviewText(reviewText);
  };

  const handleCancelEdit = () => {
    // キャンセルボタンがクリックされたときの処理
    setEditingReviewId(null);
  };

  const handleSaveReview = () => {
    console.log(editedReviewText)
    client.put(`/reviews/${editingReviewId}`, { review: editedReviewText },
    { headers: getAuthHeaders() })
    .then(response => {
      console.log('Rating data sent successfully:', response.data);
    })
    .catch(error => {
      console.error('Error sending rating data:', error);
    });
    setEditingReviewId(null)
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteReview = (reviewId:number) => {
    // 削除のロジック
    client.delete(`/reviews/${reviewId}`, { headers: getAuthHeaders() })
      .then(response => {
        // 削除が成功した場合の処理
        console.log('削除が成功しました', response);
        handleCloseDeleteModal(); // モーダルを閉じる
      })
      .catch(error => {
        // エラー処理
        console.error('削除中にエラーが発生しました', error);
        handleCloseDeleteModal(); // モーダルを閉じる
      });
  };

  if (postData.documentPath == undefined) {
    return null;
  }

  return (
    <div>
      <div>
        <Avatar size="50" name={postData.userName} />
        <span>{postData.uid}</span>
      </div>
      <h2>{postData.title}</h2>
      <p>Created at: {postData.createdAt}</p>
      <p>Last Updated: {postData.updatedAt}</p>
      <PdfViewer fileData={postData.documentPath.url} />
      <LikeButton
      id = {postData.postId}
      type = "post"
      />
      <div>
      <button onClick={toggleMenu}>メニューを表示</button>
      {menuVisible && (
        <div className="menu">
          <Link to={`/article/${Id.postId}/edit`}>
            <button>編集</button>
          </Link>
          <button onClick={handleShow}>削除</button>

          <Modal
        isOpen={show}
        onRequestClose={handleClose}
        contentLabel="削除の確認"
      >
        <h2>削除の確認</h2>
        <p>本当に削除してもよろしいですか？</p>
        <button onClick={handleDelete}>削除</button> 
        <button onClick={handleClose}>中止</button>
      </Modal>
        </div>
      )}
      </div>
      <Rating initialRating={rating} onChange={handleRatingChange} />
      <p>{postData.description}</p>
      {console.log(postData.userId)}
      {console.log(userId)}
      <FollowButton
      id = {postData.userId}
      selfId = {userId}
      />
      {((reviews.length === 0 || !reviews.some(review => review.userId === userId)) &&
      postData.userId !== userId) && (
        <div id="user_review">
          <textarea
            value={reviewComment}
            onChange={e => setReviewComment(e.target.value)}
          />
          <button onClick={handleReviewSubmit}>Submit Review</button>
        </div>
      )}
  
      <div>
        {reviews.map(review => (
          // 条件に基づいてレビューを表示
          review.userId === userId && (
            <div key={review.reviewId} style={{ border: '1px solid #000', padding: '10px', marginBottom: '10px' }}>
                  <Avatar
      size="30"
      name={review.userName}
      round={true}
      src={review.iconPath}
    />
    <span>
      {review.userName} {review.createdAt}
    </span>
{editingReviewId === review.reviewId ? (
  // Edit mode
  <div>
    <textarea
      value={editedReviewText}
      onChange={e => setEditedReviewText(e.target.value)}
    />
    <button onClick={() =>{
      handleSaveReview(review.reviewId)
      review.review = editedReviewText;
      }
    }>
      保存
    </button>
    <button onClick={handleCancelEdit}>
      キャンセル
    </button>
  </div>
) : (
  <div>
    <p>{review.review}</p>
    <button onClick={() =>
      handleEditReview(review.reviewId, review.review)}>
      編集
    </button>
  </div>
)
}
<div>

      {/* メニュー内の削除ボタン */}
      <button onClick={handleShowDeleteModal}>削除</button>
      {/* 削除モーダル */}
      <Modal
        isOpen={showDeleteModal}
        onRequestClose={handleCloseDeleteModal}
        contentLabel="削除の確認"
      >
        <h2>削除の確認</h2>
        <p>本当に削除してもよろしいですか？</p>
        <div>
        <button onClick={() => handleDeleteReview(review.reviewId)}>削除</button>
        </div>
        <div>
        <button onClick={handleCloseDeleteModal}>中止</button>
        </div>
      </Modal>

      {/* ... (既存のコード) */}
    </div>
<div>
<Rating readonly initialRating={review.value} fractions={2} />
{review.review !== "" && (
    <button onClick={() => toggleReplyForm(review.reviewId)}>
      {replyFormVisible[review.reviewId] ? '閉じる' : '返信'}
    </button>
    )}
</div>     

      {review.review !== "" && review.replyLength > 0 && (
      <button onClick={() => toggleReplies(review.reviewId)}>
        {replyData[review.reviewId] ? '隠す' : `${review.replyLength}件のリプライ`}
      </button>
      )}

      {replyFormVisible[review.reviewId] && (
        // 返信フォームを表示
        <ReplyForm
        id = {review.reviewId}
        />
      )}

      {replyData[review.reviewId] && (
        // リプライを表示
        <>
        <ReplyList
        id = {review.reviewId}
        />
        <ReplyForm
        id = {review.reviewId}
        />
        </>
      )}
            </div>
          )
        ))}
      </div>
      <div>
      {reviews.map(review => (
  userId !== review.userId && (
    <div key={review.reviewId} style={{ border: '1px solid #000', padding: '10px', marginBottom: '10px' }}>
      <Avatar
      size="30"
      name={review.userName}
      round={true}
      src={review.iconPath}
      />
      <span>{review.userName} {review.createdAt}</span>
      <p>{review.review}</p>
      <Rating
        readonly
        initialRating={review.value}
        fractions={2}
      />
      

      {review.review !== "" && (
      <>
      <button onClick={() => toggleReplyForm(review.reviewId)}>
        {replyFormVisible[review.reviewId] ? '閉じる' : '返信'}
      </button>
      <LikeButton
      id={review.reviewId}
      type="review"
      />
      </>
      )}

      {review.review !== "" && review.replyLength > 0 && (
      <button onClick={() => toggleReplies(review.reviewId)}>
        {replyData[review.reviewId] ? '隠す' : `${review.replyLength}件のリプライ`}
      </button>
      )}

      {replyFormVisible[review.reviewId] && (
        // 返信フォームを表示
        <ReplyForm
        id = {review.reviewId}
        />
      )}

      {replyData[review.reviewId] && (
        // リプライを表示
        <>
        <ReplyList
        id = {review.reviewId}
        />
        <ReplyForm
        id = {review.reviewId}
        />
        </>
      )}
    </div>
  )
))}
      </div>
    </div>
  );
  
};

export default PostPage;