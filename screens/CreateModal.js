import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal } from 'react-native';
import axios from 'axios';

const CreateModal = ({ navigation }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null); // Handle media uploads

  const handleCreatePost = async () => {
    try {
      await axios.post('http://192.168.12.117:8000/api/groups/create-post', {
        content,
        media,
      });
      navigation.goBack(); // Navigate back after creating a post
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal visible={true} animationType="slide">
      <View style={{ padding: 20 }}>
        <Text>Create a Post</Text>
        <TextInput
          placeholder="Content"
          value={content}
          onChangeText={setContent}
          style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
        />
        {/* Implement media upload if needed */}
        <Button title="Submit" onPress={handleCreatePost} />
        <Button title="Cancel" onPress={() => navigation.goBack()} />
      </View>
    </Modal>
  );
};

export default CreateModal;
