import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { AuthContext } from './AuthContext';
import api from './api';

const AddComment = ({ postId }) => {
    const { profileData } = useContext(AuthContext);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const submitComment = async () => {
        if (comment.trim() === '') {
            Alert.alert('Validation', 'Comment cannot be empty.');
            return;
        }
        setLoading(true);
        try {
            const response = await api.post('/comment', {
                post_id: postId,
                content: comment,
            });
            // Optionally update comments in parent component or use a state management solution
            Alert.alert('Success', 'Comment added.');
            setComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
            Alert.alert('Error', 'Failed to add comment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Post your comment"
                value={comment}
                onChangeText={setComment}
                multiline
            />
            <Button title={loading ? 'Submitting...' : 'Submit'} onPress={submitComment} disabled={loading} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 5,
        minHeight: 40,
    },
});

export default AddComment;
