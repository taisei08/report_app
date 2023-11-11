// Notifications.tsx

import React, { useState, useEffect } from "react";
import client from "lib/api/client";
import { getAuthHeaders } from "lib/api/auth";

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // 通知の取得処理
    const fetchNotifications = async () => {
      try {
        const response = await client.get("/notifications", {headers: getAuthHeaders()}); // サーバーサイドのエンドポイントに変更
        console.log(response.data)
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div style={{ position: "absolute", top: "10px", right: "10px", background: "#fff", border: "1px solid #ccc", padding: "10px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
      <h3>通知</h3>
      {notifications.map((notification, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          {notification.user} があなたの {notification.target} をいいねしました
        </div>
      ))}
    </div>
  );
};

export default Notifications;
