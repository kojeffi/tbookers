import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  Alert,
  RefreshControl,
  Animated
} from 'react-native';
import Navbar from './Navbar'; // Custom Navbar component
import api from './api'; // Import your API instance
import { AuthContext } from './AuthContext'; // Import AuthContext
import Icon from 'react-native-vector-icons/Ionicons'; // Importing Ionicons for icons

const LiveClasses = ({ navigation }) => {
  const { authToken, userId } = useContext(AuthContext); // Ensure userId is available
  const [creatorClasses, setCreatorClasses] = useState([]);
  const [otherClasses, setOtherClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0]; // Initial opacity value

  // Fetch data from API
  const fetchClasses = async () => {
    try {
      const response = await api.get('/live-classes', {
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the auth token
        },
      });

      // Log the full response for debugging
      console.log('API Response:', response.data);

      // Set classes using correct keys
      setCreatorClasses(response.data.creator_classes || []);
      setOtherClasses(response.data.other_classes || []);
    } catch (error) {
      console.error('Error fetching classes:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to fetch classes. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      // Start fade-in animation after loading
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [authToken]);

  // Handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchClasses();
  };

  const handleDelete = (slug) => {
    Alert.alert(
      'Confirm Delete',
      "You won't be able to revert this!",
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, delete it!', onPress: () => deleteClass(slug) },
      ],
      { cancelable: false }
    );
  };

  const deleteClass = async (slug) => {
    try {
      await api.delete(`/live-classes/${slug}`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the auth token
        },
      });
      // Update the class lists after deletion
      setCreatorClasses(prev => prev.filter(cls => cls.slug !== slug));
      setOtherClasses(prev => prev.filter(cls => cls.slug !== slug));
      Alert.alert('Success', 'Class deleted successfully.');
    } catch (error) {
      console.error('Error deleting class:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to delete class. Please try again.');
    }
  };

  const handleRegister = async (classId) => {
    try {
      await api.post(`/live-classes/${classId}/register`, {}, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the auth token
        },
      });
      Alert.alert('Success', 'Registered for the class successfully.');
      // Optionally, update UI or refetch classes
      fetchClasses();
    } catch (error) {
      console.error('Error registering for class:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to register for the class. Please try again.');
    }
  };

  // Determine if the class is created by the authenticated user
  const isCreator = (item) => item.user_id === userId;

  // Helper function to determine class status based on current date and time
  const getClassStatus = (classDate, classTime) => {
    const now = new Date();
    const classDateTime = new Date(`${classDate}T${classTime}`);

    if (now < classDateTime) {
      return { text: 'Upcoming', color: '#1E90FF' }; // DodgerBlue
    } else if (now >= classDateTime && now < new Date(classDateTime.getTime() + 2 * 60 * 60 * 1000)) { // Assuming duration is 2 hours
      return { text: 'Active', color: '#32CD32' }; // LimeGreen
    } else {
      return { text: 'Completed', color: '#A9A9A9' }; // DarkGray
    }
  };

  const renderClassItem = ({ item }) => {
    const status = getClassStatus(item.class_date, item.class_time);

    return (
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <View style={styles.cardContent}>
          <Text style={styles.className} numberOfLines={1}>{item.class_name}</Text>
          <Text style={styles.classDetail}><Icon name="pricetag-outline" size={16} color="#555" /> {item.class_category}</Text>
          <Text style={styles.classDetail}><Icon name="calendar-outline" size={16} color="#555" /> {new Date(item.class_date).toLocaleDateString()}</Text>
          <Text style={styles.classDetail}><Icon name="time-outline" size={16} color="#555" /> {new Date(item.class_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          <Text style={styles.classDetail}><Icon name="people-outline" size={16} color="#555" /> {item.registration_count} Registered</Text>
          <View style={styles.statusContainer}>
            <Icon name="information-circle-outline" size={16} color="#555" />
            <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
              <Text style={styles.statusText}>{status.text}</Text>
            </View>
          </View>
          <View style={styles.actions}>
            {isCreator(item) ? (
              <>
                <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditClass', { id: item.id })}>
                  <Icon name="create-outline" size={18} color="#fff" />
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.slug)}>
                  <Icon name="trash-outline" size={18} color="#fff" />
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.registerButton} onPress={() => handleRegister(item.id)}>
                <Icon name="person-add-outline" size={18} color="#fff" />
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.viewButton} onPress={() => navigation.navigate('ShowLive', { id: item.id })}>
              <Icon name="eye-outline" size={18} color="#fff" />
              <Text style={styles.buttonText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
      <View style={styles.mainContent}>
        <Text style={styles.header}>Your Classes</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#1E90FF" />
        ) : (
          <>
            {creatorClasses.length === 0 ? (
              <Text style={styles.emptyText}>No creator classes available.</Text>
            ) : (
              <FlatList
                data={creatorClasses}
                renderItem={renderClassItem}
                keyExtractor={item => item.slug} // Use slug as key
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1E90FF']} />
                }
                contentContainerStyle={styles.listContainer}
              />
            )}
            <Text style={styles.header}>Other Classes</Text>
            {otherClasses.length === 0 ? (
              <Text style={styles.emptyText}>No other classes available.</Text>
            ) : (
              <FlatList
                data={otherClasses}
                renderItem={renderClassItem}
                keyExtractor={item => item.slug} // Use slug as key
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1E90FF']} />
                }
                contentContainerStyle={styles.listContainer}
              />
            )}
          </>
        )}
      </View>
    </View>
  );
};

// Enhanced Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Light background
  },
  mainContent: {
    padding: 20,
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    marginTop: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginVertical: 30,
  },
  listContainer: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 15,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // Elevation for Android
    elevation: 8,
  },
  cardContent: {
    flexDirection: 'column',
  },
  className: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 12,
  },
  classDetail: {
    fontSize: 15,
    color: '#555',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontWeight: '600',
    color: '#333',
    marginLeft: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginRight: 10,
    marginBottom: 10,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4C4C',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginRight: 10,
    marginBottom: 10,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#32CD32',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginRight: 10,
    marginBottom: 10,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14,
    marginLeft: 5,
  },
});

export default LiveClasses;
