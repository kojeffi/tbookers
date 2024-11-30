import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, Image } from 'react-native';
import Navbar from './Navbar'; // Assuming you have a Navbar component
import api from './api';
import { AuthContext } from './AuthContext';

const MyResources = ({ navigation }) => {
    const { authToken, profileData } = useContext(AuthContext); // Access profileData
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (authToken) {
            fetchResources();
        }
    }, [authToken]);

    const fetchResources = async () => {
        try {
            const response = await api.get('/learning-resources', {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            // Access the user ID from the profile data
            const userId = profileData?.user?.id || profileData?.profileDetails?.id;

            console.log("Fetched Resources:", response.data.resources);
            console.log("Profile Data:", profileData); // Log profile data for debugging
            console.log("User ID from Profile Data:", userId); // Log userId for debugging

            // Ensure userId is defined and filter resources based on it
            if (userId) {
                const userResources = response.data.resources.filter(
                    resource => resource.user_id.toString() === userId.toString()
                );
                setResources(userResources);
                console.log("Filtered User Resources:", userResources);
            } else {
                console.log("User ID is undefined.");
            }
        } catch (e) {
            setError('Failed to load resources.');
            console.error('Error fetching resources:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        Alert.alert(
            "Delete Resource",
            "Are you sure you want to delete this resource?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            await api.delete(`/learning-resources/seller/delete/${id}`);
                            setResources(resources.filter(resource => resource.id !== id));
                        } catch (e) {
                            Alert.alert('Error', 'Failed to delete resource.');
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => {
        // Parse item_images as an array
        const images = JSON.parse(item.item_images);
        const itemThumbnail = item.item_thumbnail ? `https://tbooke.net/storage/${item.item_thumbnail}` : null;

        return (
            <View style={styles.resourceCard}>
                {itemThumbnail && (
                    <Image source={{ uri: itemThumbnail }} style={styles.itemImage} />
                )}
                <TouchableOpacity onPress={() => navigation.navigate('ResourceDetails', { slug: item.slug })}>
                    <Text style={styles.itemTitle}>{item.item_name}</Text>
                </TouchableOpacity>
                <Text style={styles.itemDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
                <Text style={styles.itemPrice}>Price: Ksh.{item.item_price}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <View style={styles.itemButtons}>
                    <TouchableOpacity 
                        style={styles.editButton} 
                        onPress={() => navigation.navigate('EditResource', { resourceId: item.id, resourceDetails: item })}>
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#6200ea" />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Navbar />
            <View style={styles.content}>
                <Text style={styles.pageTitle}>My Resources</Text>
                <FlatList
                    data={resources}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    ListEmptyComponent={<Text style={styles.emptyMessage}>No resources found.</Text>}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 2,
        flex: 1,
    },
    pageTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign:'center',
    },
    resourceCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    itemImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    itemDate: {
        color: '#888',
        marginBottom: 10,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    itemDescription: {
        color: '#444',
        marginBottom: 10,
    },
    itemButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    editButton: {
        backgroundColor: '#6200ea',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
        flex: 1,
        marginRight: 5,
    },
    deleteButton: {
        backgroundColor: '#d32f2f',
        padding: 10,
        borderRadius: 5,
        flex: 1,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    emptyMessage: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#d32f2f',
        fontSize: 14,
    },
});

export default MyResources;
