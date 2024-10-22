import React, { useContext, useState, useEffect } from 'react';
import { View, Image, Text, ActivityIndicator, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { AuthContext } from './AuthContext';
import api from './api'; // Import the API configuration

const ProfileView = () => {
    const { profileData, loading, error } = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [postData, setPostData] = useState(null); // To store post data if needed

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                setModalLoading(true);
                const response = await api.get('/'); // Adjust the endpoint as needed
                setPostData(response.data);
            } catch (err) {
                console.error('Error fetching posts:', err);
            } finally {
                setModalLoading(false);
            }
        };

        if (modalVisible) {
            fetchPostData();
        }
    }, [modalVisible]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                {profileData && profileData.profile_picture ? (
                    <Image 
                        source={{ uri: `http://192.168.12.117:8000/storage/${profileData.profile_picture}` }} 
                        style={styles.avatar} 
                    />
                ) : (
                    <Image 
                        source={{ uri: 'http://192.168.12.117:8000/default-images/avatar.png' }} 
                        style={styles.avatar} 
                    />
                )}
                
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.buttonText}>Share your thoughts</Text>
                </TouchableOpacity>
            </View>

            {/* Modal for creating post */}
            <Modal
                transparent={true}
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create Post</Text>
                        {modalLoading ? (
                            <ActivityIndicator size="small" color="#0000ff" />
                        ) : (
                            <Text>Post creation modal content goes here. Data: {JSON.stringify(postData)}</Text>
                        )}
                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ProfileView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    button: {
        backgroundColor: '#6c757d',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: 300,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#6c757d',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
});
