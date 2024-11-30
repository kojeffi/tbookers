import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from './api';
import { AuthContext } from './AuthContext';
import { Ionicons } from '@expo/vector-icons';
import Navbar from './Navbar';



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
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.addSchoolButton} onPress={() => navigation.navigate('AddSchool')}>
              <Text style={styles.addSchoolButtonText}>Add School</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.addSchoolButton, styles.mySchoolsButton]} 
              onPress={() => navigation.navigate('MySchools', { username: authToken.username })}>
              <Text style={styles.addSchoolButtonText}>My Schools</Text>
            </TouchableOpacity>
          </View>
        </View>

        {schools.map((school) => (
          <View key={school.id} style={styles.schoolCard}>
            <Image
              source={{ uri: `https://tbooke.net/storage/${school.thumbnail}` }}
              style={styles.schoolImage}
            />
            <View style={styles.schoolHeader}>
              <Text style={styles.schoolName}>{school.name}</Text>
            </View>
            <View style={styles.schoolBody}>
              <Text style={styles.schoolDescription}>{school.description.slice(0, 100)}...</Text>
              <TouchableOpacity
                style={styles.learnMoreButton}
                onPress={() => navigation.navigate('SchoolDetails', { slug: school.slug })}
              >
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
    fontSize: 16,
  },
  content: {
    padding: 16,
    alignItems: 'center',
  },
  headerContainer: {
    marginBottom: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addSchoolButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  mySchoolsButton: {
    backgroundColor: '#6c757d',
  },
  addSchoolButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  schoolCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    marginBottom: 16,
    overflow: 'hidden',
    width: '100%', // Each card takes full width
  },
  schoolImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  schoolHeader: {
    padding: 16,
  },
  schoolName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  schoolBody: {
    padding: 16,
  },
  schoolDescription: {
    fontSize: 12,
    color: '#555',
    marginBottom: 8,
  },
  learnMoreButton: {
    backgroundColor: '#008080',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  learnMoreButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default SchoolsCorner;
