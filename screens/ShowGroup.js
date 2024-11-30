import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';
import { AuthContext } from './AuthContext';
import api from './api';
import Navbar from './Navbar';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const ShowGroup = ({ route }) => {
    const { slug } = route.params;
    const { profileData } = useContext(AuthContext);
    const navigation = useNavigation();

    const [group, setGroup] = useState(null);
    const [posts, setPosts] = useState([]);
    const [createPostModalVisible, setCreatePostModalVisible] = useState(false);
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostMedia, setNewPostMedia] = useState(null);

    useEffect(() => {
        loadGroupDetails();
    }, [slug]);

    const loadGroupDetails = async () => {
        try {
            const response = await api.get(`/groups/${slug}`);
            setGroup(response.data.group || {});
            setPosts(response.data.groupPosts || []);
        } catch (error) {
            console.error('Failed to load group details', error);
        }
    };

    const handleJoinGroup = async () => {
        try {
            await api.post(`/groups/${slug}/join`);
            loadGroupDetails(); // Reload the group to reflect the new membership status
        } catch (error) {
            console.error('Failed to join group', error);
        }
    };

    const handleCreatePost = async () => {
        const formData = new FormData();
        formData.append('content', newPostContent);
        if (newPostMedia) formData.append('media', newPostMedia);

        try {
            await api.post(`/groups/${slug}/posts`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setNewPostContent('');
            setNewPostMedia(null);
            setCreatePostModalVisible(false);
            loadGroupDetails();
        } catch (error) {
            console.error('Failed to create post', error);
        }
    };

    const handleLikePost = async (postId) => {
        try {
            await api.post(`/groups/${slug}/posts/${postId}/like`);
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? {
                              ...post,
                              liked: !post.liked,
                              likesCount: post.liked ? post.likesCount - 1 : post.likesCount + 1,
                          }
                        : post
                )
            );
        } catch (error) {
            console.error('Failed to like post', error);
        }
    };

    const handleToggleComment = (postId) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) => (post.id === postId ? { ...post, showComments: !post.showComments } : post))
        );
    };

    const handleRepost = async (postId) => {
        try {
            await api.post(`/groups/${slug}/posts/${postId}/repost`);
            setPosts((prevPosts) =>
                prevPosts.map((post) => (post.id === postId ? { ...post, repostsCount: post.repostsCount + 1 } : post))
            );
        } catch (error) {
            console.error('Failed to repost', error);
        }
    };

    const handleAddComment = async (postId, content) => {
        try {
            await api.post(`/groups/${slug}/posts/${postId}/comment`, { content });
            loadGroupDetails();
        } catch (error) {
            console.error('Failed to add comment', error);
        }
    };

    const sortedPosts = posts.sort((a, b) => b.repostsCount - a.repostsCount); // Reposts at the top

    if (!group) return <Text style={styles.loadingText}>Loading...</Text>;

    const creator = group?.creator || {};
    const isMember = group?.members?.some((member) => member.id === profileData.id);  // Make sure this is correct
    const isCreator = creator?.id === profileData.id;

    const creatorName = creator.profile_type === 'institution'
        ? creator.institutionDetails?.institution_name
        : `${creator.first_name} ${creator.surname}`;

    const creatorProfileUrl = creator.id === profileData.id
        ? 'profile/showOwn'
        : `profile/show/${creator.username}`;

    return (
        <View style={styles.container}>
            <Navbar />
            <ScrollView style={styles.scrollView}>
                <View style={styles.groupInfo}>
                    <Image
                        source={{
                            uri: group?.thumbnail
                                ? `https://tbooke.net/storage/${group.thumbnail}`
                                : 'default-images/group.png',
                        }}
                        style={styles.groupImage}
                    />
                    <Text style={styles.groupName}>{group?.name || 'Unnamed Group'}</Text>
                    <Text style={styles.membersCount}>
                        <Text style={styles.boldText}>Members:</Text> {group?.members?.length || 0}
                    </Text>
                    <Text style={styles.groupDescription}>{group?.description || 'No description available'}</Text>

                    <Text style={styles.creatorText}>
                        <Text style={styles.boldText}>Created by: </Text>
                        <TouchableOpacity onPress={() => navigation.navigate(creatorProfileUrl)}>
                            <View style={styles.creatorLink}>
                                <Image
                                    source={{
                                        uri: creator.profile_picture
                                            ? `https://tbooke.net/storage/${creator.profile_picture}`
                                            : 'default-images/avatar.png',
                                    }}
                                    style={styles.profileImage}
                                />
                                <Text style={styles.creatorName}>{creatorName}</Text>
                            </View>
                        </TouchableOpacity>
                    </Text>

                    <View style={styles.buttonsContainer}>
                        {isMember ? (
                            <TouchableOpacity style={styles.joinedButton} disabled>
                                <Text style={styles.buttonText}>Joined</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.joinButton} onPress={handleJoinGroup}>
                                <Text style={styles.buttonText}>Join</Text>
                            </TouchableOpacity>
                        )}

                        {(isMember || isCreator) && (
                            <TouchableOpacity style={styles.createPostButton} onPress={() => setCreatePostModalVisible(true)}>
                                <Icon name="plus" size={20} color="#fff" style={styles.createPostIcon} />
                                <Text style={styles.buttonText}>Create Post</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Group Posts</Text>

                {Array.isArray(sortedPosts) && sortedPosts.length === 0 ? (
                    <Text style={styles.noPostsText}>No posts available in this group.</Text>
                ) : (
                    sortedPosts.map((post) => {
                        const isRepost = post?.isRepost;
                        const originalPost = isRepost ? post?.originalPost : post;
                        const reposter = isRepost ? post?.user : null;

                        return (
                            <View key={originalPost?.id} style={styles.postCard}>
                                {isRepost && reposter && (
                                    <View style={styles.repostHeader}>
                                        <Image
                                            source={{
                                                uri: `https://tbooke.net/storage/${
                                                    reposter?.profile_picture || './../assets/images/avatar.png'
                                                }`,
                                            }}
                                            style={styles.profileImage}
                                        />
                                        <Text style={styles.repostText}>
                                            <Text style={styles.boldText}>{reposter?.first_name}</Text> reposted this post.
                                        </Text>
                                    </View>
                                )}

                                <View style={styles.postHeader}>
                                    <Image
                                        source={{
                                            uri: `https://tbooke.net/storage/${
                                                originalPost?.user?.profile_picture || './../assets/images/avatar.png'
                                            }`,
                                        }}
                                        style={styles.profileImage}
                                    />
                                    <Text style={styles.postUserInfo}>
                                        <Text style={styles.boldText}>
                                            {originalPost?.user?.first_name} {originalPost?.user?.surname}
                                        </Text>{' '}
                                        - {new Date(originalPost?.createdAt).toLocaleString()}
                                    </Text>
                                </View>

                                <Text style={styles.postContent}>{originalPost?.content}</Text>

                                <View style={styles.engagementButtons}>
                                    <TouchableOpacity onPress={() => handleLikePost(originalPost?.id)} style={styles.engagementButton}>
                                        <Icon name="thumbs-up" size={16} color="#4CAF50" />
                                        <Text>{originalPost?.likesCount}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleToggleComment(originalPost?.id)} style={styles.engagementButton}>
                                        <Icon name="message-square" size={16} color="#2196F3" />
                                        <Text>{originalPost?.commentsCount}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleRepost(originalPost?.id)} style={styles.engagementButton}>
                                        <Icon name="repeat" size={16} color="#FFC107" />
                                        <Text>{originalPost?.repostsCount}</Text>
                                    </TouchableOpacity>
                                </View>

                                {originalPost?.showComments && (
                                    <View style={styles.commentsSection}>
                                        {originalPost?.comments?.map((comment) => (
                                            <View key={comment.id} style={styles.commentCard}>
                                                <Text>{comment.content}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        );
                    })
                )}

                <Modal visible={createPostModalVisible} animationType="slide">
                    <View style={styles.modalContainer}>
                        <TextInput
                            style={styles.textInput}
                            value={newPostContent}
                            onChangeText={setNewPostContent}
                            placeholder="Write something..."
                            multiline
                        />
                        {/* Add Media Picker here */}
                        <TouchableOpacity onPress={handleCreatePost} style={styles.createPostButton}>
                            <Text style={styles.buttonText}>Post</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setCreatePostModalVisible(false)}
                            style={styles.cancelButton}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    scrollView: {
        padding: 15,
    },
    groupInfo: {
        alignItems: 'center', // Center the content
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    groupImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
    },
    groupName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    membersCount: {
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
    },
    groupDescription: {
        fontSize: 16,
        marginVertical: 10,
        color: '#555',
        textAlign: 'center',
    },
    creatorText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },
    boldText: {
        fontWeight: 'bold',
    },
    creatorLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    creatorName: {
        fontSize: 16,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginTop: 10,
    },
    joinButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        margin: 5,
    },
    joinedButton: {
        backgroundColor: '#ddd',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        margin: 5,
    },
    createPostButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        margin: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    createPostIcon: {
        marginRight: 10,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 30,
        textAlign: 'center',
    },
    noPostsText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginTop: 20,
    },
    postCard: {
        backgroundColor: '#fff',
        marginBottom: 15,
        padding: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    postUserInfo: {
        marginLeft: 10,
        fontSize: 14,
    },
    postContent: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    engagementButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    engagementButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
    repostHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding: 5,
        backgroundColor: '#e7e7e7',
        borderRadius: 5,
    },
    repostText: {
        fontSize: 14,
        color: '#555',
        marginLeft: 10,
    },
    commentsSection: {
        marginTop: 10,
    },
    commentCard: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f4f4f4',
        borderRadius: 8,
    },
    modalContainer: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
    },
    textInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
        height: 150,
    },
    cancelButton: {
        marginTop: 10,
        paddingVertical: 10,
        backgroundColor: '#FF5722',
        borderRadius: 8,
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 30,
    },
});

export default ShowGroup;
