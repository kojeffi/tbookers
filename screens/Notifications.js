import React, { useState, useEffect, useContext } from 'react'; 
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import Navbar from './Navbar'; 
import api from './api'; 
import { AuthContext } from './AuthContext'; 

const Notifications = ({ navigation }) => {
  const { authToken, updateNotificationCount } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications'); // Ensure this API endpoint is correct
        console.log('Notifications fetched:', response.data);

        if (Array.isArray(response.data.notifications) && response.data.notifications.length > 0) {
          setNotifications(response.data.notifications);
          updateNotificationCount(response.data.notifications.length);
        } else {
          console.log('No notifications available.');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markNotificationAsRead = async (id) => {
    try {
      await api.post('/notifications/read', { id }); // API call to mark notification as read
      console.log(`Notification ${id} marked as read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Confirm Delete',
      "You won't be able to revert this!",
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, delete it!', onPress: () => deleteNotification(id) },
      ],
      { cancelable: false }
    );
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`); // Ensure this endpoint matches your Laravel API
      setNotifications(prevNotifications => prevNotifications.filter(notification => notification.id !== id));
      updateNotificationCount(notifications.length - 1);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <TouchableOpacity onPress={() => {
        markNotificationAsRead(item.id); // Mark as read when pressed
        // Navigate to the corresponding screen (e.g., profile)
      }}>
        <View style={styles.notificationContent}>
          <Image
            source={{ uri: item.sender.profile_picture ? `http://192.168.12.117:8000/storage/${item.sender.profile_picture}` : 'https://yourapi.com/default-images/avatar.png' }}
            style={styles.profileImage}
          />
          <Text>{item.sender.first_name} {item.sender.surname}</Text>
          <Text style={styles.notificationText}>has connected with you.</Text>
          <Text style={styles.timestamp}>{item.created_at}</Text>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Text style={styles.deleteButton}>Delete</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
      <View style={styles.mainContent}>
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <>
            {notifications.length > 0 ? (
              <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
              />
            ) : (
              <View style={styles.noNotifications}>
                <Text style={styles.noNotificationsText}>You have no notifications.</Text>
                <Text style={styles.noNotificationsSubText}>Check back later for updates!</Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mainContent: {
    padding: 10,
  },
  notificationItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  notificationText: {
    marginLeft: 10,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  deleteButton: {
    color: '#dc3545',
    marginLeft: 'auto',
  },
  noNotifications: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noNotificationsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  noNotificationsSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default Notifications;
