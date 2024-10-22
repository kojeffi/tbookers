import React, { useContext, useState } from 'react'; 
import { View, Text, Button, ScrollView, TouchableOpacity, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Badge } from 'react-native-elements';
import Navbar from './Navbar'; // Adjust the path based on your file structure
import api from './api'; // Import your API setup with Axios
import { AuthContext } from './AuthContext'; // Import AuthContext for token management
import { useRoute } from '@react-navigation/native';


const OwnProfile = () => {
    const navigation = useNavigation();
    const { profileData, loading, error, notificationCount, user } = useContext(AuthContext);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showRepostSuccessModal, setShowRepostSuccessModal] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false); // Track follow status
    const route = useRoute();
    const userId = route.params?.userId; // Get user ID from navigation params
    const [userProfile, setUserProfile] = useState(null);
    

    // Navigate to another user's profile
    const navigateToProfile = (user) => {
        if (user && user.id) {
            navigation.navigate('OwnProfile', { userId: user.id });
        } else {
            console.warn('Unable to navigate to profile: Invalid user data');
        }
    };

    // Handle liking a post
    const handleLike = async (postId) => {
        try {
            await api.post(`/posts/${postId}/like`);
            setShowSuccessModal(true);
        } catch (err) {
            console.error("Error liking post:", err);
        }
    };

    // Follow/Unfollow functionality
    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                await api.post(`/unfollow/${user.id}`); // Adjust API endpoint
            } else {
                await api.post(`/follow/${user.id}`); // Adjust API endpoint
            }
            setIsFollowing(!isFollowing);
        } catch (err) {
            console.error("Error following/unfollowing:", err);
        }
    };

    // Handle commenting on a post
    const handleComment = (postId) => {
        navigation.navigate('CommentScreen', { postId });
    };

    // Handle reposting a post
    const handleRepost = async (postId) => {
        try {
            await api.post(`/posts/${postId}/repost`);
            setShowRepostSuccessModal(true);
        } catch (err) {
            console.error("Error reposting:", err);
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

    const { user: postUser, posts, profileDetails, followersCount } = profileData;

    return (
        <View style={styles.container}>
            <Navbar navigation={navigation} notificationCount={notificationCount} />
            <ScrollView style={styles.scrollContainer}>
                {/* Profile Details */}
                <View style={styles.profileContainer}>
                    <Avatar
                        rounded
                        size="large"
                        source={{ uri: postUser?.profile_picture ? `https://tbooke.net/storage/${postUser.profile_picture}` : require('./../assets/images/avatar.png') }}
                        containerStyle={styles.avatar}
                    />
                    <Text style={styles.profileName}>
                        {postUser.profile_type === 'institution' && profileDetails?.institution_name
                            ? profileDetails.institution_name
                            : `${postUser.first_name} ${postUser.surname}`}
                    </Text>
                    <Text style={styles.profileType}>{postUser.profile_type}</Text>
                    <Text style={styles.followersCount}>Connections: {followersCount}</Text>
                </View>

                <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile', { profileData })}>
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>

                {/* Follow/Unfollow Button */}
                <TouchableOpacity 
                    style={[styles.actionButton, isFollowing ? styles.unfollowButton : styles.followButton]}
                    onPress={handleFollowToggle}
                >
                    <Text style={styles.actionText}>{isFollowing ? 'Remove Connection' : 'Connect'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.messageButton} onPress={() => navigation.navigate('Messages', { username: postUser.username })}>
                    <Text style={styles.actionText}>Message</Text>
                </TouchableOpacity>

                {/* About Me */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>About Me</Text>
                    <Text>{profileDetails?.about || "You haven't added about you."}</Text>
                </View>

                {/* My Subjects */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>My Subjects</Text>
                    <View style={styles.subjectLinks}>
                        {profileDetails?.user_subjects?.split(',').map((subject, index) => (
                            <Badge key={index} value={subject.trim()} badgeStyle={styles.badge} textStyle={styles.badgeText} />
                        )) || <Text>You haven't added any subjects.</Text>}
                    </View>
                </View>

                {/* Favorite Topics */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Favorite Topics</Text>
                    <View style={styles.favoriteTopicLinks}>
                        {profileDetails?.favorite_topics?.split(',').map((topic, index) => (
                            <Badge key={index} value={topic.trim()} badgeStyle={styles.badge} textStyle={styles.badgeText} />
                        )) || <Text>You haven't added any favorite topics.</Text>}
                    </View>
                </View>

                {/* Activities */}
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
                                    source={{ uri: postUser?.profile_picture ? `https://tbooke.net/storage/${postUser.profile_picture}` : require('./../assets/images/avatar.png') }}
                                    containerStyle={styles.avatar}
                                />
                                <View style={styles.postContent}>
                                    <Text style={styles.postUserName} onPress={() => navigateToProfile(post.user)}>
                                        {post.user?.first_name} {post.user?.surname}
                                    </Text>
                                    <Text style={styles.postText}>{post.content}</Text>
                                    <View style={styles.mediaContainer}>
                                        {/* Render media based on type */}
                                    </View>
                                    {/* Like, Comment, and Repost Buttons */}
                                    <View style={styles.actions}>
                                        <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(post.id)}>
                                            <Text style={styles.actionText}>Like</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.actionButton} onPress={() => handleComment(post.id)}>
                                            <Text style={styles.actionText}>Comment</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.actionButton} onPress={() => handleRepost(post.id)}>
                                            <Text style={styles.actionText}>Repost</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))
                    )}
                </View>

                {/* Success Modals */}
                <Modal
                    transparent={true}
                    visible={showSuccessModal}
                    onRequestClose={() => setShowSuccessModal(false)}
                    animationType="slide"
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Post created successfully</Text>
                            <Button title="Close" onPress={() => setShowSuccessModal(false)} />
                        </View>
                    </View>
                </Modal>

                <Modal
                    transparent={true}
                    visible={showRepostSuccessModal}
                    onRequestClose={() => setShowRepostSuccessModal(false)}
                    animationType="slide"
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Repost successful</Text>
                            <Button title="Close" onPress={() => setShowRepostSuccessModal(false)} />
                        </View>
                    </View>
                </Modal>
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
        marginBottom: 4,
    },
    profileType: {
        fontSize: 16,
        color: '#666',
    },
    followersCount: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    editButton: {
        backgroundColor: '#008080',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
    editButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    actionButton: {
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
    },
    followButton: {
        backgroundColor: '#008080',
    },
    unfollowButton: {
        backgroundColor: '#ff4d4d',
    },
    actionText: {
        color: '#ffffff',
        textAlign: 'center',
    },
    messageButton: {
        backgroundColor: '#6c757d',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginBottom: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#eaeaea',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subjectLinks: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    favoriteTopicLinks: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    badge: {
        backgroundColor: '#008080',
        margin: 4,
    },
    badgeText: {
        color: '#ffffff',
    },
    noActivitiesText: {
        textAlign: 'center',
        color: '#666',
    },
    postBox: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eaeaea',
    },
    postContent: {
        flex: 1,
        marginLeft: 10,
    },
    postUserName: {
        fontWeight: 'bold',
        color: '#008080',
        marginBottom: 4,
    },
    postText: {
        fontSize: 16,
        marginBottom: 4,
    },
    mediaContainer: {
        marginBottom: 8,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
});

export default OwnProfile;
