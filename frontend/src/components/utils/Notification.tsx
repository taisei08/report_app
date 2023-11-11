// Notifications.tsx

import React, { useState, useEffect } from "react";
import client from "lib/api/client";
import { getAuthHeaders } from "lib/api/auth";
import Avatar from "react-avatar";

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // 通知の取得処理
    const fetchNotifications = async () => {
      try {
        const response = await client.get("/notifications", {headers: getAuthHeaders()}); // サーバーサイドのエンドポイントに変更
        console.log(response.data)
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

    // getNotificationMessage 関数の定義
  const getNotificationMessage = (notification) => {
    switch (notification.action) {
      case 'review':
        return `${notification.accountName} さんがあなたの投稿: ${notification.title} にレビューしました`;
      case 'follow':
        return `${notification.accountName} さんがあなたをフォローしました`;
      case 'like':
        // action が like の場合、追加の判定を行いメッセージを生成
        if (notification.postId && !notification.reviewId && !notification.replyId) {
          return `${notification.accountName} さんがあなたの投稿: ${notification.title} をいいねしました`;
        } else if (notification.reviewId) {
          return `${notification.accountName} さんがあなたのレビューにいいねしました`;
        } else if (notification.replyId) {
          return `${notification.accountName} さんがあなたのリプライにいいねしました`;
        } else {
          return '不明なアクション';
        }
      default:
        return '不明なアクション';
    }
  };


  return (
<div style={{
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "#fff",
  border: "2px solid #000",   // 枠を太くしました
  padding: "20px",           // 余白を増やしました
  boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",  // 影を少し強くしました
  width: "400px",            // 幅を広くしました
  maxHeight: "500px",        // 高さの最大値を設定
  overflowY: "auto",         // 縦方向にスクロール可能にしました
  fontSize: "14px",          // 文字サイズを小さくしました
  color: "#333",             // 文字色を濃い灰色に変更
  zIndex: 1000,               // 追加：他の要素よりも前面に表示
}}>
  <h3 style={{ marginBottom: "15px" }}>通知</h3>
  {notifications.map((notification, index) => (
    <div key={index} style={{ marginBottom: "10px", borderBottom: "1px solid #ccc", paddingBottom: "10px", display: "flex", alignItems: "center" }}>
      <Avatar
        name={notification.accountName}
        size="40"
        round={true}
        src={notification.iconPath}
        style={{ marginRight: "10px" }}
      />
      {getNotificationMessage(notification)}
    </div>
  ))}
</div>



  );
};

export default Notifications;
