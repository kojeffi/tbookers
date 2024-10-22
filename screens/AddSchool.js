import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
// import * DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import Navbar from './Navbar';  // Import the Navbar component

const AddSchool = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  // URL of your local Laravel API endpoint
  const apiUrl = 'http://localhost:8000/api/schools'; // Adjust port if necessary

  const handleImagePick = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      setImage(res[0]); // Assuming single file upload
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Cancelled', 'Image selection was cancelled.');
      } else {
        Alert.alert('Error', 'An error occurred while selecting the image.');
      }
    }
  };

  const handleSubmit = async () => {
    if (!name || !description || !image) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('image', {
      uri: image.uri,
      type: image.type,
      name: image.name,
    });

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        Alert.alert('Success', 'School added successfully.');
        setName('');
        setDescription('');
        setImage(null);
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while submitting the form.');
    }
  };

  return (
    <View style={styles.container}>
        {/* Navbar */}
      <Navbar />
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Add Your School</Text>

      <TextInput
        style={styles.input}
        placeholder="School name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Describe your school..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.button} onPress={handleImagePick}>
        <Text style={styles.buttonText}>Pick Image</Text>
      </TouchableOpacity>
      {image && <Text style={styles.imageText}>Selected: {image.name}</Text>}

      <Button title="Submit" onPress={handleSubmit} />
      </ScrollView>
      </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 20,
      },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageText: {
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
});

export default AddSchool;
