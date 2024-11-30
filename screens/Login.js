import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import api from './api'; // Import the API with the interceptor
import { AuthContext } from './AuthContext'; // Import the AuthContext
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Font from 'expo-font'; // Ensure fonts are loaded correctly if needed

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const { saveToken } = useContext(AuthContext); // Access the saveToken function from AuthContext

  // Handle login
  const handleLogin = async () => {
    try {
      const response = await api.post('/login', {
        email,
        password,
      });
      if (response.data.token) {
        // Save token in AuthContext and AsyncStorage
        await saveToken(response.data.token);
        // Navigate to Home on successful login
        navigation.replace('Post');
      } else {
        Alert.alert('Login Failed', response.data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        Alert.alert('Login Failed', error.response.data.message || 'Something went wrong, please try again.');
      } else {
        Alert.alert('Error', 'Something went wrong, please try again later.');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>Welcome to Tbooke</Text>
        <Text style={styles.welcomeText}>
          The ultimate community for education professionals, institutions, and learners to connect, share, and grow together with content that's educational and entertaining.
        </Text>
        <TouchableOpacity 
          style={styles.learnMoreButton} 
          onPress={() => navigation.navigate('About')}
        >
          <Icon name="info-circle" size={16} color="#fff" style={styles.learnMoreIcon} />
          <Text style={styles.learnMoreButtonText}>Learn More</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.loginContainer}>
        <Text style={styles.loginTitle}>Sign in to your account to continue</Text>

        <View style={styles.inputContainer}>
          <Icon name="envelope" size={20} color="#555" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.passwordContainer}>
          <Icon name="lock" size={20} color="#555" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={!showPassword} // Toggle secure text entry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)} // Toggle the showPassword state
            style={styles.eyeIcon}
          >
            <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#008080" />
          </TouchableOpacity>
        </View>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View style={[styles.checkboxInner, rememberMe && styles.checkboxChecked]}>
              {rememberMe && <Icon name="check" size={16} color="#008080" />}
            </View>
            <Text style={styles.checkboxText}>Remember me</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Icon name="sign-in" size={20} color="#fff" style={styles.loginButtonIcon} />
          <Text style={styles.loginButtonText}>SignIn</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Don't have an account? <Text style={styles.signupLink} onPress={() => navigation.navigate('Register')}>SignUp</Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#008080',
  },
  welcomeContainer: {
    marginBottom: 30,
    alignItems: 'center',
    marginTop: 120,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  welcomeText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: '#fff',
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'maroon',
    padding: 7,
    borderRadius: 5,
  },
  learnMoreIcon: {
    marginRight: 5,
  },
  learnMoreButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginContainer: {
    backgroundColor: '#f7f7f7',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 2,
  },
  loginTitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  inputIcon: {
    position: 'absolute',
    left: 15,
    top: 12,
  },
  input: {
    backgroundColor: '#fff',
    padding: 8,
    paddingLeft: 15, // Add left padding to avoid overlap with icon
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#008080',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#fff',
  },
  checkboxText: {
    fontSize: 14,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'maroon',
    padding: 7,
    borderRadius: 5,
    justifyContent: 'center',
    marginHorizontal: 50,
  },
  loginButtonIcon: {
    marginRight: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  forgotPassword: {
    marginTop: 15,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#008080',
    fontSize: 14,
  },
  signupText: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
  },
  signupLink: {
    color: '#008080',
    fontWeight: 'bold',
  },
});

export default Login;
