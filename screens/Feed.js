import React, { useState, useContext, useEffect, useCallback } from 'react';
import {View,Text,Button,TouchableOpacity,Image,TextInput,StyleSheet,FlatList,ActivityIndicator,Alert,Share,Dimensions,} from 'react-native';
import api from './api';
import { AuthContext } from './AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from './Navbar';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import Modal from 'react-native-modal';
import ImageViewing from 'react-native-image-viewing';
import UserProfile from './UserProfile';


const { width } = Dimensions.get('window');
const BASE_URL = 'http://192.168.12.117:8000/api';

const MAX_MEDIA_DISPLAY = 6; // Maximum media files to display directly

const Feed = ({ user }) => {
  const { authToken} = useContext(AuthContext);
  const navigation = useNavigation();
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successModalRepostVisible, setSuccessModalRepostVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [activeDropdownPostId, setActiveDropdownPostId] = useState(null);
  const [activeCommentsPostIds, setActiveCommentsPostIds] = useState([]);
  const [commentContents, setCommentContents] = useState({});
  const [repostingPostIds, setRepostingPostIds] = useState([]);
  const [isImageViewingVisible, setIsImageViewingVisible] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentMediaArray, setCurrentMediaArray] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );
  

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/feed', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const postsArray = response.data.posts ? Object.values(response.data.posts) : [];

      // Log the fetched posts for debugging
      console.log('Fetched Posts:', postsArray);

      // Filter out duplicate posts based on postId
      const uniquePosts = [];
      const seenIds = new Set();

      postsArray.forEach((post) => {
        const postId = post.original_post?.id || post.id;
        if (postId && !seenIds.has(postId)) {
          seenIds.add(postId);
          uniquePosts.push(post);
        }
      });

      setPosts(uniquePosts);
    } catch (error) {
      console.error('Fetch Posts Error:', error);
      setError('Failed to fetch posts. Please try again later.');
      Alert.alert('Error', 'Failed to fetch posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (postId) => {
    const content = commentContents[postId]?.trim();
    if (!content) {
      Alert.alert('Validation Error', 'Comment cannot be empty.');
      return;
    }

    try {
      await api.post(
        '/comment',
        { content, post_id: postId },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      // Reset comment content for the post
      setCommentContents((prev) => ({ ...prev, [postId]: '' }));
      // Refresh posts to show new comment
      fetchPosts();
      Alert.alert('Success', 'Comment submitted successfully.');
      // Collapse comments section
      setActiveCommentsPostIds((prev) => prev.filter((id) => id !== postId));
    } catch (error) {
      console.error('Comment Submit Error:', error);
      Alert.alert('Error', 'Failed to submit comment. Please try again later.');
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await api.post(
        `/post/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      fetchPosts();
    } catch (error) {
      console.error('Like Post Error:', error);
      Alert.alert('Error', 'Failed to like post. Please try again later.');
    }
  };

  const handleUnlikePost = async (postId) => {
    try {
      await api.post(
        `/post/${postId}/unlike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      fetchPosts();
    } catch (error) {
      console.error('Unlike Post Error:', error);
      Alert.alert('Error', 'Failed to unlike post. Please try again later.');
    }
  };

  // Handler to follow a user
  const handleFollow = async (userId) => {
    if (!userId) {
      Alert.alert('Error', 'User ID is undefined.');
      return;
    }
    try {
      await api.post(
        `/users/${userId}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      Alert.alert('Success', 'You are now following this user.');
      setActiveDropdownPostId(null); // Close the dropdown after action
      fetchPosts();
    } catch (error) {
      console.error('Follow User Error:', error);
      Alert.alert('Error', 'Failed to follow user. Please try again later.');
    }
  };

  // Handler to repost a post
  const handleRepostPost = async (postId) => {
    // Prevent multiple reposts on the same post simultaneously
    if (repostingPostIds.includes(postId)) return;

    setRepostingPostIds((prev) => [...prev, postId]);

    try {
      await api.post(
        `/posts/${postId}/repost`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      Alert.alert('Success', 'Post reposted successfully.');
      fetchPosts();
    } catch (error) {
      console.error('Repost Error:', error);
      Alert.alert('Error', 'Failed to repost. Please try again later.');
    } finally {
      setRepostingPostIds((prev) => prev.filter((id) => id !== postId));
    }
  };

  // Handler to delete a post
  const handleDeletePost = async (postId) => {
    if (!postId) {
      Alert.alert('Error', 'Post ID is undefined.');
      return;
    }
    try {
      await api.post(
        `/post/${postId}/delete`, // Ensure this endpoint is correct
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      Alert.alert('Success', 'Post deleted successfully.');
      setActiveDropdownPostId(null); // Close the dropdown after action
      fetchPosts();
    } catch (error) {
      console.error('Delete Post Error:', error);
      Alert.alert('Error', 'Failed to delete post. Please try again later.');
    }
  };

  // Handler to share a post
  const handleSharePost = async (postId) => {
    const post = posts.find((p) => (p.original_post?.id || p.id) === postId);
    if (!post) {
      Alert.alert('Error', 'Post not found.');
      return;
    }

    const message = post.original_post?.content || post.content || 'Check out this post!';

    try {
      const result = await Share.share({
        message: message,
        // You can add a URL or other data here if available
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      console.error('Share Post Error:', error);
      Alert.alert('Error', 'Failed to share post.');
    }
  };

  const toggleComments = (postId) => {
    if (activeCommentsPostIds.includes(postId)) {
      setActiveCommentsPostIds(activeCommentsPostIds.filter((id) => id !== postId));
    } else {
      setActiveCommentsPostIds([...activeCommentsPostIds, postId]);
    }
  };

  const navigateToProfile = (postUser) => {
    if (!postUser || !postUser.id) {
      Alert.alert('Error', 'User information is unavailable.');
      return;
    }

    if (postUser.id === user?.id) {
      // Navigate to Own Profile
      navigation.navigate('OwnProfile'); // Ensure 'OwnProfile' is defined in your navigator
    } else {
      // Navigate to Other User's Profile
      navigation.navigate('Profile', { username: postUser.username }); // Ensure 'Profile' is defined and accepts 'username' as a parameter
    }
  };


  const formatDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;
    return 'just now';
  };
  

  const renderComment = ({ item }) => (
    <View style={styles.commentItem}>
      {item.user ? (
        <TouchableOpacity onPress={() => navigateToProfile(item.user)}>
          <Image
            source={
              item.user.profile_picture
                ? { uri: `https://tbooke.net/storage/${item.user.profile_picture}` }
                : require('./../assets/images/avatar.png')
            }
            style={styles.profileImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      ) : (
        <Image
          source={require('./../assets/images/avatar.png')}
          style={styles.profileImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.commentContent}>
        {item.user ? (
          <TouchableOpacity onPress={() => navigateToProfile(item.user)}>
            <Text style={styles.commentUserName}>
              {item.user.profile_type === 'institution'
                ? item.user.institutionDetails?.institution_name
                : `${item.user.first_name} ${item.user.surname}`}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.commentUserName}>Anonymous</Text>
        )}
        <Text style={styles.commentText}>{item.content || 'No comment content.'}</Text>
        <Text style={styles.commentTime}>
          {item.created_at ? formatDate(item.created_at) : ''}
        </Text>
        {/* <Text>{item.created_at}</Text> */}
      </View>
    </View>
  );
  
  

  const handleMediaPress = (mediaIndex, mediaArray) => {
    setCurrentMediaIndex(mediaIndex);
    setCurrentMediaArray(mediaArray);
    setIsImageViewingVisible(true);
  };

  const renderPostItem = ({ item }) => {
    const postId = item.original_post?.id || item.id;

    // Skip rendering if postId is undefined to prevent errors
    if (!postId) {
      console.warn('Post skipped due to undefined postId:', item);
      return null;
    }

    const isLiked = item.original_post?.isLiked || item.isLiked;
    const isCurrentUserPost = item.user?.id === user?.id;
    const isDropdownActive = activeDropdownPostId === postId;
    const areCommentsActive = activeCommentsPostIds.includes(postId);
    const commentContent = commentContents[postId] || '';
    const isReposting = repostingPostIds.includes(postId);

    // Determine if the current user is the author
    const isOwnPost = isCurrentUserPost;

    // User Name Display Logic
    const userName = isOwnPost
      ? item.user.profile_type === 'institution' && item.user.institutionDetails
        ? item.user.institutionDetails.institution_name
        : `${item.user.first_name || ''} ${item.user.surname || 'Anonymous'}`
      : item.user.profile_type === 'institution' && item.user.institutionDetails
      ? item.user.institutionDetails.institution_name
      : `${item.user.first_name || ''} ${item.user.surname || 'Anonymous'}`;

    // Media Display Logic
    let mediaArray = item.original_post?.media_path || item.media_path || [];

    // Ensure mediaArray is always an array
    if (typeof mediaArray === 'string') {
      mediaArray = [mediaArray];
    } else if (!Array.isArray(mediaArray)) {
      mediaArray = [];
    }

    const mediaCount = mediaArray.length;
    const displayMedia = mediaArray.slice(0, MAX_MEDIA_DISPLAY);
    const remainingMediaCount = mediaCount > MAX_MEDIA_DISPLAY ? mediaCount - MAX_MEDIA_DISPLAY : 0;

    // Add debugging logs (optional, remove in production)
    console.log('mediaArray:', mediaArray, 'Type:', typeof mediaArray, Array.isArray(mediaArray));
    console.log('displayMedia:', displayMedia, 'Type:', typeof displayMedia, Array.isArray(displayMedia));

    return (
      <View style={styles.postBox}>
        {/* User Information and Post Details */}
        <View style={styles.userImageContainer}>
          {item.user ? (
            <TouchableOpacity onPress={() => navigateToProfile(item.user)}>
              <Image
                source={
                  item.user.profile_picture
                    ? { uri: `https://tbooke.net/storage/${item.user.profile_picture}` }
                    : require('./../assets/images/avatar.png')
                }
                style={styles.userImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ) : (
            <Image
              source={require('./../assets/images/avatar.png')}
              style={styles.userImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.postDetails}>
            <TouchableOpacity onPress={() => navigateToProfile(item.user)}>
              <Text style={styles.userName}>{userName}</Text>
            </TouchableOpacity>
            <Text style={styles.postTime}>
          {item.created_at ? formatDate(item.created_at) : ''}
              {/* {item.created_at ? new Date(item.created_at).toLocaleString() : ''} */}
            </Text>
            <Text style={styles.postContent}>
              {item.original_post?.content || item.content || 'No content available.'}
            </Text>

            {/* Display Media Files */}
            {mediaArray.length > 0 && (
              <View style={styles.mediaContainer}>
                {displayMedia.map((media, index) => {
                  const extension = media.split('.').pop().toLowerCase();
                  const mediaUri = `https://tbooke.net/storage/${media}`;

                  // Log each media URI for debugging (optional)
                  console.log(`Rendering media [${index}]:`, mediaUri);

                  // Determine if this is the last media to display and there are more media files
                  const isLastMedia = index === MAX_MEDIA_DISPLAY - 1 && remainingMediaCount > 0;

                  if (isLastMedia) {
                    return (
                      <TouchableOpacity
                        key={`${postId}-media-${index}`}
                        onPress={() => handleMediaPress(index, mediaArray)}
                        style={styles.mediaItem}
                      >
                        {['jpeg', 'jpg', 'png', 'gif'].includes(extension) ? (
                          <Image
                            source={{ uri: mediaUri }}
                            style={styles.mediaImage}
                            resizeMode="cover"
                            onError={(e) => {
                              console.error(`Error loading image ${mediaUri}:`, e.nativeEvent.error);
                            }}
                          />
                        ) : ['mp4', 'mov', 'avi', 'wmv'].includes(extension) ? (
                          <Video
                            source={{ uri: mediaUri }}
                            style={styles.mediaVideo}
                            controls
                            resizeMode="cover"
                            onError={(e) => {
                              console.error(`Error loading video ${mediaUri}:`, e);
                            }}
                          />
                        ) : null}
                        {/* Overlay for remaining media count */}
                        {remainingMediaCount > 0 && (
                          <View style={styles.overlay}>
                            <Text style={styles.overlayText}>+{remainingMediaCount}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  }

                  return (
                    <TouchableOpacity
                      key={`${postId}-media-${index}`}
                      onPress={() => handleMediaPress(index, mediaArray)}
                      style={styles.mediaItem}
                    >
                      {['jpeg', 'jpg', 'png', 'gif'].includes(extension) ? (
                        <Image
                          source={{ uri: mediaUri }}
                          style={styles.mediaImage}
                          resizeMode="cover"
                          onError={(e) => {
                            console.error(`Error loading image ${mediaUri}:`, e.nativeEvent.error);
                          }}
                        />
                      ) : ['mp4', 'mov', 'avi', 'wmv'].includes(extension) ? (
                        <Video
                          source={{ uri: mediaUri }}
                          style={styles.mediaVideo}
                          controls
                          resizeMode="cover"
                          onError={(e) => {
                            console.error(`Error loading video ${mediaUri}:`, e);
                          }}
                        />
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* Dropdown Button */}
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setActiveDropdownPostId(isDropdownActive ? null : postId)}
          >
            <Icon name="ellipsis-v" size={24} color="#333" />
            {isDropdownActive && (
              <View style={styles.dropdownMenu}>
                {isCurrentUserPost ? (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleDeletePost(postId)}
                  >
                    <Text style={styles.dropdownText}>Delete</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleFollow(item.user?.userid)}
                  >
                    <Text style={styles.dropdownText}>Follow</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Actions Section */}
        <View style={styles.actions}>
          {/* Like Button */}
          <TouchableOpacity
            style={[styles.actionButton,{ flexDirection: 'column', alignItems: 'center' }]}
            onPress={() => (isLiked ? handleUnlikePost(postId) : handleLikePost(postId))}
          >
            <Icon
              name={isLiked ? 'thumbs-up' : 'thumbs-o-up'}
              size={16}
              color={isLiked ? 'blue' : '#555'}
            />
            <Text style={styles.actionText}>
              {isLiked ? 'Unlike' : 'Like'} ({item.likes_count || 0})
            </Text>
          </TouchableOpacity>

          {/* Comment Button */}
          <TouchableOpacity style={[styles.actionButton,{ flexDirection: 'column', alignItems: 'center' }]} onPress={() => toggleComments(postId)}>
            <Icon name="comment" size={16} color="#555" />
            <Text style={styles.actionText}>Comment ({item.comments_count || 0})</Text>
          </TouchableOpacity>

          {/* Repost Button */}
          <TouchableOpacity
            style={[styles.actionButton,{ flexDirection: 'column', alignItems: 'center' }]}
            onPress={() => handleRepostPost(postId)}
            disabled={isReposting}
          >
            <Icon name="retweet" size={16} color="#555" />
            <Text style={styles.actionText}>Repost ({item.repost_count || 0})</Text>
            {isReposting && (
              <ActivityIndicator size="small" color="#28a745" style={{ marginLeft: 5 }} />
            )}
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity style={[styles.actionButton,{ flexDirection: 'column', alignItems: 'center' }]} onPress={() => handleSharePost(postId)}>
            <Icon name="share" size={16} color="#555" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>

        </View>

        {/* Conditionally render comments and comment input */}
        {areCommentsActive && (
          <>
            <FlatList
              data={item.comments || []}
              renderItem={renderComment}
              keyExtractor={(comment) => comment.id.toString()}
              style={styles.commentsList}
              nestedScrollEnabled={true}
            />
            <View style={styles.commentInputContainer}>
              <TextInput
                value={commentContent}
                onChangeText={(text) =>
                  setCommentContents((prev) => ({ ...prev, [postId]: text }))
                }
                placeholder="Post your comment"
                style={styles.commentInput}
              />
              <TouchableOpacity
                onPress={() => handleCommentSubmit(item.id)}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Image Viewing Modal */}
        <Modal
          isVisible={isImageViewingVisible}
          onBackdropPress={() => setIsImageViewingVisible(false)}
          onBackButtonPress={() => setIsImageViewingVisible(false)}
          animationIn="zoomIn"
          animationOut="zoomOut"
          style={styles.imageModal}
        >
          <View style={styles.modalContainer}>
            <ImageViewing
              images={currentMediaArray.map((media) => ({ uri: `https://tbooke.net/storage/${media}` }))}
              imageIndex={currentMediaIndex}
              visible={isImageViewingVisible}
              onRequestClose={() => setIsImageViewingVisible(false)}
            />
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Modal
        isVisible={successModalVisible} // Changed from 'visible' to 'isVisible'
        onBackdropPress={() => setSuccessModalVisible(false)} // Handle backdrop press to close
        onBackButtonPress={() => setSuccessModalVisible(false)} // Handle back button press on Android
        animationIn="slideInUp" // Optional: Customize animation
        animationOut="slideOutDown" // Optional: Customize animation
        style={styles.modal} // Optional: Customize modal style
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Post created successfully</Text>
              <Button title="Close" onPress={() => setSuccessModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
      {/* Repost Success Modal */}
      <Modal
        isVisible={successModalRepostVisible} // Changed from 'visible' to 'isVisible'
        onBackdropPress={() => setSuccessModalRepostVisible(false)} // Handle backdrop press to close
        onBackButtonPress={() => setSuccessModalRepostVisible(false)} // Handle back button press on Android
        animationIn="slideInUp" // Optional: Customize animation
        animationOut="slideOutDown" // Optional: Customize animation
        style={styles.modal} // Optional: Customize modal style
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Repost successful</Text>
              <Button title="Close" onPress={() => setSuccessModalRepostVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Posts FlatList */}
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(post) => (post.original_post?.id || post.id).toString()}
        contentContainerStyle={styles.scrollContainer}
        extraData={posts}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No posts available.</Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    marginTop:-30,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  button: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 15,
    paddingHorizontal: 10,

  },
  buttonText: {
    color: '#333',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
  },
  postBox: {
    backgroundColor: '#fff',
    padding: 10,
    marginHorizontal: 1,
    borderRadius: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    backgroundColor: '#f5f5f5',
    borderTopColor: '#008080',
    borderTopWidth: 1,
  },
  userImageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#008080'
  },
  postDetails: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#666',
  },
  postTime: {
    color: '#800',
    fontSize: 7,
    marginTop: 2,
  },
  postContent: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  mediaItem: {
    width: (width - 40) / 3, // Adjust based on your design
    height: (width - 40) / 3,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  mediaVideo: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dropdownButton: {
    padding: 5,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 40,
  },
  dropdownText: {
    fontSize: 12,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#555',
  },
  commentsList: {
    maxHeight: 200,
    marginTop: 10,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#008080'

  },
  commentContent: {
    marginLeft: 10,
    flex: 1,
  },
  commentUserName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentText: {
    fontSize: 14,
    marginTop: 2,
  },
  commentTime: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 10,
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
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
  imageModal: {
    margin: 0, // Fullscreen modal
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: 'maroon',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
  },
  submitButtonText: {
    color: '#fff',
  },
  commentsList: {
    height: 'auto',    // Set height to auto
    marginTop: 10,
  },
});

export default Feed;
