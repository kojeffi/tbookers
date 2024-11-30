import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Navbar from './Navbar';
import api from './api'; // Axios instance with interceptor
import { AuthContext } from './AuthContext';
import { Ionicons } from '@expo/vector-icons';

const LearningResources = ({ navigation }) => {
  const [resources, setResources] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredResources, setFilteredResources] = useState([]);
  const { authToken, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        if (!authToken) {
          Alert.alert('Authentication Error', 'Please log in.');
          navigation.navigate('Login');
          return;
        }

        const response = await api.get('/learning-resources');
        if (response.data.resources) {
          setResources(response.data.resources);
          setFilteredResources(response.data.resources);
        } else {
          setResources([]);
          setFilteredResources([]);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          Alert.alert('Unauthorized', 'Please log in again.');
          logout();
          navigation.navigate('Login');
        } else {
          Alert.alert('Error', 'Failed to fetch resources.');
        }
      }
    };

    fetchResources();
  }, [authToken]);

  useEffect(() => {
    const filtered = resources.filter((resource) =>
      resource.item_name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredResources(filtered);
  }, [searchInput, resources]);

  const handleContact = (type, value) => {
    if (!value) {
      Alert.alert('Error', `${type} not available.`);
      return;
    }
    const url =
      type === 'phone'
        ? `tel:${value}`
        : type === 'whatsapp'
        ? `whatsapp://send?phone=${value}`
        : `mailto:${value}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', `Unable to open ${type}.`)
    );
  };

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
      <ScrollView>
        {/* <View style={styles.header}>
          <Text style={styles.title}>Learning Resources</Text>
        </View> */}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Form')}
            style={styles.sellButton}
          >
            <Text style={styles.sellButtonText}>Sell on Tbooke</Text>
          </TouchableOpacity>
          {authToken && (
            <TouchableOpacity
              onPress={() => navigation.navigate('MyResources')}
              style={styles.myResourcesButton}
            >
              <Text style={styles.myResourcesButtonText}>My Resources</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search resources..."
            value={searchInput}
            onChangeText={setSearchInput}
          />
        </View>

        {/* Resources */}
        <View style={styles.resourcesContainer}>
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <View key={resource.id} style={styles.card}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ResourceDetail', { slug: resource.slug })
                  }
                >
                  <Image
                    source={{
                      uri: resource.item_thumbnail
                        ? `https://tbooke.net/storage/${resource.item_thumbnail}`
                        : './../assets/images/group.png',
                    }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                <View style={styles.cardContent}>
                  <Text style={styles.resourceTitle}>{resource.item_name}</Text>
                  <Text style={styles.resourcePrice}>
                    Price: KES {Number(resource.item_price).toLocaleString()}
                  </Text>
                  <Text style={styles.sellerName}>
                    Seller: {resource.user
                      ? resource.user.institutionDetails
                        ? resource.user.institutionDetails.institution_name
                        : `${resource.user.first_name} ${resource.user.surname}`
                      : 'Unknown'}
                  </Text>
                  <Text style={styles.description}>
                    {resource.description
                      ? `${resource.description.slice(0, 50)}...`
                      : 'No description available.'}
                  </Text>
                  <View style={styles.contactIcons}>
                    <TouchableOpacity
                      onPress={() => handleContact('phone', resource.contact_phone)}
                      style={[styles.iconButton, { backgroundColor: '#28a745' }]}
                    >
                      <Ionicons name="call" size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        handleContact('whatsapp', resource.whatsapp_number)
                      }
                      style={[styles.iconButton, { backgroundColor: '#25D366' }]}
                    >
                      <Ionicons name="logo-whatsapp" size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleContact('email', resource.contact_email)}
                      style={[styles.iconButton, { backgroundColor: '#007BFF' }]}
                    >
                      <Ionicons name="mail" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noResourcesText}>No resources available.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    marginVertical: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  sellButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  sellButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  myResourcesButton: {
    backgroundColor: '#6C757D',
    paddingVertical: 8,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  myResourcesButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  resourcesContainer: {
    // Removed padding for full-width cards
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    width: '100%', // Full width
    overflow: 'hidden',
  },
  image: {
    width: '100%', // Full width
    height: 200, // Larger height for better display
  },
  cardContent: {
    padding: 12,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  resourcePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 5,
  },
  sellerName: {
    fontSize: 16,
    // color: '#6c757d',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  contactIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    borderRadius: 50,
    padding: 10,
  },
  noResourcesText: {
    textAlign: 'center',
    color: '#6c757d',
    marginTop: 20,
  },
});

export default LearningResources;
