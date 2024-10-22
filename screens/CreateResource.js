// Form.js
import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  StyleSheet, 
  Image, 
  Platform 
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker'; // Updated import
import Navbar from './Navbar';  // Import the Navbar component
import api from './api'; // Import the custom API instance
import { AuthContext } from './AuthContext'; // Import AuthContext

// List of counties for the dropdown
const counties = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu', 'Garissa', 'Homa Bay', 
  'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 
  'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera', 
  'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi', 
  'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita Taveta', 'Tana River', 
  'Tharaka Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
];

const Form = () => {
  const { authToken } = useContext(AuthContext); // Access authToken from AuthContext
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [county, setCounty] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null); // State to store selected image

  // Request media library permissions on component mount
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  // Function to handle image picking using expo-image-picker
  const handleImagePick = async () => {
    try {
      // Launch the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Optional: allows user to edit the selected image
        aspect: [4, 3], // Optional: aspect ratio
        quality: 0.8, // Image quality
      });

      if (result.canceled) {
        console.log('User cancelled image picker');
      } else if (result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        // Extract the file name from the URI
        const uriParts = selectedAsset.uri.split('/');
        const fileName = uriParts[uriParts.length - 1];
        // Infer the type of the image
        const fileType = fileName.split('.').pop();
        const mimeType = `image/${fileType === 'jpg' ? 'jpeg' : fileType}`;

        setImage({
          uri: selectedAsset.uri,
          type: mimeType,
          name: fileName,
        });
      } else {
        console.error('Unknown image picker response:', result);
        Alert.alert('Error', 'An unexpected error occurred while picking the image.');
      }
    } catch (error) {
      console.error('ImagePicker Error: ', error);
      Alert.alert('Error', 'Failed to pick the image. Please try again.');
    }
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    // Check if user is authenticated
    if (!authToken) {
      Alert.alert('Authentication Required', 'Please log in to submit the form.');
      return;
    }

    // Basic form validation
    if (
      !itemName.trim() ||
      !itemCategory.trim() ||
      !county.trim() ||
      !itemPrice.trim() ||
      !whatsappNumber.trim() ||
      !contactEmail.trim() ||
      !contactPhone.trim() ||
      !description.trim()
    ) {
      Alert.alert('Validation Error', 'Please fill in all the required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('item_name', itemName);
    formData.append('item_category', itemCategory);
    formData.append('county', county);
    formData.append('item_price', itemPrice);
    formData.append('whatsapp_number', whatsappNumber);
    formData.append('contact_email', contactEmail);
    formData.append('contact_phone', contactPhone);
    formData.append('description', description);

    // Append the image file to FormData if an image is selected
    if (image) {
      formData.append('item_thumbnail', {
        uri: image.uri,
        type: image.type || 'image/jpeg', // Ensure type is set
        name: image.name || 'image.jpg', // Use the name from ImagePicker
      });
    }

    try {
      const response = await api.post('/learning-resources', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`, // Include auth token if required
        },
      });

      if (response.status === 200 || response.status === 201) { // 201 Created is also common
        Alert.alert('Success', 'Your item has been submitted successfully!');
        // Optionally reset the form
        resetForm();
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        Alert.alert('Submission Failed', error.response.data.message || 'Unknown server error.');
        console.error('Error Response:', error.response);
      } else if (error.request) {
        // Request was made but no response received
        Alert.alert('Network Error', 'No response from server. Please check your internet connection and try again.');
        console.error('Error Request:', error.request);
      } else {
        // Something else happened
        Alert.alert('Error', `An unexpected error occurred: ${error.message}`);
        console.error('Error Message:', error.message);
      }
    }
  };

  // Function to reset the form after successful submission
  const resetForm = () => {
    setItemName('');
    setItemCategory('');
    setCounty('');
    setItemPrice('');
    setWhatsappNumber('');
    setContactEmail('');
    setContactPhone('');
    setDescription('');
    setImage(null);
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <Navbar />
      {/* Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sell on Tbooke</Text>
          <ScrollView style={styles.scrollableCardContent}>
            <View style={styles.formGroup}>
              {/* Item Name */}
              <TextInput
                style={styles.input}
                placeholder="Item Name"
                value={itemName}
                onChangeText={setItemName}
              />

              {/* Item Category */}
              <RNPickerSelect
                placeholder={{ label: 'Select category', value: null }}
                items={[
                  { label: 'Books', value: 'Books' },
                  { label: 'Stationery', value: 'Stationery' },
                  { label: 'Educational Resources', value: 'Educational Resources' },
                  { label: 'Educational Software', value: 'Educational Software' },
                  { label: 'Electronics', value: 'Electronics' },
                  { label: 'Online Courses and Tutorials', value: 'Online Courses and Tutorials' },
                  { label: 'Sporting Equipment', value: 'Sporting Equipment' },
                  { label: 'Other', value: 'Other' }
                ]}
                onValueChange={setItemCategory}
                value={itemCategory}
                style={pickerSelectStyles}
              />

              {/* County Selection */}
              <RNPickerSelect
                placeholder={{ label: 'Select county', value: null }}
                items={counties.map(county => ({ label: county, value: county }))}
                onValueChange={setCounty}
                value={county}
                style={pickerSelectStyles}
              />

              {/* Item Price */}
              <TextInput
                style={styles.input}
                placeholder="Item Price"
                keyboardType="numeric"
                value={itemPrice}
                onChangeText={setItemPrice}
              />

              {/* Whatsapp Number */}
              <TextInput
                style={styles.input}
                placeholder="Whatsapp Number starting with 254"
                keyboardType="phone-pad"
                value={whatsappNumber}
                onChangeText={setWhatsappNumber}
              />

              {/* Contact Email */}
              <TextInput
                style={styles.input}
                placeholder="Contact Email"
                keyboardType="email-address"
                value={contactEmail}
                onChangeText={setContactEmail}
              />

              {/* Contact Phone */}
              <TextInput
                style={styles.input}
                placeholder="Contact Number"
                keyboardType="phone-pad"
                value={contactPhone}
                onChangeText={setContactPhone}
              />

              {/* Image Picker */}
              <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
                <Text style={styles.imagePickerText}>{image ? 'Change Image' : 'Pick an Image'}</Text>
              </TouchableOpacity>

              {/* Image Preview */}
              {image && (
                <Image
                  source={{ uri: image.uri }}
                  style={styles.imagePreview}
                />
              )}

              {/* Description */}
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Start typing item description..."
                multiline
                numberOfLines={5}
                value={description}
                onChangeText={setDescription}
              />

              {/* Submit Button */}
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

// Custom styles for RNPickerSelect
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    color: 'black',
    paddingRight: 30, // To ensure the text is never behind the icon
    backgroundColor: '#fafafa', // Optional: Light background for inputs
  },
  inputAndroid: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    color: 'black',
    paddingRight: 30, // To ensure the text is never behind the icon
    backgroundColor: '#fafafa', // Optional: Light background for inputs
  },
  placeholder: {
    color: '#999', // Placeholder text color
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Optional: Light background color for better contrast
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20, // Added padding for better spacing
  },
  card: {
    borderRadius: 8,
    padding: 20,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 }, // For iOS shadow
    shadowOpacity: 0.25, // For iOS shadow
    shadowRadius: 3.84, // For iOS shadow
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  formGroup: {
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fafafa', // Optional: Light background for inputs
    fontSize: 16,
  },
  textArea: {
    height: 100, // Adjust as needed
    textAlignVertical: 'top', // For Android to align text at the top
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#fafafa', // Optional: Light background for the picker
  },
  imagePickerText: {
    color: '#007BFF',
    fontSize: 16,
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 5,
    marginVertical: 10,
    alignSelf: 'center',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 }, // For iOS shadow
    shadowOpacity: 0.25, // For iOS shadow
    shadowRadius: 3.84, // For iOS shadow
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Form;
