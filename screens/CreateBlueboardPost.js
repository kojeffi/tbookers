import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Navbar from './Navbar';

const CreateBlueboardPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!title || !content) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    try {
      await axios.post('http://192.168.12.117:8000/api/blueboard-posts', { title, content }); // Replace with your API endpoint
      Alert.alert('Success', 'Blueboard post created successfully.');
      navigation.goBack(); // Navigate back after successful submission
    } catch (error) {
      Alert.alert('Error', 'Failed to create blueboard post.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <Navbar />
      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Create Blueboard Post</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Create Blueboard Post</Text>
          </View>
          <View style={styles.cardBody}>
            <TextInput
              style={styles.input}
              placeholder="Enter title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter content"
              multiline
              numberOfLines={5}
              value={content}
              onChangeText={setContent}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  headerContainer: {
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardBody: {
    padding: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateBlueboardPost;
