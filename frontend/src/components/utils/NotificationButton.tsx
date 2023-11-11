// NotificationButton.tsx

import React, { useState } from "react";
import Notifications from "./Notification";

const NotificationButton: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setShowNotifications(!showNotifications)}>
        通知
      </button>
      {showNotifications && <Notifications />}
    </div>
  );
};

export default NotificationButton;