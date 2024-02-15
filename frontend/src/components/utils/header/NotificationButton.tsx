import { useState, useEffect } from "react";
import { Notifications as NotificationIcon } from "@material-ui/icons";
import { Box } from "@material-ui/core";
import { IconButton } from "@mui/material";
import Notifications from "./notification/Notification";
import client from "lib/api/client";
import { getAuthHeaders } from "lib/api/auth";

const NotificationButton: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [isNotificationChecked, setIsNotificationChecked] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotificationChecked = async () => {
      try {
        const response = await client.get('/notifications_checked', { headers: getAuthHeaders() });
        setIsNotificationChecked(response.data.checked);

      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotificationChecked();
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <IconButton onClick={() => { setShowNotifications(!showNotifications); setIsNotificationChecked(true); }}>
        {isNotificationChecked && (<NotificationIcon style={{color: 'white'}} />)}
        {!isNotificationChecked && (
          <Box style={{ position: 'relative' }}>
            <NotificationIcon style={{ color: 'white' }} />
            <Box
              style={{
                position: 'absolute',
                top: -5,
                right: -5,
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: 'red',
              }}
            />
          </Box>
        )}
      </IconButton>
      {showNotifications && <Notifications />}
    </div>
  );
};

export default NotificationButton;