import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const AddCommentForm = ({ postId, addComment }) => {
  const [commentContent, setCommentContent] = useState('');

  const handleSubmit = () => {
    addComment(postId, commentContent);
    setCommentContent('');
  };

  return (
    <View style={styles.addCommentContainer}>
      <TextInput
        style={styles.commentInput}
        placeholder="Add a comment..."
        value={commentContent}
        onChangeText={setCommentContent}
      />
      <TouchableOpacity style={styles.commentSubmitButton} onPress={handleSubmit}>
        <Icon name="send" size={20} color="#0d6efd" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: '#e9ecef',
    paddingTop: 8,
  },
  commentInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
  },
  commentSubmitButton: {
    marginLeft: 8,
  },
});

export default AddCommentForm;
