import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Button,
    FlatList,
    Modal,
    TextInput,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import api from './api'; // Ensure this is your API service

const ShowGroup = ({ route }) => {
    const { slug } = route.params; // Assuming the slug is passed as a route parameter
    const [group, setGroup] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isJoined, setIsJoined] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [postMedia, setPostMedia] = useState(null);

    useEffect(() => {
        fetchGroup();
        fetchPosts();
    }, []);

    const fetchGroup = async () => {
        try {
            const response = await api.get(`/groups/${slug}`);
            setGroup(response.data);
            setIsJoined(response.data.isJoined); // Assuming this property indicates membership status
        } catch (error) {
            console.error('Error fetching group:', error);
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await api.get(`/groups/${slug}/posts`);
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleJoinGroup = async () => {
        try {
            await api.post(`/groups/${slug}/join`);
            setIsJoined(true);
        } catch (error) {
            console.error('Error joining group:', error);
        }
    };

    const handleLeaveGroup = async () => {
        try {
            await api.delete(`/groups/${slug}`);
            setIsJoined(false);
        } catch (error) {
            console.error('Error leaving group:', error);
        }
    };

    const handleCreatePost = async () => {
        const formData = new FormData();
        formData.append('content', postContent);
        if (postMedia) {
            formData.append('media', {
                uri: postMedia.uri,
                type: postMedia.type,
                name: postMedia.fileName,
            });
        }

        try {
            await api.post(`/groups/${slug}/posts`, formData);
            setPostContent('');
            setPostMedia(null);
            setModalVisible(false);
            fetchPosts(); // Refresh posts after creation
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handleCommentPost = async (postId, comment) => {
        try {
            await api.post(`/groups/${slug}/posts/${postId}/comment`, { comment });
            fetchPosts(); // Refresh posts after commenting
        } catch (error) {
            console.error('Error commenting on post:', error);
        }
    };

    const handleLikePost = async (postId) => {
        try {
            await api.post(`/groups/${slug}/posts/${postId}/like`);
            fetchPosts(); // Refresh posts after liking
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleRepost = async (postId) => {
        try {
            await api.post(`/groups/${slug}/posts/${postId}/repost`);
            fetchPosts(); // Refresh posts after reposting
        } catch (error) {
            console.error('Error reposting:', error);
        }
    };

    const handleSelectMedia = () => {
        // Logic to select media (image/video) and set it to postMedia
    };

    const renderPost = ({ item }) => (
        <View style={styles.postCard}>
            <View style={styles.postHeader}>
                <Image source={{ uri: item.user.profilePicture }} style={styles.profilePicture} />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.user.first_name}</Text>
                    <Text style={styles.timestamp}>{new Date(item.createdAt).toLocaleString()}</Text>
                </View>
            </View>
            <Text style={styles.postContent}>{item.content}</Text>
            {item.media && <Image source={{ uri: item.media }} style={styles.mediaImage} />}
            <View style={styles.postActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleLikePost(item.id)}
                >
                    <Text>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleCommentPost(item.id, prompt('Enter your comment:'))}
                >
                    <Text>Comment</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleRepost(item.id)}
                >
                    <Text>Repost</Text>
                </TouchableOpacity>
            </View>
            {item.comments.length > 0 && (
                <FlatList
                    data={item.comments}
                    renderItem={({ item }) => (
                        <Text style={styles.comment}>{item.user.first_name}: {item.comment}</Text>
                    )}
                    keyExtractor={(comment) => comment.id.toString()}
                />
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            {group && (
                <View style={styles.groupHeader}>
                    <Text style={styles.groupName}>{group.name}</Text>
                    <Text style={styles.groupDescription}>{group.description}</Text>
                    {isJoined ? (
                        <Button title="Leave Group" onPress={handleLeaveGroup} color="red" />
                    ) : (
                        <Button title="Join Group" onPress={handleJoinGroup} />
                    )}
                </View>
            )}
            <Button title="Create Post" onPress={() => setModalVisible(true)} />
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item.id.toString()}
                style={styles.postList}
            />
            <Modal visible={isModalVisible} animationType="slide">
                <View style={styles.modalContent}>
                    <TextInput
                        placeholder="Write your post..."
                        value={postContent}
                        onChangeText={setPostContent}
                        style={styles.textInput}
                    />
                    <Button title="Select Media" onPress={handleSelectMedia} />
                    {postMedia && <Image source={{ uri: postMedia.uri }} style={styles.mediaPreview} />}
                    <Button title="Submit" onPress={handleCreatePost} />
                    <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    groupHeader: {
        marginBottom: 16,
    },
    groupName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    groupDescription: {
        fontSize: 16,
        color: '#555',
    },
    postList: {
        marginTop: 16,
    },
    postCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontWeight: 'bold',
    },
    timestamp: {
        fontSize: 12,
        color: '#888',
    },
    postContent: {
        fontSize: 16,
        marginBottom: 8,
    },
    mediaImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 8,
    },
    postActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    actionButton: {
        flex: 1,
        alignItems: 'center',
    },
    comment: {
        fontSize: 14,
        color: '#555',
    },
    modalContent: {
        padding: 16,
    },
    textInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
    },
    mediaPreview: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 8,
    },
});

export default ShowGroup;
