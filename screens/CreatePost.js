import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from './api';
import { AuthContext } from './AuthContext';
import Navbar from './Navbar';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CreatePost = ({ navigation }) => {
  const { authToken } = useContext(AuthContext);
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setSelectedImages((prevImages) => [...prevImages, selectedImage]);
    }
  };

  const handleSubmit = async () => {
    if (!content) {
      Alert.alert('Error', 'Post content cannot be empty');
      return;
    }

    const formData = new FormData();
    formData.append('content', content);
    selectedImages.forEach((image, index) => {
      formData.append('media_path[]', {
        uri: image.uri,
        name: `image${index}.jpg`,
        type: 'image/jpeg',
      });
    });

    setLoading(true);

    try {
      const response = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authToken}`,
        },
      });

      navigation.navigate('Post', { postId: response.data.id });
      setContent('');
      setSelectedImages([]);
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
    <Navbar navigation={navigation} />
    <View style={styles.container}>
      
      <Text style={styles.title}>Create Post</Text>
      <ScrollView style={styles.body}>
        <TextInput
          style={styles.textArea}
          placeholder="Enter your post content"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={4}
          placeholderTextColor="#aaaaaa"
        />
        <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
          <Text style={styles.imagePickerText}>Choose Images</Text>
        </TouchableOpacity>
        {selectedImages.length > 0 && (
          <View style={styles.selectedImagesContainer}>
            {selectedImages.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image.uri }}
                style={styles.selectedImage}
              />
            ))}
          </View>
        )}
      </ScrollView>
      <View style={[styles.footer, selectedImages.length > 0 && styles.footerWithImages]}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="cancel" size={12} color="#fff" />
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Icon name="send" size={12} color="#fff" />
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      </View>
      {loading && (
        <ActivityIndicator size="large" color="#007bff" style={styles.loadingIndicator} />
      )}
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddd',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  body: {
    flex: 1,
  },
  textArea: {
    height: 120,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 12,
    color: '#333',
    backgroundColor: '#fff',
  },
  imagePicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#008080',
    borderRadius: 10,
    marginBottom: 10,
  },
  imagePickerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 8,
  },
  selectedImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  selectedImage: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007bff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  footerWithImages: {
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    width: '48%',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  submitButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 12,
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default CreatePost;
