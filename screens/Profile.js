import React, { useContext, useState } from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, Modal, StyleSheet, Linking, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Badge } from 'react-native-elements';
import Navbar from './Navbar'; // Adjust the path based on your file structure
import api from './api'; // Import your API setup with Axios
import { AuthContext } from './AuthContext'; // Import AuthContext for token management

const Profile = () => {
    const navigation = useNavigation();
    const { profileData, loading, error, notificationCount } = useContext(AuthContext);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showRepostSuccessModal, setShowRepostSuccessModal] = useState(false);

    // Handle liking a post
    const handleLike = async (postId) => {
        try {
            await api.post(`/posts/${postId}/like`); // Authorization header is added by interceptor
            setShowSuccessModal(true);
        } catch (err) {
            console.error("Error liking post:", err);
        }
    };

    // Handle commenting on a post
    const handleComment = (postId) => {
        navigation.navigate('CommentScreen', { postId });
    };

    // Handle reposting a post
    const handleRepost = async (postId) => {
        try {
            await api.post(`/posts/${postId}/repost`); // Authorization header is added by interceptor
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

    const { user, posts, profileDetails, followersCount } = profileData;

    return (
        <View style={styles.container}>
            <Navbar navigation={navigation} notificationCount={notificationCount} />
            <ScrollView style={styles.scrollContainer}>
                {/* Profile Details */}
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

                {/* Find me on */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Find me on</Text>
                    <View style={styles.socialLinks}>
                        {profileDetails?.socials ? (
                            Object.entries(profileDetails.socials).map(([platform, link], index) => (
                                <TouchableOpacity key={index} onPress={() => Linking.openURL(link)}>
                                    <Text style={styles.socialLink}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text>No social media profiles found.</Text>
                        )}
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
                                    source={{ uri: post.user?.profile_picture || './../assets/images/avatar.png' }}
                                    containerStyle={styles.avatarSmall}
                                />
                                <View style={styles.postContent}>
                                    <Text style={styles.postUserName}>
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
    subjectLinks: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    favoriteTopicLinks: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    badge: {
        backgroundColor: '#e7f4f5',
        borderColor: '#008080',
        borderWidth: 1,
        borderRadius: 5,
        margin: 4,
    },
    badgeText: {
        color: '#008080',
    },
    socialLinks: {
        flexDirection: 'column',
        marginTop: 8,
    },
    socialLink: {
        color: '#008080',
        textDecorationLine: 'underline',
        marginBottom: 4,
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
    mediaContainer: {
        // Add styles for media content if needed
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    actionButton: {
        padding: 8,
        backgroundColor: '#008080',
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    actionText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    noActivitiesText: {
        textAlign: 'center',
        color: '#6c757d',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default Profile;
