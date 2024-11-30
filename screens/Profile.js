import React, { useContext, useState } from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, Modal, StyleSheet, Linking, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Badge, Icon } from 'react-native-elements';
import Navbar from './Navbar'; // Adjust the path based on your file structure
import api from './api'; // Import your API setup with Axios
import { AuthContext } from './AuthContext'; // Import AuthContext for token management

const Profile = () => {
    const navigation = useNavigation();
    const { profileData, loading, error, notificationCount } = useContext(AuthContext);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showRepostSuccessModal, setShowRepostSuccessModal] = useState(false);
    const [commentInputVisible, setCommentInputVisible] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [showPostOptions, setShowPostOptions] = useState(null);

    const handleLike = async (postId) => {
        try {
            await api.post(`/posts/${postId}/like`);
            setShowSuccessModal(true);
        } catch (err) {
            console.error("Error liking post:", err);
        }
    };

    const handleCommentSubmit = async (postId) => {
        if (commentText.trim()) {
            try {
                await api.post(`/posts/${postId}/comments`, { text: commentText });
                setCommentText('');
                setCommentInputVisible(null);
            } catch (err) {
                console.error("Error submitting comment:", err);
            }
        }
    };

    const handleRepost = async (postId) => {
        try {
            await api.post(`/posts/${postId}/repost`);
            setShowRepostSuccessModal(true);
        } catch (err) {
            console.error("Error reposting:", err);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await api.delete(`/posts/${postId}`);
            alert('Post deleted successfully!');
            setShowPostOptions(null);
        } catch (err) {
            console.error("Error deleting post:", err);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#008080" style={styles.loadingIndicator} />;
    }

    if (error) {
        return <Text style={styles.errorText}>Error: {error}</Text>;
    }

    if (!profileData) {
        return <Text>No profile data available</Text>;
    }

    const { user, posts, profileDetails, followersCount } = profileData;

    return (
        <View style={styles.container}>
            <Navbar navigation={navigation} notificationCount={notificationCount} />
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.profileContainer}>
                    <Avatar
                        rounded
                        size="xlarge"
                        source={{ uri: user?.profile_picture ? `https://tbooke.net/storage/${user.profile_picture}` : require('./../assets/images/avatar.png') }}
                        containerStyle={styles.avatar}
                    />
                    <Text style={styles.profileName}>
                        {user.profile_type === 'institution' && profileDetails?.institution_name
                            ? profileDetails.institution_name
                            : `${user.first_name} ${user.surname}`}
                    </Text>
                    <Text style={styles.profileType}>{user.profile_type}</Text>
                    <Text style={styles.followersCount}>Connections: {followersCount}</Text>
                </View>

                <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile', { profileData })}>
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>

                {/* Activities Section */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Activities</Text>
                    {posts.length === 0 ? (
                        <Text style={styles.noActivitiesText}>You do not have any activities.</Text>
                    ) : (
                        posts.map((post, index) => (
                            <View key={index} style={styles.postBox}>
                                <Avatar
                                    rounded
                                    size="small"
                                    source={{ uri: post.user?.profile_picture || './../assets/images/avatar.png' }}
                                    containerStyle={styles.avatarSmall}
                                />
                                <View style={styles.postContent}>
                                    <Text style={styles.postUserName}>
                                        {post.user?.first_name} {post.user?.surname}
                                    </Text>
                                    <Text style={styles.postText}>{post.content}</Text>

                                    <View style={styles.actions}>
                                        <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(post.id)}>
                                            <Icon name="thumb-up" type="material" color="#333" size={20} />
                                            <Text style={styles.actionText}>Like</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={() => setCommentInputVisible(commentInputVisible === index ? null : index)}
                                        >
                                            <Icon name="comment" type="material" color="#333" size={20} />
                                            <Text style={styles.actionText}>Comment</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.actionButton} onPress={() => handleRepost(post.id)}>
                                            <Icon name="share" type="material" color="#333" size={20} />
                                            <Text style={styles.actionText}>Repost</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {commentInputVisible === index && (
                                        <View style={styles.commentInputContainer}>
                                            <TextInput
                                                style={styles.commentInput}
                                                placeholder="Write a comment..."
                                                value={commentText}
                                                onChangeText={setCommentText}
                                            />
                                            <TouchableOpacity style={styles.submitButton} onPress={() => handleCommentSubmit(post.id)}>
                                                <Text style={styles.submitButtonText}>Submit</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                    {/* Post Options */}
                                    <TouchableOpacity onPress={() => setShowPostOptions(showPostOptions === index ? null : index)} style={styles.optionsButton}>
                                        <Icon name="more-horiz" type="material" color="#333" />
                                    </TouchableOpacity>
                                    {showPostOptions === index && (
                                        <View style={styles.optionsMenu}>
                                            <TouchableOpacity onPress={() => handleDeletePost(post.id)}>
                                                <Text style={styles.optionsText}>Delete Post</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => navigation.navigate('Profile', { userId: post.user.id })}>
                                                <Text style={styles.optionsText}>View Profile</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        justifyContent: 'flex-start',
    },
    scrollContainer: {
        flex: 1,
    },
    profileContainer: {
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#eaeaea',
    },
    avatar: {
        marginBottom: 8,
        borderWidth: 2,
        borderColor: '#008080',
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    profileType: {
        color: '#6c757d',
        fontSize: 14,
    },
    followersCount: {
        color: '#6c757d',
        fontSize: 14,
    },
    editButton: {
        backgroundColor: '#008080',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 16,
        marginHorizontal: 16,
    },
    editButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    card: {
        margin: 16,
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    postBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 8,
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        elevation: 1,
    },
    avatarSmall: {
        marginRight: 10,
    },
    postContent: {
        flex: 1,
    },
    postUserName: {
        fontWeight: 'bold',
        color: '#333',
    },
    postText: {
        marginVertical: 4,
        color: '#555',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 8,
    },
    actionButton: {
        alignItems: 'center',
    },
    actionText: {
        marginTop: 4,
        fontSize: 12,
        color: '#555',
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    commentInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    submitButton: {
        backgroundColor: '#008080',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    optionsButton: {
        alignSelf: 'flex-end',
        marginTop: 5,
        top: -100,
    },
    optionsMenu: {
        position: 'absolute',
        right: 0,
        top: 30,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        padding: 10,
        elevation: 5,
    },
    optionsText: {
        paddingVertical: 5,
        fontSize: 16,
        color: '#333',
    },
});

export default Profile;
