class Batch::NotificationDelete
  
  def self.notification_delete
    notifications = Notification.where('created_at < ?', 1.minute.ago)
    notifications.destroy_all
  end
end
