import React, { useState, useContext, useEffect, useCallback } from 'react';
import {View,Text,Button,TouchableOpacity,Image,TextInput,StyleSheet,FlatList,ActivityIndicator,Alert,Share,Dimensions,} from 'react-native';
import api from './api';
import { AuthContext } from './AuthContext';
import Icon from 'react-native-vector-icons/Feather';
import Navbar from './Navbar';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import Modal from 'react-native-modal';
import ImageViewing from 'react-native-image-viewing';
import styles from './styles';


const { width } = Dimensions.get('window');
const BASE_URL = 'https://tbooke.net/api/feed';
const MAX_MEDIA_DISPLAY = 6; // Maximum to display per post
const Feed = ({ route }) => {
  const { authToken, user, profileData} = useContext(AuthContext);
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
  const userId = route?.params?.userId || profileData?.user?.id;

  const [visibleDropdownPostId, setVisibleDropdownPostId] = useState(null); // State to track which post's dropdown is visible

// Function to toggle dropdown for a specific post
const toggleDropdown = (postId) => {
  setVisibleDropdownPostId((prevPostId) => (prevPostId === postId ? null : postId));
};

// Function to close the dropdown
const handleCloseDropdown = () => {
  setVisibleDropdownPostId(null);
};

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
  
    console.log(`Submitting comment for Post ID: ${postId}`);
    console.log(`Comment Content: ${content}`);
  
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
      
      // Clear the comment content after successful submission
      setCommentContents((prev) => ({ ...prev, [postId]: '' }));
      
      // Fetch the posts and display them in the terminal
      fetchPosts();
      fetchComments();  // Fetch and log the comments after submitting
      
      Alert.alert('Success', 'Comment submitted successfully.');
      
      setActiveCommentsPostIds((prev) => prev.filter((id) => id !== postId));
      
    } catch (error) {
      console.error('Comment Submit Error:', error);
      Alert.alert('Error', 'Failed to submit comment. Please try again later.');
    }
  };

  const handleLikePost = async (postId) => {
    const post = posts.find((post) => post.id === postId);
    // if (post.isLiked) {
    //   // If already liked, show an alert and return
    //   Alert.alert("Notice", "You've already liked this post.");
    //   return;
    // }
  
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
  
      // Update local state optimistically
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likes_count: (post.likes_count || 0) + 1, isLiked: true }
            : post
        )
      );
    } catch (error) {
      if (error.response?.status === 409) {
        Alert.alert("Notice", "You've already liked this post.");
      } else {
        console.error("Like Post Error:", error);
        Alert.alert("Error", "Failed to like post. Please try again later.");
      }
    }
  };
  
  const handleUnlikePost = async (postId) => {
    const post = posts.find((post) => post.id === postId);
    if (!post.isLiked) {
      // If already unliked, show an alert and return
      Alert.alert("Notice", "You've already unliked this post.");
      return;
    }
  
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
  
      // Update local state optimistically
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likes_count: (post.likes_count || 0) - 1, isLiked: false }
            : post
        )
      );
    } catch (error) {
      if (error.response?.status === 409) {
        Alert.alert("Notice", "You've already unliked this post.");
      } else {
        console.error("Unlike Post Error:", error);
        Alert.alert("Error", "Failed to unlike post. Please try again later.");
      }
    }
  };




  const formatDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);

    // Check for seconds
    let interval = Math.floor(seconds);
    if (interval < 60) return `${interval} second${interval === 1 ? '' : 's'} ago`;

    // Check for minutes
    interval = Math.floor(seconds / 60);
    if (interval < 60) return `${interval} minute${interval === 1 ? '' : 's'} ago`;

    // Check for hours
    interval = Math.floor(seconds / 3600);
    if (interval < 24) return `${interval} hour${interval === 1 ? '' : 's'} ago`;

    // Check for days
    interval = Math.floor(seconds / 86400);
    if (interval < 7) return `${interval} day${interval === 1 ? '' : 's'} ago`;

    // Check for weeks
    interval = Math.floor(seconds / 604800);
    if (interval < 52) return `${interval} week${interval === 1 ? '' : 's'} ago`;

    // Check for months
    interval = Math.floor(seconds / 2592000);
    if (interval < 12) return `${interval} month${interval === 1 ? '' : 's'} ago`;

    // Check for years
    interval = Math.floor(seconds / 31536000);
    return `${interval} year${interval === 1 ? '' : 's'} ago`;
};
  

   // Handler to follow a user
