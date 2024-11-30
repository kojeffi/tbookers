// components/ForgotPassword.js

import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { AuthContext } from './AuthContext';
import api from './api';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { authToken } = useContext(AuthContext); // If needed

  const [error, setError] = useState('');

  const handlePasswordReset = async () => {
    setError('');
    
    // Simple email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('Email is required.');
      return;
    }
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/forgot-password', { email });

      if (response.status === 200 || response.status === 201) {
        Alert.alert(
          'Success',
          'A password reset link has been sent to your email.',
          [
            { text: 'OK', onPress: () => navigation.navigate('Login') },
          ]
        );
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        // Assuming the API returns a message field
        Alert.alert('Error', err.response.data.message || 'An error occurred.');
      } else {
        Alert.alert('Error', 'Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Request New Password</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Display error message if any */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Text style={styles.label}>Enter Email</Text>
          <TextInput
            style={[
              styles.input,
              error ? styles.inputError : null
            ]}
            placeholder="Enter Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          
          {/* You can display API errors here if you have specific error handling */}

          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handlePasswordReset}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#008080', // Teal background
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 5,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    // fontFamily: 'Nunito_700Bold', // Use bold variant
    textAlign: 'center',
  },
  formContainer: {
    // Additional styling if needed
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
    // fontFamily: 'Nunito_600SemiBold',
  },
  input: {
    height: 30,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 14,
    // fontFamily: 'Nunito_400Regular',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    // fontFamily: 'Nunito_400Regular',
  },
  submitButton: {
    backgroundColor: '#800000',
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 50,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    // fontFamily: 'Nunito_700Bold',
  },
});

export default ForgotPassword;
