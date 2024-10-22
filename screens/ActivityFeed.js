import React, { useEffect, useContext, useState } from 'react';
import { View, Text, Image, Button, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from './AuthContext'; // Your auth context
import { fetchPosts, fetchUserProfile } from './api'; // Your custom API functions

const ActivityFeed = () => {
  const { user, token } = useContext(AuthContext); // Assuming you get user and token from context
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const fetchedPosts = await fetchPosts(token); // Call your API to fetch posts
        setPosts(fetchedPosts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [token]);

  const renderPost = (post) => {
    return (
      <View key={post.id} style={styles.postBox}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: post.reposter.profile_picture || '/default-images/avatar.png' }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{post.reposter.first_name} {post.reposter.surname}</Text>
        </View>
        <Text style={styles.time}>{post.created_at}</Text>
        <Text style={styles.postContent}>{post.content}</Text>
        <View style={styles.mediaContainer}>
          {post.media_path.map(media => {
            const extension = media.split('.').pop().toLowerCase();
            return (
              <View key={media} style={styles.mediaItem}>
                {['jpeg', 'jpg', 'png', 'gif'].includes(extension) ? (
                  <Image source={{ uri: media }} style={styles.mediaImage} />
                ) : ['mp4', 'mov', 'avi', 'wmv'].includes(extension) ? (
                  <Video source={{ uri: media }} style={styles.mediaVideo} controls />
                ) : null}
              </View>
            );
          })}
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => handleLike(post.id)}>
            <Text style={styles.buttonText}>{post.likes.includes(user.id) ? 'Unlike' : 'Like'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleComment(post.id)}>
            <Text style={styles.buttonText}>Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleRepost(post.id)}>
            <Text style={styles.buttonText}>Repost</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: user.profile_picture || '/default-images/avatar.png' }}
          style={styles.avatar}
        />
        <Button title="Write something interesting" onPress={() => {/* Open modal */}} />
      </View>
      <ScrollView>
        {posts.map(renderPost)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  postBox: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontWeight: 'bold',
    marginLeft: 10,
  },
  time: {
    color: 'gray',
    fontSize: 12,
  },
  postContent: {
    marginVertical: 10,
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mediaItem: {
    width: '48%',
    margin: '1%',
  },
  mediaImage: {
    width: '100%',
    height: 100,
    borderRadius: 5,
  },
  mediaVideo: {
    width: '100%',
    height: 100,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    color: 'blue',
  },
});

export default ActivityFeed;
