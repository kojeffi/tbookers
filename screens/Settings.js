import React, { useState, useEffect, useContext } from 'react'; 
import { View, Text, TextInput, Button, ScrollView, Alert, StyleSheet } from 'react-native';
import api from './api'; // Import your API instance
import { AuthContext } from './AuthContext'; // Import AuthContext

// Custom Components (Navbar, Sidebar, Footer)
import Navbar from './Navbar';
import { useNavigation } from '@react-navigation/native';

export default function SettingsPrivacyScreen() {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigation = useNavigation();
  
  const { profileData } = useContext(AuthContext); // Access profile data from context

  // Fetch user data on component mount
  useEffect(() => {
    console.log('Fetching user data...');
    const fetchUserData = async () => {
      try {
        const response = await api.get('/settings'); // Fetch user settings
        console.log('Response from API:', response.data);
        
        const userData = response.data.user; // Access the user object directly

        // Check if userData has the expected structure
        console.log('User Data:', userData);
        
        // Set state with the retrieved data
        setFirstName(userData.first_name);
        setSurname(userData.surname);
        setEmail(userData.email);
      } catch (error) {
        console.error('Error fetching user data:', error.response ? error.response.data : error);
        Alert.alert('Error', 'Could not fetch user data.');
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      await api.put('/settings', { // Use the correct API endpoint
        first_name: firstName,
        surname: surname,
        email: email,
        password: password,
      });
      Alert.alert('Success', 'Your changes have been saved.');
    } catch (error) {
      console.error('Error updating user data:', error.response ? error.response.data : error);
      Alert.alert('Error', 'Could not save changes.');
    }
  };

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
      <ScrollView>
      <View style={styles.row}>
        <ScrollView style={styles.mainContent}>
          <Text style={styles.title}>Settings & Privacy</Text>
          
          {/* Personal Information Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Personal information</Text>
            <View style={styles.cardBody}>
              {/* First Name Input */}
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter First Name"
              />

              {/* Surname Input */}
              <Text style={styles.label}>Surname</Text>
              <TextInput
                style={styles.input}
                value={surname}
                onChangeText={setSurname}
                placeholder="Enter Surname"
              />

              {/* Email (Read-only) */}
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[styles.input, { backgroundColor: '#f0f0f0' }]}
                value={email}
                editable={false}
              />

              {/* Password Input */}
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                placeholder="Enter New Password"
              />
              <Text style={styles.smallText}>Leave blank if you don't want to change your password.</Text>

              {/* Confirm Password Input */}
              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
                placeholder="Confirm New Password"
              />

              {/* Save Button */}
              <Button title="Save Changes" onPress={handleSaveChanges} />
            </View>
          </View>
          {/* Notifications Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notifications</Text>
            <View style={styles.cardBody}>
              {/* Notification settings can go here */}
            </View>
          </View>
        </ScrollView>
      </View>
      </ScrollView>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  cardBody: {
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    marginBottom: 10,
  },
  smallText: {
    fontSize: 12,
    color: '#777',
    marginBottom: 10,
  },
});
