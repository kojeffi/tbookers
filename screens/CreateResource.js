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
import * as ImagePicker from 'expo-image-picker';
import Navbar from './Navbar';
import api from './api';
import { AuthContext } from './AuthContext';

const counties = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu', 'Garissa', 'Homa Bay', 
  'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 
  'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera', 
  'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi', 
  'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita Taveta', 'Tana River', 
  'Tharaka Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
];

const Form = () => {
  const { authToken } = useContext(AuthContext);
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [county, setCounty] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null); // Single item thumbnail image
  const [itemImages, setItemImages] = useState([]); // Multiple item images

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'We need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const handleImagePick = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const selectedAsset = result.assets[0];
        const uriParts = selectedAsset.uri.split('/');
        const fileName = uriParts[uriParts.length - 1];
        const fileType = fileName.split('.').pop();
        const mimeType = `image/${fileType === 'jpg' ? 'jpeg' : fileType}`;

        setImage({
          uri: selectedAsset.uri,
          type: mimeType,
          name: fileName,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick the image.');
    }
  };

  const handleMultipleImagePick = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const images = result.assets.map(asset => ({
          uri: asset.uri,
          type: 'image/jpeg',
          name: asset.uri.split('/').pop(),
        }));
        setItemImages(images);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick multiple images.');
    }
  };

  const handleSubmit = async () => {
    if (!authToken) {
      Alert.alert('Authentication Required', 'Please log in to submit the form.');
      return;
    }

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

    if (image) {
      formData.append('item_thumbnail', {
        uri: image.uri,
        type: image.type,
        name: image.name,
      });
    }

    if (itemImages.length > 0) {
      itemImages.forEach((img, index) => {
        formData.append(`item_images[${index}]`, {
          uri: img.uri,
          type: img.type,
          name: img.name,
        });
      });
    }

    try {
      const response = await api.post('/learning-resources', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Your item has been submitted successfully!');
        resetForm();
      } else {
        Alert.alert('Error', 'Something went wrong.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit. Please try again.');
    }
  };

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
    setItemImages([]);
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sell on Tbooke</Text>
          <ScrollView style={styles.scrollableCardContent}>
            <View style={styles.formGroup}>
              <TextInput
                style={styles.input}
                placeholder="Item Name"
                value={itemName}
                onChangeText={setItemName}
              />

              <RNPickerSelect
                placeholder={{ label: 'Select category', value: null }}
                items={[
                  { label: 'Books', value: 'Books' },
                  { label: 'Stationery', value: 'Stationery' },
                  { label: 'Electronics', value: 'Electronics' },
                  { label: 'Online Courses', value: 'Online Courses' },
                  { label: 'Other', value: 'Other' }
                ]}
                onValueChange={setItemCategory}
                value={itemCategory}
                style={pickerSelectStyles}
              />

              <RNPickerSelect
                placeholder={{ label: 'Select county', value: null }}
                items={counties.map(county => ({ label: county, value: county }))}
                onValueChange={setCounty}
                value={county}
                style={pickerSelectStyles}
              />

              <TextInput
                style={styles.input}
                placeholder="Item Price"
                keyboardType="numeric"
                value={itemPrice}
                onChangeText={setItemPrice}
              />

              <TextInput
                style={styles.input}
                placeholder="Whatsapp Number"
                keyboardType="phone-pad"
                value={whatsappNumber}
                onChangeText={setWhatsappNumber}
              />

              <TextInput
                style={styles.input}
                placeholder="Contact Email"
                keyboardType="email-address"
                value={contactEmail}
                onChangeText={setContactEmail}
              />

              <TextInput
                style={styles.input}
                placeholder="Contact Phone"
                keyboardType="phone-pad"
                value={contactPhone}
                onChangeText={setContactPhone}
              />

              {/* Item Thumbnail Image Picker */}
              <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
                <Text style={styles.imagePickerText}>
                  {image ? 'Change Thumbnail Image' : 'Pick Thumbnail Image'}
                </Text>
              </TouchableOpacity>
              {image && <Image source={{ uri: image.uri }} style={styles.imagePreview} />}

              {/* Item Multiple Images Picker */}
              <TouchableOpacity style={styles.imagePicker} onPress={handleMultipleImagePick}>
                <Text style={styles.imagePickerText}>
                  {itemImages.length > 0 ? 'Change Item Images' : 'Pick Item Images'}
                </Text>
              </TouchableOpacity>
              {itemImages.length > 0 && (
                <ScrollView horizontal style={styles.imagesPreviewContainer}>
                  {itemImages.map((img, index) => (
                    <Image key={index} source={{ uri: img.uri }} style={styles.imagePreview} />
                  ))}
                </ScrollView>
              )}

              <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Description"
                multiline
                value={description}
                onChangeText={setDescription}
              />

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit Item</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollableCardContent: {
    // maxHeight: 600,
  },
  formGroup: {
    marginBottom: 16,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  imagePicker: {
    backgroundColor: '#eee',
    padding: 10,
    marginBottom: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#007bff',
    fontSize: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 5,
  },
  imagesPreviewContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 12,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginBottom: 12,
  },
};

export default Form;
