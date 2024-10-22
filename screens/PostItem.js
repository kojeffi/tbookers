// PostItem.js
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import api from './api'; // Import the configured Axios instance
import Icon from 'react-native-vector-icons/Feather';
import Navbar from './Navbar';
import { AuthContext } from './AuthContext'; // Import AuthContext

const PostItem = () => {
  const { user, loading: authLoading, error: authError } = useContext(AuthContext); // Access user and authLoading
  const [posts, setPosts] = useState([]); // Stores all posts
  const [loading, setLoading] = useState(false); // Loading state for posts
  const [error, setError] = useState(null); // Error state for posts


  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch posts from the API
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/feed'); // GET /feed
      setPosts(response.data);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError('Failed to load posts.');
    } finally {
      setLoading(false);
    }
  };


  // Repost a post
  const repost = async (postId) => {
    try {
      await api.post(`/posts/${postId}/repost`); // POST /posts/{id}/repost
      setRepostSuccessModalVisible(true);
      fetchPosts(); // Refresh posts to reflect repost
    } catch (err) {
      console.error('Failed to repost:', err);
      // Error handled by Axios interceptor
    }
  };

  // Like a post
  const likePost = async (postId) => {
    try {
      await api.post(`/post/${postId}/like`); // POST /post/{id}/like
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likes_count: post.likes_count + 1, is_liked: true }
            : post
        )
      );
    } catch (err) {
      console.error('Failed to like post:', err);
      // Error handled by Axios interceptor
    }
  };

  // Unlike a post
  const unlikePost = async (postId) => {
    try {
      await api.post(`/post/${postId}/unlike`); // POST /post/{id}/unlike
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likes_count: post.likes_count - 1, is_liked: false }
            : post
        )
      );
    } catch (err) {
      console.error('Failed to unlike post:', err);
      // Error handled by Axios interceptor
    }
  };

  // Delete a post
  const deletePost = async (postId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/posts/${postId}`); // DELETE /posts/{post}
              setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
              Alert.alert('Success', 'Post deleted successfully.');
            } catch (err) {
              console.error('Failed to delete post:', err);
              // Error handled by Axios interceptor
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Add a comment to a post
  const addComment = async (postId, commentContent) => {
    if (!commentContent.trim()) {
      Alert.alert('Validation', 'Comment cannot be empty.');
      return;
    }
    try {
      const response = await api.post('/comment', { post_id: postId, content: commentContent }); // POST /comment
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, response.data] }
            : post
        )
      );
    } catch (err) {
      console.error('Failed to add comment:', err);
      // Error handled by Axios interceptor
    }
  };

  // Render individual post
  const renderPost = ({ item }) => (
    <Post
      post={item}
      currentUserId={user ? user.id : null} // Use user for currentUserId
      onLike={likePost}
      onUnlike={unlikePost}
      onRepost={repost}
      onDelete={deletePost}
      onAddComment={addComment}
    />
  );

  return (
    <View style={styles.container}>
      <Navbar />
      {/* User Profile and Share Button */}
      <View style={styles.profileContainer}>
        {user && (
          <Image
            source={{
              uri: user.profile_picture
                ? `https://tbooke.net/storage/${user.profile_picture}`
                : 'https://tbooke.net/storage/default-avatar.png', // Use a valid default image URL
            }}
            style={styles.avatar}
          />
        )}
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => setCreatePostModalVisible(true)}
        >
          <Text style={styles.shareButtonText}>Share your thoughts</Text>
        </TouchableOpacity>
      </View>

      {/* Posts Feed */}
      {(authLoading || loading) ? (
        <ActivityIndicator size="large" color="#0d6efd" style={{ marginTop: 20 }} />
      ) : (error || authError) ? (
        <Text style={styles.errorText}>{error || authError}</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPost}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  profileContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  shareButton: {
    marginLeft: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e9ecef',
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#495057',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PostItem;
