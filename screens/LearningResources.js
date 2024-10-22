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
  
  // Assuming you want to use the seller information directly from the user object
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        if (!authToken) {
          Alert.alert('Authentication Error', 'No authentication token found. Please log in.');
          navigation.navigate('Login');
          return;
        }

        const response = await api.get('/learning-resources');
        console.log(response.data); // Log the response to check the seller structure

        if (response.data.resources && Array.isArray(response.data.resources)) {
          setResources(response.data.resources);
          setFilteredResources(response.data.resources);
          setSeller(response.data.user); // Store the seller's information here
        } else {
          Alert.alert('Error', 'Failed to load resources.');
          setResources([]);
          setFilteredResources([]);
        }
      } catch (error) {
        console.error('Fetch Resources Error:', error);
        if (error.response) {
          if (error.response.status === 401) {
            Alert.alert('Unauthorized', 'Please log in again.');
            logout();
            navigation.navigate('Login');
          } else {
            Alert.alert('Error', 'An error occurred while fetching resources.');
          }
        } else {
          Alert.alert('Error', 'Network error occurred.');
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

  const handleCall = (phoneNumber) => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Phone number not available.');
      return;
    }
    let phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl).catch((err) => console.error('Error initiating phone call:', err));
  };

  const handleWhatsApp = (whatsappNumber) => {
    if (!whatsappNumber) {
      Alert.alert('Error', 'WhatsApp number not available.');
      return;
    }
    let whatsappUrl = `whatsapp://send?phone=${whatsappNumber}`;
    Linking.openURL(whatsappUrl).catch((err) => console.error('Error initiating WhatsApp chat:', err));
  };

  const handleEmail = (email) => {
    if (!email) {
      Alert.alert('Error', 'Email address not available.');
      return;
    }
    let emailUrl = `mailto:${email}`;
    Linking.openURL(emailUrl).catch((err) => console.error('Error initiating email:', err));
  };

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Tbooke Shop</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Form')} style={styles.sellButton}>
            <Text style={styles.sellButtonText}>Sell on Tbooke</Text>
          </TouchableOpacity>
          {authToken && (
            <TouchableOpacity onPress={() => navigation.navigate('MyResources')} style={styles.myResourcesButton}>
              <Text style={styles.myResourcesButtonText}>My Resources</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search Items"
            value={searchInput}
            onChangeText={setSearchInput}
          />
        </View>

        <View style={styles.resourcesContainer}>
          {Array.isArray(filteredResources) && filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <View key={resource.id} style={styles.card}>
                <TouchableOpacity onPress={() => navigation.navigate('ResourceDetail', { slug: resource.slug })}>
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
                <View style={styles.cardHeader}>
                  <Text style={styles.sellerName}>
                    Seller: {seller && seller.first_name ? 
                    `${seller.first_name} ${seller.surname || ''}`.trim() : 'No Seller'}
                  </Text>
                  <Text style={styles.resourceTitle}>{resource.item_name}</Text>
                  <Text style={styles.resourcePrice}>Price: KES {Number(resource.item_price).toLocaleString()}</Text>
                </View>
                <View style={styles.cardBody}>
                  <Text>
                    {resource.description ? `${resource.description.slice(0, 50)}...` : 'No description available.'}
                  </Text>
                  <View style={styles.contactButtonContainer}>
                    <TouchableOpacity style={styles.contactButton}>
                      <Text style={styles.contactButtonText}>Contact Seller</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.sellerContact}>
                    <TouchableOpacity onPress={() => handleCall(resource.contact_phone)} style={styles.iconButton}>
                      <Ionicons name="call" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleWhatsApp(resource.whatsapp_number)} style={styles.iconButton}>
                      <Ionicons name="logo-whatsapp" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleEmail(resource.contact_email)} style={styles.iconButton}>
                      <Ionicons name="mail" size={24} color="white" />
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
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  sellButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
  },
  sellButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  myResourcesButton: {
    backgroundColor: '#17a2b8',
    padding: 12,
    borderRadius: 5,
  },
  myResourcesButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    padding: 12,
  },
  resourcesContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginVertical: 8,
    elevation: 3,
    padding: 16,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 5,
  },
  cardHeader: {
    marginVertical: 8,
  },
  sellerName: {
    fontWeight: 'bold',
  },
  resourceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resourcePrice: {
    fontSize: 16,
    color: '#28a745',
  },
  cardBody: {
    marginTop: 8,
  },
  contactButtonContainer: {
    marginVertical: 8,
  },
  contactButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  contactButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sellerContact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  iconButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  noResourcesText: {
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default LearningResources;
