// PostDetail.js
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Image, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import api from './api';
import { AuthContext } from './AuthContext';

const PostDetail = ({ route }) => {
  const { authToken } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const { postId } = route.params;

  useEffect(() => {
    fetchPostWithComments();
  }, [postId]);

  const fetchPostWithComments = async () => {
    try {
      const response = await api.get(`/post/${postId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setPost(response.data.post);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Fetch post error:', error);
      Alert.alert('Error', 'Failed to load post details.');
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async () => {
    if (!commentContent.trim()) {
      Alert.alert('Validation Error', 'Comment cannot be empty.');
      return;
    }
    try {
      await api.post('/comment', { content: commentContent, post_id: postId }, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCommentContent('');
      fetchPostWithComments();
      Alert.alert('Success', 'Comment submitted.');
    } catch (error) {
      console.error('Submit comment error:', error);
      Alert.alert('Error', 'Failed to submit comment.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View>
      {post && (
        <View>
          <Text>{post.user.first_name} {post.user.surname}</Text>
          <Text>{post.content}</Text>
          <Image source={{ uri: `https://tbooke.net/storage/${post.media_path[0]}` }} style={{ height: 200, width: 200 }} />
          {/* Display other media similarly */}
        </View>
      )}
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <View>
            <Text>{item.user.first_name || 'Anonymous'}: {item.content}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <TextInput
        placeholder="Add a comment"
        value={commentContent}
        onChangeText={setCommentContent}
        style={{ borderWidth: 1, borderColor: '#ccc', margin: 10, padding: 5 }}
      />
      <Button title="Submit Comment" onPress={submitComment} />
    </View>
  );
};

export default PostDetail;