const handleFollow = async (userId) => {
  if (!userId) {
    Alert.alert('Error', 'User ID is undefined.');
    return;
  }
  try {
    await api.post(
      `/users/${userId}/follow`, // Corrected endpoint for following a user
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    Alert.alert('Success', 'You are now following this user.');
    setActiveDropdownPostId(null); // Close the dropdown after action
    fetchPosts(); // Refresh posts list to reflect follow action
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


  const handleDeletePost = (postId) => {
    if (!postId) {
      Alert.alert('Error', 'Post ID is undefined.');
      return;
    }
    
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Yes', 
          onPress: async () => {
            try {
              await api.delete(
                `/posts/${postId}`,
                {
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                  },
                }
              );
              Alert.alert('Success', 'Post deleted successfully.');
              setActiveDropdownPostId(null); // Close the dropdown after action
              fetchPosts(); // Refresh posts list
            } catch (error) {
              console.error('Delete Post Error:', error);
              Alert.alert('Error', 'Failed to delete post. Please try again later.');
            }
          } 
        },
      ],
      { cancelable: true }
    );
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

    // Log the full postUser details for debugging purposes
    console.log('Navigating to profile of user:', postUser);

    // Determine the target screen based on user identity
    const targetScreen = postUser.id === userId ? 'Profile' : 'OwnProfile';

    // Pass the entire postUser object to the target screen
    navigation.navigate(targetScreen, { postUser });
};

  const renderComment = ({ item }) => {
  // Use item.user to access the comment author's data, or fall back to profileData if no user is found
  const user = item.user || profileData?.user;
  
  return (
    <View style={styles.commentItem}>
      <TouchableOpacity onPress={() => navigateToProfile(user)}>
        <Image
          source={
            user?.profile_picture
              ? { uri: `https://tbooke.net/storage/${user.profile_picture}` }
              : profileData?.profile_picture
              ? { uri: `https://tbooke.net/storage/${profileData.profile_picture}` }
              : require('./../assets/images/avatar.png')
          }
          style={styles.profileImage}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={styles.commentContent}>
        <TouchableOpacity onPress={() => navigateToProfile(user)}>
             <Text style={styles.commentUserName}>
            {user?.profile_type === 'institution'
              ? user.institutionDetails?.institution_name || 'Institution Name Unavailable'
              : `${user.first_name || ''} ${user.surname || ''}`.trim() || 'Unknown Author'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.commentText}>{item.content || 'No comment content.'}</Text>
        
        <Text style={styles.commentTime}>
          {item.created_at ? formatDate(item.created_at) : ''}
        </Text>
      </View>
    </View>
  );
};


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
    const isLiked = item.isLiked || false; // Get the like status
    const likesCount = item.likes_count || 0; // Get the likes count

    // const isLiked = item.original_post?.isLiked || item.isLiked ;
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

    // Added debugging logs (optional, remove in production)
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
          <View>
            {/* Dropdown Button */}
      <TouchableOpacity style={styles.dropdownButton} onPress={() => toggleDropdown(item.id)}>
        <Icon name="more-horizontal" size={24} color="#008080" />
      </TouchableOpacity>

      {/* Dropdown Menu */}
      {visibleDropdownPostId === item.id && (
        <View style={styles.dropdownMenu}>
          {item.user.id === userId ? (
            // If the post belongs to the authenticated user, show the Delete button
            <TouchableOpacity 
              style={styles.dropdownItem} 
              onPress={() => {
                handleDeletePost(item.id); // Call delete function
                handleCloseDropdown();
              }}
            >
              <Text style={styles.dropdownText}>Delete</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.dropdownItem} 
              onPress={() => {
                handleFollow(item.user.id);
                handleCloseDropdown();
              }}
            >
              <Text style={styles.dropdownText}>Follow</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
        </View>
        <View style={styles.actions}>
  {/* Like Button */}
  <TouchableOpacity
    style={[styles.actionButton, { flexDirection: 'column', alignItems: 'center' }]}
    onPress={() => (isLiked ? handleUnlikePost(postId) : handleLikePost(postId))}
  >
    <Icon
      name={isLiked ? 'thumbs-down' : 'thumbs-up'}
      size={18}
      color={isLiked ? 'blue' : '#008080'}
    />
    <Text style={styles.actionText}>
      {isLiked ? 'Unlike' : 'Like'} ({likesCount})
    </Text>
  </TouchableOpacity>

  {/* Comment Button */}
  <TouchableOpacity
    style={[styles.actionButton, { flexDirection: 'column', alignItems: 'center' }]}
    onPress={() => toggleComments(postId)}
  >
    <Icon name="message-square" size={18} color="#008080" />
    <Text style={styles.actionText}>Comment ({item.comments_count || 0})</Text>
  </TouchableOpacity>

  {/* Repost Button */}
  <TouchableOpacity
    style={[styles.actionButton, { flexDirection: 'column', alignItems: 'center' }]}
    onPress={() => handleRepostPost(postId)}
    disabled={isReposting}
  >
    <Icon name="repeat" size={18} color="#008080" />
    <Text style={styles.actionText}>Repost ({item.repost_count || 0})</Text>
    {isReposting && (
      <ActivityIndicator size="small" color="#28a745" style={{ marginLeft: 5 }} />
    )}
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
        {loading && <ActivityIndicator size="small" color="#456" />}
        {error && <Text style={styles.errorText}>{error}</Text>}
      {/* Success Modal */}
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
export default Feed;