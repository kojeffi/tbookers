import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import Navbar from './Navbar'; // Importing the Navbar component
import api from './api';
import { AuthContext } from './AuthContext';

const MyResources = ({navigation}) => {
  const { authToken, user, logout } = useContext(AuthContext); // Ensure user info is available
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authToken) {
      fetchResources();
    }
  }, [authToken]);

  const fetchResources = async () => {
    try {
      const response = await api.get('/learning-resources');
      if (response.data && Array.isArray(response.data.resources)) {
        setResources(response.data.resources);
      } else {
        setError('Invalid data structure. Expected an array of resources.');
      }
    } catch (e) {
      console.error('Error fetching resources', e);
      setError('Failed to load resources.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Resource",
      "Are you sure you want to delete this resource?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await api.delete(`/learning-resources/seller/delete/${id}`);
              setResources(resources.filter(resource => resource.id !== id));
            } catch (e) {
              console.error('Error deleting resource', e);
              Alert.alert('Error', 'Failed to delete resource.');
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.resourceRow}>
      <TouchableOpacity onPress={() => console.log(`Navigate to /learning-resources/${item.slug}`)}>
        <Text style={styles.itemTitle}>{item.item_name}</Text>
      </TouchableOpacity>
      <Text style={styles.itemDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
      <View style={styles.itemButtons}>
      <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => navigation.navigate('EditResource', { resourceId: item.id, resourceDetails: item })} // Pass full resource details
        >
            <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        
        {/* <TouchableOpacity style={styles.editButton} onPress={() => console.log(`Navigate to /learning-resources/edit-resource/${item.id}`)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Adding the Navbar at the top */}
      <Navbar />
      <View style={styles.content}>
        <Text style={styles.pageTitle}>My Resources</Text>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>My Resource</Text>
          <Text style={styles.headerText}>Date</Text>
          <Text style={styles.headerText}>Action</Text>
        </View>
        
        {/* FlatList for Resources */}
        <FlatList
          data={resources}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyMessage}>No resources found.</Text>}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Light background for a clean look
  },
  content: {
    padding: 20,
    flex: 1,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#6200ea',
    backgroundColor: '#e0e0e0', // Light gray background for header
    borderRadius: 8,
    marginBottom: 10,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  resourceRow: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  itemDate: {
    flex: 1,
    color: '#888',
    textAlign: 'center',
  },
  itemButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#6200ea',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 18,
  },
});

export default MyResources;
