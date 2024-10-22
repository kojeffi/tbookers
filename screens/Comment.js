import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Comment = ({ comment }) => {
    const profileImage = comment.user.profile_picture
        ? { uri: `http://192.168.12.117:8000/storage/${comment.user.profile_picture}` }
        : require('./../assets/images/avatar.png'); // Add a default avatar in assets

    return (
        <View style={styles.commentContainer}>
            <Image source={profileImage} style={styles.profileImage} />
            <View style={styles.commentContent}>
                <Text style={styles.commentUser}>
                    {comment.user.profile_type === 'institution' && comment.user.institutionDetails
                        ? comment.user.institutionDetails.institution_name
                        : `${comment.user.first_name} ${comment.user.surname}`}
                </Text>
                <Text style={styles.commentText}>{comment.content}</Text>
                <Text style={styles.commentTime}>{new Date(comment.created_at).toLocaleString()}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    commentContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    profileImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
    },
    commentContent: {
        flex: 1,
    },
    commentUser: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    commentText: {
        fontSize: 14,
        marginVertical: 2,
    },
    commentTime: {
        fontSize: 12,
        color: '#6c757d',
    },
});

export default Comment;
