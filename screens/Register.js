// components/Register.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/FontAwesome'; // Using FontAwesome for icons
import api from './api'; // Adjust the path based on your project structure
import { storeToken } from './auth';

const Register = ({ navigation }) => {
  const [profileType, setProfileType] = useState('');
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [institutionLocation, setInstitutionLocation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptPrivacyPolicy, setAcceptPrivacyPolicy] = useState(false); // Updated state
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Student/Learner', value: 'student' },
    { label: 'Teacher/Tutor', value: 'teacher' },
    { label: 'Institution', value: 'institution' },
    { label: 'Other', value: 'other' },
  ]);

  const [errors, setErrors] = useState({}); // State to hold validation errors

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const renderProfileSpecificFields = () => {
    if (profileType === 'institution') {
      return (
        <>
          <Text style={styles.label}>Institution/Company/School Name</Text>
          <TextInput
            style={[
              styles.input,
              errors.institution_name && styles.inputError,
            ]}
            value={institutionName}
            onChangeText={setInstitutionName}
            placeholder="Enter Institution Name"
          />
          {errors.institution_name && (
            <Text style={styles.errorText}>{errors.institution_name}</Text>
          )}

          <Text style={styles.label}>Institution/Company/School Location</Text>
          <TextInput
            style={[
              styles.input,
              errors.institution_location && styles.inputError,
            ]}
            value={institutionLocation}
            onChangeText={setInstitutionLocation}
            placeholder="Enter Institution Location"
          />
          {errors.institution_location && (
            <Text style={styles.errorText}>{errors.institution_location}</Text>
          )}
        </>
      );
    } else if (profileType) {
      return (
        <>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={[styles.input, errors.first_name && styles.inputError]}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter your first name"
          />
          {errors.first_name && (
            <Text style={styles.errorText}>{errors.first_name}</Text>
          )}

          <Text style={styles.label}>Surname</Text>
          <TextInput
            style={[styles.input, errors.surname && styles.inputError]}
            value={surname}
            onChangeText={setSurname}
            placeholder="Enter your surname"
          />
          {errors.surname && (
            <Text style={styles.errorText}>{errors.surname}</Text>
          )}
        </>
      );
    }
    return null;
  };

  const handleRegister = async () => {
    // Reset previous errors
    setErrors({});

    // Input Validation
    let validationErrors = {};

    if (!profileType) {
      validationErrors.profile_type = 'Please select a user type.';
    }

    if (!email) {
      validationErrors.email = 'Email is required.';
    } else if (!validateEmail(email)) {
      validationErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      validationErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      validationErrors.password = 'Password should be at least 6 characters long.';
    }

    if (!confirmPassword) {
      validationErrors.password_confirmation = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      validationErrors.password_confirmation = 'Passwords do not match.';
    }

    if (profileType === 'institution') {
      if (!institutionName) {
        validationErrors.institution_name = 'Institution name is required.';
      }
      if (!institutionLocation) {
        validationErrors.institution_location = 'Institution location is required.';
      }
    } else {
      if (!firstName) {
        validationErrors.first_name = 'First name is required.';
      }
      if (!surname) {
        validationErrors.surname = 'Surname is required.';
      }
    }

    if (!acceptPrivacyPolicy) {
      validationErrors.accept_privacy_policy = 'You must accept the Privacy Policy.';
    }

    // If there are validation errors, set them and abort registration
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Alert.alert('Validation Error', 'Please fix the errors before submitting.');
      return;
    }

    setLoading(true);

    // Prepare payload
    const payload = {
      profile_type: profileType,
      email: email,
      password: password,
      password_confirmation: confirmPassword,
      accept_privacy_policy: acceptPrivacyPolicy,
    };

    if (profileType === 'institution') {
      payload.institution_name = institutionName;
      payload.institution_location = institutionLocation;
    } else {
      payload.first_name = firstName;
      payload.surname = surname;
    }

    try {
      const response = await api.post('/register', payload);

      if (response.status === 201) {
        const { token, user } = response.data;

        // Store the token securely
        await storeToken(token);

        Alert.alert(
          'Success',
          'Registration successful! Please verify your email.'
        );

        // Navigate to the Login screen
        navigation.navigate('Login');
      }
    } catch (error) {
      if (error.response) {
        const { message, errors: apiErrors } = error.response.data;
        let errorMsg = message;

        if (apiErrors) {
          const formattedErrors = Object.values(apiErrors)
            .flat()
            .join('\n');
          errorMsg += `\n${formattedErrors}`;
        }

        Alert.alert('Registration Failed', errorMsg);
      } else if (error.request) {
        Alert.alert(
          'Network Error',
          'No response from server. Please try again later.'
        );
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        {/* Registration Form */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>
            Join Tbooke for professional networking and constructive education-focused conversations.
          </Text>

          {/* User Type Selection */}
          <Text style={styles.label}>Select User Type</Text>
          <DropDownPicker
            open={open}
            value={profileType}
            items={items}
            setOpen={setOpen}
            setValue={setProfileType}
            setItems={setItems}
            placeholder="Select User Type"
            containerStyle={styles.dropdownContainer}
            style={styles.dropdown}
            dropDownStyle={styles.dropdownList}
          />
          {errors.profile_type && (
            <Text style={styles.errorText}>{errors.profile_type}</Text>
          )}

          {/* Profile Specific Fields */}
          {renderProfileSpecificFields()}

          {/* Email Input */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}

          {/* Password Input */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.passwordInput, { flex: 1 }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? 'eye' : 'eye-slash'}
                size={20}
                color="#007bff"
              />
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          {/* Confirm Password Input */}
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.passwordInput, { flex: 1 }]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Icon
                name={showConfirmPassword ? 'eye' : 'eye-slash'}
                size={20}
                color="#007bff"
              />
            </TouchableOpacity>
          </View>
          {errors.password_confirmation && (
            <Text style={styles.errorText}>{errors.password_confirmation}</Text>
          )}

          {/* Privacy Policy Acceptance */}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setAcceptPrivacyPolicy(!acceptPrivacyPolicy)}
              accessibilityLabel="Accept Privacy Policy"
              accessibilityHint="Toggle to accept or decline the Privacy Policy"
            >
              <Icon
                name={acceptPrivacyPolicy ? 'check-square-o' : 'square-o'}
                size={24}
                color="#007bff"
              />
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>
              I accept the{' '}
              <Text
                style={styles.link}
                onPress={() => navigation.navigate('PrivacyPolicy')}
              >
                Privacy Policy
              </Text>
            </Text>
          </View>
          {errors.accept_privacy_policy && (
            <Text style={styles.errorText}>{errors.accept_privacy_policy}</Text>
          )}

          {/* Register Button */}
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Sign Up</Text>
            </TouchableOpacity>
          )}

          {/* Login Link */}
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
              Log In
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#008080', // Teal background color
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  headerContainer: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop:20,
  },
  authButtons: {
    flexDirection: 'row',
  },
  authButtonText: {
    color: '#fff',
    marginLeft: 15,
    fontSize: 12,
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent background
    borderRadius: 10,
    padding: 20,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 5,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 12,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    marginBottom: 10,
  },
  dropdownContainer: {
    height: 50,
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: '#f9f9f9',
    borderColor: '#ced4da',
  },
  dropdownList: {
    backgroundColor: '#f9f9f9',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  passwordInput: {
    fontSize: 12,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: {
    fontSize: 12,
    color: '#555',
    flex: 1,
    flexWrap: 'wrap',
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  registerButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  loginText: {
    textAlign: 'center',
    marginTop: 15,
    color: '#555',
    fontSize: 12,
  },
  loginLink: {
    color: '#007bff',
    fontWeight: '600',
  },
});

export default Register;
