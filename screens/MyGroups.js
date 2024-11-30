import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, FlatList, Image, StyleSheet, Alert } from 'react-native';
import api from './api'; // Ensure this is set up to point to your Laravel backend
import { AuthContext } from './AuthContext';
import Navbar from './Navbar';

const MyGroups = ({ navigation }) => {
    const { authToken, profileData } = useContext(AuthContext); // Get profileData from context
    const [myGroups, setMyGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await api.get('/groups', {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            // Log the response to confirm structure
            console.log('API Response:', response.data); // Log the response

            // Access groups array from response
            const groups = response.data.groups;

            // Check if groups is an array before filtering
            if (Array.isArray(groups)) {
                const userGroups = groups.filter(group => 
                    group.created_by === profileData.user.id // Adjusted to match your profile data structure
                );
                setMyGroups(userGroups);
            } else {
                console.error('Groups data is not an array:', groups);
                setError('Invalid data format received from the server.');
            }
        } catch (error) {
            console.error('Failed to fetch groups:', error);
            setError('Failed to fetch groups');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (slug) => {
        Alert.alert(
            'Delete Group',
            'Are you sure you want to delete this group?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: () => deleteGroup(slug) },
            ],
            { cancelable: false }
        );
    };

    const deleteGroup = async (slug) => {
        try {
            // Adjusted to match your Laravel route for deleting a group
            await api.delete(`/groups/${slug}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setMyGroups((prevGroups) => prevGroups.filter((group) => group.slug !== slug));
            Alert.alert('Success', 'Group deleted successfully');
        } catch (error) {
            console.error('Failed to delete group:', error);
            Alert.alert('Error', 'Failed to delete group');
        }
    };

    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <Navbar />
            <View style={styles.header}>
                <Text style={styles.title}>My Groups</Text>
                <Button title="Create New Group" onPress={() => navigation.navigate('CreateGroup')} />
            </View>

            {myGroups.length === 0 ? (
                <Text>You have not created any groups yet.</Text>
            ) : (
                <FlatList
                    data={myGroups}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Image
                                source={{
                                    uri: item.thumbnail
                                        ? `http://192.168.12.117:8000/storage/${item.thumbnail}`
                                        : 'http://192.168.12.117:8000/default-images/group.png',
                                }}
                                style={styles.image}
                            />
                            <Text style={styles.groupName}>{item.name}</Text>
                            <Text style={styles.groupDescription}>
                                {item.description.length > 18 ? item.description.slice(0, 18) + '...' : item.description}
                            </Text>
                            <View style={styles.buttonContainer}>
                                <Button title="Edit" onPress={() => navigation.navigate('EditGroup', { slug: item.slug })} />
                                <Button title="Delete" onPress={() => confirmDelete(item.slug)} color="red" />
                            </View>
                        </View>
                    )}
                    keyExtractor={(item) => item.slug}
                    numColumns={1} // One card per row
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    card: {
        marginBottom: 16, // Add margin to separate cards
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        elevation: 3, // Shadow for Android
        padding: 10,
        alignItems: 'center',
    },
    image: {
        height: 150,
        width: '100%',
        borderRadius: 8,
        resizeMode: 'cover',
    },
    groupName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
    },
    groupDescription: {
        textAlign: 'center',
        marginVertical: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 8,
    },
});

export default MyGroups;
