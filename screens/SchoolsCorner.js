import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Navbar from './Navbar';
import api from './api';
import { AuthContext } from './AuthContext';
import { Ionicons } from '@expo/vector-icons';

const SchoolsCorner = () => {
  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const navigation = useNavigation();
  const { authToken, loading, error, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await api.get('schools');
        console.log('API Response:', response.data);
        
        const schoolsData = response.data.schools || [];
        setSchools(schoolsData);
      } catch (error) {
        console.error('Error fetching schools:', error);
        Alert.alert('Error', 'Failed to fetch schools data.');
        if (error.response && error.response.status === 401) {
          Alert.alert('Session Expired', 'Please log in again.');
          logout();
        }
      } finally {
        setLoadingSchools(false);
      }
    };

    if (authToken) {
      fetchSchools();
    } else {
      setLoadingSchools(false);
    }
  }, [authToken]);

  if (loading || loadingSchools) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Schools Corner</Text>
          <TouchableOpacity style={styles.addSchoolButton} onPress={() => navigation.navigate('AddSchool')}>
            <Text style={styles.addSchoolButtonText}>Add Your School</Text>
          </TouchableOpacity>
        </View>

        {schools.map((school) => (
          <View key={school.id} style={styles.schoolCard}>
            <Image
              source={{ uri: `http://192.168.12.117:8000/api/storage/${school.thumbnail}` }}
              style={styles.schoolImage}
            />
            <View style={styles.schoolContent}>
              <Text style={styles.schoolName}>{school.name}</Text>
              <Text style={styles.schoolDescription}>{school.description.slice(0, 100)}...</Text>
              <TouchableOpacity
                style={styles.learnMoreButton}
                onPress={() => navigation.navigate('SchoolDetails', { slug: school.slug })}
              >
                <Ionicons name="information-circle" size={24} color="#fff" />
                <Text style={styles.learnMoreButtonText}>Learn More</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  content: {
    padding: 16,
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  addSchoolButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  addSchoolButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  schoolCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    marginBottom: 16,
    overflow: 'hidden',
    width: '100%',
  },
  schoolImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  schoolContent: {
    padding: 16,
  },
  schoolName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  schoolDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the content horizontally
    backgroundColor: '#008080',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  learnMoreButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SchoolsCorner;
