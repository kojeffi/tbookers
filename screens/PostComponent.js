import React, { useState, useEffect, useContext } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { AuthContext } from './AuthContext'; // Import AuthContext
import api from './api'; // Import your API instance
import Video from 'react-native-video';
import ModalDropdown from 'react-native-modal-dropdown'; // Import Dropdown
import Lightbox from 'react-native-lightbox'; // Import Lightbox for images (optional)

const PostComponent = ({ user }) => {
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [repostModalVisible, setRepostModalVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { authToken } = useContext(AuthContext); // Use AuthContext

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch posts from API
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/feed', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log('API Response:', response.data);
      setPosts(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Create a new post
  const createPost = async (content) => {
    try {
      await api.post('/posts', { content }, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setSuccessModalVisible(true);
      fetchPosts(); // Refresh posts after creating a new one
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    }
  };

  // Like a post
  const likePost = async (id) => {
    try {
      await api.post(`/post/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      updatePostState(id, { liked: true, likeCount: (getPostById(id).likeCount || 0) + 1 });
    } catch (error) {
      console.error('Error liking post:', error);
      Alert.alert('Error', 'Failed to like the post. Please try again.');
    }
  };

  // Unlike a post
  const unlikePost = async (id) => {
    try {
      await api.post(`/post/${id}/unlike`, {}, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      updatePostState(id, { liked: false, likeCount: Math.max((getPostById(id).likeCount || 1) - 1, 0) });
    } catch (error) {
      console.error('Error unliking post:', error);
      Alert.alert('Error', 'Failed to unlike the post. Please try again.');
    }
  };

  // Repost a post
  const repostPost = async (postId) => {
    try {
      await api.post(`/posts/${postId}/repost`, {}, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setRepostModalVisible(true);
      fetchPosts(); // Refresh posts after reposting
    } catch (error) {
      console.error('Error reposting post:', error);
      Alert.alert('Error', 'Failed to repost. Please try again.');
    }
  };

  // Comment on a post
  const commentOnPost = async (postId, comment) => {
    try {
      await api.post('/comment', { postId, comment }, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      fetchPosts(); // Refresh posts after commenting
    } catch (error) {
      console.error('Error commenting on post:', error);
      Alert.alert('Error', 'Failed to comment. Please try again.');
    }
  };

  // Delete a post
  const deletePost = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'Failed to delete post. Please try again.');
    }
  };

  // Helper to get a post by ID
  const getPostById = (id) => posts.find(post => post.id === id);

  // Helper to update a post's state locally
  const updatePostState = (id, updatedFields) => {
    setPosts(posts.map(post => post.id === id ? { ...post, ...updatedFields } : post));
  };

  // Handle post options selection
  const handlePostOption = (option, postId) => {
    if (option === 'Delete Post') {
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this post?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => deletePost(postId) },
        ]
      );
    } else if (option.startsWith('Follow')) {
      // Implement follow functionality
      Alert.alert('Follow', `Following ${option.split(' ')[1]}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Success Modal after creating a post */}
      <Modal
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Post created successfully</Text>
              <TouchableOpacity onPress={() => setSuccessModalVisible(false)}>
                <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal after reposting a post */}
      <Modal
        transparent={true}
        visible={repostModalVisible}
        onRequestClose={() => setRepostModalVisible(false)}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Repost successful</Text>
              <TouchableOpacity onPress={() => setRepostModalVisible(false)}>
                <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Indicator */}
      {loading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
      )}

      {/* Error Message */}
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Section */}
        <View style={styles.profileContainer}>
          {user && user.profile_picture ? (
            <Image
              source={{ uri: user.profile_picture }}
              style={styles.avatar}
              accessibilityLabel="Profile Picture"
            />
          ) : (
            <Image
              source={require('./../assets/images/avatar.png')}
              style={styles.avatar}
              accessibilityLabel="Default Profile Picture"
            />
          )}
          <TouchableOpacity
            style={styles.createPostButton}
            onPress={() => {
              Alert.prompt(
                'Create Post',
                'Write something interesting...',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Post',
                    onPress: (text) => {
                      if (text && text.trim()) {
                        createPost(text.trim());
                      } else {
                        Alert.alert('Error', 'Post content cannot be empty.');
                      }
                    },
                  },
                ],
                'plain-text'
              );
            }}
          >
            <Text style={styles.createPostButtonText}>Write something interesting</Text>
          </TouchableOpacity>
        </View>

        {/* Posts Feed */}
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <View key={post.id} style={styles.postBox}>
              {/* Repost Handling */}
              {post.is_repost && post.reposter && (
                <View style={styles.repostHeader}>
                  <TouchableOpacity>
                    {post.reposter.profile_picture ? (
                      <Image
                        source={{ uri: post.reposter.profile_picture }}
                        style={styles.reposterAvatar}
                      />
                    ) : (
                      <Image
                        source={require('./../assets/images/avatar.png')}
                        style={styles.reposterAvatar}
                      />
                    )}
                  </TouchableOpacity>
                  <Text style={styles.reposterName}>{post.reposter.username} reposted</Text>
                </View>
              )}

              {/* Post Content */}
              <Text style={styles.postContent}>{post.content}</Text>

              {/* Post Media */}
              {post.media && post.media.length > 0 && (
                <View style={styles.mediaContainer}>
                  {post.media.map((media, index) => (
                    media.type === 'image' ? (
                      <Lightbox key={index}>
                        <Image source={{ uri: media.url }} style={styles.mediaImage} />
                      </Lightbox>
                    ) : (
                      <Video
                        source={{ uri: media.url }}
                        style={styles.mediaVideo}
                        controls
                      />
                    )
                  ))}
                </View>
              )}

              {/* Interaction Options */}
              <View style={styles.interactionContainer}>
                <TouchableOpacity onPress={() => post.is_liked ? unlikePost(post.id) : likePost(post.id)}>
                  <Text style={styles.interactionText}>{post.is_liked ? 'Unlike' : 'Like'} ({post.likeCount || 0})</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  Alert.prompt(
                    'Comment',
                    'Write your comment...',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Comment',
                        onPress: (commentText) => {
                          if (commentText && commentText.trim()) {
                            commentOnPost(post.id, commentText.trim());
                          } else {
                            Alert.alert('Error', 'Comment cannot be empty.');
                          }
                        },
                      },
                    ],
                    'plain-text'
                  );
                }}>
                  <Text style={styles.interactionText}>Comment</Text>
                </TouchableOpacity>
                <ModalDropdown
                  options={['Delete Post', 'Follow ' + post.user.username]} // Dropdown options
                  onSelect={(index) => handlePostOption(index, post.id)} 
                  style={styles.dropdown}
                >
                  <Text style={styles.dropdownText}>Options</Text>
                </ModalDropdown>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noPostsText}>No posts available.</Text>
        )}
      </ScrollView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 16,
    color: '#ff0000',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  createPostButton: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
  },
  createPostButtonText: {
    color: '#888888',
  },
  postBox: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  repostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  reposterAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  reposterName: {
    fontSize: 12,
    color: '#555555',
  },
  postContent: {
    fontSize: 16,
    marginBottom: 5,
  },
  mediaContainer: {
    marginBottom: 10,
  },
  mediaImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
  mediaVideo: {
    width: '100%',
    height: 200,
  },
  interactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  interactionText: {
    color: '#007bff',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    padding: 5,
    backgroundColor: '#ffffff',
  },
  dropdownText: {
    color: '#333333',
  },
  noPostsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999999',
  },
});

export default PostComponent;
