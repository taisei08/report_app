import { useState, useEffect, useContext} from 'react';
import { PostIdContext } from 'App';
import client from 'lib/api/client';
import { Link, useLocation } from 'react-router-dom';
import Avatar from 'react-avatar';
import Rating from 'react-rating';
import ReactPaginate from 'react-paginate';
import { ReviewLists } from 'interfaces';


const ReviewList = (props) => {
  const [reviews, setReviews] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [allReviews, setAllReviews] = useState<ReviewLists[]>([]);
  const { sendPostId, setSendPostId } = useContext(PostIdContext);
  const [totalPages, setTotalPages] = useState(0); // 総ページ数
  const location = useLocation();


  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        // ユーザーデータをAPIから取得
        const [response, response1] = await Promise.all([
          client.get(`/reviews_by_user?page=${currentPage}`, { params: {userId: props.id} }),
          client.get('/review_counts', { params: {userId: props.id} }),
        ]);
        console.log("Response from server:", response1.data.length);
        const response2 = response.data
        const response3 = response1.data
        const tempdata = response2.reviews
        console.log(tempdata)
        setReviews(tempdata); // レスポンスのデータをstateにセット
        setAllReviews(prevReviews => tempdata); // すべてのポストを更新
        const totalItemCount = response3.length; // 総件数を取得
        console.log(totalItemCount)
        const pageSize = 10; // ページあたりのアイテム数
        const pages = Math.ceil(totalItemCount / pageSize); // 総ページ数を計算
        setTotalPages(pages);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchReviewData();
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleChildLinkClick = (e) => {
    e.stopPropagation(); // 親へのイベント伝播を停止
    props.resetParentState();
    
  };

  const handlePostClick = (postId) => {
    // クリックされた投稿のIDを取り出して何かしらの処理を行う
    console.log('Clicked Post ID:', postId);
    setSendPostId(postId)
    window.location.href = `/article/${postId}`;
    // ここでサーバーサイドにデータを取りに行くなどの処理を追加可能
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  }

  return (
    <div>
    <h1>Review List</h1>
    <ul>
    {allReviews.map(review => (


          <li key={review.reviewId}>
            {/* アンカータグでリンクを作成 */}
            <Link
              to={`/article/${review.postId}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
              onClick={(e) => {
                e.preventDefault(); // リンクのデフォルトの挙動をキャンセル
                handlePostClick(review.postId);
              
              }}
            >
              <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                <div>
                <Link
                to={`/userpage/${review.userId}`}
                onClick={handleChildLinkClick}
                >
                  <Avatar
                  name={review.userName}
                  size="40"
                  round={true}
                  src={review.iconPath}
                  /> {/* Avatar コンポーネント */}
                  <span style={{ marginLeft: '10px' }}>{review.userName}</span> {/* ユーザー名 */}
                  </Link>
                </div>
                <div>
                  <span>Created At: {review.createdAt}</span> {/* 最終更新日 */}
                </div>
                <div>
                  <h3>
                    {/* リンクの中にもLinkコンポーネントを使う */}
                    <Link
                      to={`/article/${review.postId}`}
                      onClick={(e) => {
                        e.preventDefault(); // リンクのデフォルトの挙動をキャンセル
                        handlePostClick(review.postId);
                      }}
                    >
                      {review.title}
                    </Link>
                  </h3>
                  <p>{truncateText(review.review, 200)}</p>
                  <Rating readonly initialRating={review.value} fractions={2} />

                </div>
              </div>
            </Link>
          </li>
          ))}
      </ul>
        <ReactPaginate
          pageCount={totalPages} // 総ページ数を指定
          marginPagesDisplayed={1} // 前後に表示するページ数
          pageRangeDisplayed={2} // 一度に表示するページ数
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
          breakLabel='...' // ... のテキストをカスタマイズ
        />
      </div>
  );
  
};

export default ReviewList;