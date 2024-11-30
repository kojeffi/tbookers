import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { AuthContext } from './AuthContext';
import api from './api';
import * as ImagePicker from 'expo-image-picker';

const CreateGroup = () => {
  const { authToken } = useContext(AuthContext);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Sorry, we need camera roll permissions to make this work!'
          );
        }
      }
    })();
  }, []);

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setThumbnail(selectedImage);
      } else {
        Alert.alert('No image selected', 'Please select an image to continue.');
      }
    } catch (error) {
      console.error('ImagePicker Error: ', error);
      Alert.alert('Error', 'An unexpected error occurred while selecting the image.');
    }
  };

  const handleSubmit = async () => {
    if (!name || !description) {
      Alert.alert('Validation Error', 'Please fill all required fields.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);

    if (thumbnail) {
      const uriParts = thumbnail.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append('thumbnail', {
        uri: Platform.OS === 'android' ? thumbnail.uri : thumbnail.uri.replace('file://', ''),
        name: `thumbnail.${fileType}`,
        type: `image/${fileType}`,
      });
    }

    try {
      const response = await api.post('/groups', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authToken}`, // Include token if needed
        },
      });

      Alert.alert('Success', 'Group created successfully!');
      setName('');
      setDescription('');
      setThumbnail(null);
    } catch (error) {
      console.error('Error creating group:', error);
      Alert.alert('Error', 'Failed to create group.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Create Group</Text>
        </View>
        <View style={styles.cardBody}>
          <TextInput
            style={styles.input}
            placeholder="Group Name"
            value={name}
            onChangeText={setName}
            required
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            required
          />
          <TouchableOpacity style={styles.imagePicker} onPress={selectImage}>
            {thumbnail ? (
              <Image source={{ uri: thumbnail.uri }} style={styles.thumbnail} />
            ) : (
              <Text style={styles.imagePickerText}>Select Group Thumbnail</Text>
            )}
          </TouchableOpacity>
          {loading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : (
            <Button title="Submit" onPress={handleSubmit} color="#007bff" />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 3, // for Android
    shadowColor: '#000', // for iOS
    shadowOffset: { width: 0, height: 2 }, // for iOS
    shadowOpacity: 0.25, // for iOS
    shadowRadius: 3.84, // for iOS
    padding: 16,
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    marginBottom: 16,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardBody: {
    // Additional styles if needed
  },
  input: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    height: 150,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 4,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
  },
  imagePickerText: {
    color: '#6c757d',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
});

export default CreateGroup;
