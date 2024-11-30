import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Navbar from './Navbar';  // Import your Navbar component

const TbookeBlueboard = () => {
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();
  const apiUrl = 'https://tbooke.net/api/api/tbooke-blueboard'; 

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(apiUrl);
      setPosts(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch blueboard posts.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setPosts(posts.filter(post => post.id !== id));
      Alert.alert('Success', 'Post deleted successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete post.');
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const response = await axios.put(`${apiUrl}/${id}`, updatedData);
      setPosts(posts.map(post => (post.id === id ? response.data : post)));
      Alert.alert('Success', 'Post updated successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update post.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <Navbar navigation={navigation} />
      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Tbooke Blueboard</Text>
          <Button
            title="Create Blueboard Post"
            onPress={() => navigation.navigate('CreateBlueboardPost')} // Adjust the navigation target
          />
        </View>

        {posts.map((post) => (
          <View key={post.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{post.title}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardText}>{post.content}</Text>
              <Text style={styles.cardFooter}>
                Posted by {post.user.name} on {new Date(post.created_at).toLocaleDateString()} at {new Date(post.created_at).toLocaleTimeString()}
              </Text>
              <View style={styles.buttonContainer}>
                <Button
                  title="Edit"
                  onPress={() => {
                    // Navigate to the edit screen with the post id
                    navigation.navigate('EditBlueboardPost', { post });
                  }}
                />
                <Button
                  title="Delete"
                  onPress={() => handleDelete(post.id)}
                  color="red"
                />
              </View>
            </View>
          </View>
        ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginBottom: 16,
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
  cardText: {
    fontSize: 14,
    marginBottom: 8,
  },
  cardFooter: {
    fontSize: 12,
    color: '#6c757d',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default TbookeBlueboard;
