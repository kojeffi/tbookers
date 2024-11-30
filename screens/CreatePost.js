import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Video } from 'expo-av';
import { AuthContext } from './AuthContext';
import Navbar from './Navbar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from './api';

const CreatePost = ({ navigation }) => {
  const { authToken } = useContext(AuthContext); // Token for authenticated requests
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to pick multiple files (images, videos, documents, etc.)
  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Allow all file types
      });

      if (result.type !== 'cancel') {
        const file = {
          uri: result.uri,
          name: result.name,
          mimeType: result.mimeType || 'application/octet-stream',
        };

        // Ensure the file is valid before adding
        setSelectedFiles((prevFiles) => [...prevFiles, file]);
      }
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'Failed to pick file.');
    }
  };

  // Function to submit post with media files
  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Post content cannot be empty.');
      return;
    }

    const formData = new FormData();
    formData.append('content', content); // Add post content

    selectedFiles.forEach((file, index) => {
      formData.append('media_path[]', {
        uri: file.uri,
        name: file.name || `file_${index}`,
        type: file.mimeType || 'application/octet-stream',
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

      // Reset form after successful submission
      setContent('');
      setSelectedFiles([]);
      navigation.navigate('Post', { postId: response.data.id }); // Redirect to the post view
      Alert.alert('Success', 'Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error.response || error);
      Alert.alert('Error', 'Failed to create the post.');
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
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.filePicker} onPress={handleFilePick}>
            <Icon name="attach-file" size={20} color="#008080" />
            <Text style={styles.filePickerText}>Choose Files</Text>
          </TouchableOpacity>
          {selectedFiles.length > 0 && (
            <View style={styles.selectedFilesContainer}>
              {selectedFiles.map((file, index) => {
                if (file.mimeType?.startsWith('image/')) {
                  // Render Image
                  return (
                    <Image
                      key={index}
                      source={{ uri: file.uri }}
                      style={styles.selectedImage}
                    />
                  );
                } else if (file.mimeType?.startsWith('video/')) {
                  // Render Video
                  return (
                    <Video
                      key={index}
                      source={{ uri: file.uri }}
                      style={styles.selectedVideo}
                      useNativeControls
                      resizeMode="contain"
                    />
                  );
                } else {
                  // Render Other Files
                  return (
                    <View key={index} style={styles.otherFileContainer}>
                      <Icon name="insert-drive-file" size={24} color="#008080" />
                      <Text style={styles.fileName}>{file.name}</Text>
                    </View>
                  );
                }
              })}
            </View>
          )}
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Icon name="cancel" size={18} color="#fff" />
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Icon name="send" size={18} color="#fff" />
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
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 20,
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
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  filePicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
  },
  filePickerText: {
    color: '#008080',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  selectedFilesContainer: {
    marginTop: 10,
  },
  selectedImage: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#008080',
  },
  selectedVideo: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#008080',
  },
  otherFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  fileName: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    width: '48%',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'red',
    marginVertical: 4,
  },
  submitButton: {
    backgroundColor: '#008080',
    marginVertical: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default CreatePost;
