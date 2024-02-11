import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Modal from 'react-modal';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';

const HamburgerMenu = () => {
  const Id = useParams()
  const postId = {
    postId: Id.postId,
  };
  const [menuVisible, setMenuVisible] = useState(false);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleDelete = () => {
    client.delete(`/posts/${postId}`, { headers: getAuthHeaders() })
      .then(response => {
        console.log('削除が成功しました', response);
        handleClose();
        navigate('/');
      })
      .catch(error => {
        console.error('削除中にエラーが発生しました', error);
        handleClose();
      });
  };

  return (
    <div>
      <Link to={`/article/${postId}/likes`}>いいねしたユーザー</Link>
      <button onClick={toggleMenu}>メニューを表示</button>
      {menuVisible && (
        <div className="menu">
          <Link to={`/article/${postId}/edit`}><button>編集</button></Link>
          <button onClick={handleShow}>削除</button>
          <Modal isOpen={show} onRequestClose={handleClose} contentLabel="削除の確認">
            <h2>削除の確認</h2>
            <p>本当に削除してもよろしいですか？</p>
            <button onClick={handleDelete}>削除</button>
            <button onClick={handleClose}>中止</button>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;