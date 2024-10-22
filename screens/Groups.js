import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from './api'; // Your custom API instance
import { AuthContext } from './AuthContext'; // Import AuthContext for authentication
import Navbar from './Navbar'; // Ensure the path is correct
import Icon from 'react-native-vector-icons/Ionicons'; // Import the icon library

const DEFAULT_IMAGE_URL = require('./../assets/images/avatar.png'); // Placeholder image URL

const GroupsScreen = () => {
    const [groups, setGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(true);
    const [joiningGroupId, setJoiningGroupId] = useState(null); // Track which group is being joined
    const navigation = useNavigation();

    const { authToken, profileData, loading, logout } = useContext(AuthContext); // Get auth data from context
    const userId = profileData?.id; // Fetch the authenticated user's ID from the profile data

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                console.log('Fetching groups from /groups endpoint');
                const response = await api.get('/groups', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                console.log('Groups fetched successfully:', response.data);
                setGroups(response.data.data || []); // Ensure groups is set to an empty array if undefined
            } catch (error) {
                console.error('Error fetching groups', error);
                handleFetchError(error);
            } finally {
                setLoadingGroups(false);
            }
        };

        if (!loading && authToken) {
            fetchGroups();
        }
    }, [authToken, loading, logout]);

    const handleFetchError = (error) => {
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            handleErrorResponse(error.response.status);
        } else {
            Alert.alert('Network Error', 'Please check your internet connection.');
        }
    };

    const handleErrorResponse = (status) => {
        switch (status) {
            case 404:
                Alert.alert('Error', 'Groups endpoint not found (404). Please check the API route.');
                break;
            case 401:
                Alert.alert('Unauthorized', 'Your session has expired. Please log in again.');
                logout();
                break;
            default:
                Alert.alert('Error', 'Failed to fetch groups. Please try again later.');
                break;
        }
    };

    const handleJoinGroup = async (groupSlug, groupId) => {
        try {
            setJoiningGroupId(groupId); // Indicate which group is being joined
            const response = await api.post(`/groups/${groupSlug}/join`, null, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }); // API call to join group
            console.log('Joined group successfully:', response.data);
            Alert.alert('Success', 'You have successfully joined the group.');
            // Update the group membership status locally
            setGroups(prevGroups =>
                prevGroups.map(group =>
                    group.id === groupId
                        ? { ...group, members: [...(group.members || []), userId] } // Safely handle undefined members
                        : group
                )
            );
        } catch (error) {
            console.error('Error joining group', error);
            handleJoinError(error);
        } finally {
            setJoiningGroupId(null);
        }
    };

    const handleJoinError = (error) => {
        if (error.response?.status === 401) {
            Alert.alert('Unauthorized', 'Your session has expired. Please log in again.');
            logout();
        } else if (error.response?.status === 404) {
            Alert.alert('Error', 'Group not found.');
        } else {
            Alert.alert('Error', 'Failed to join the group. Please try again.');
        }
    };

    const renderGroupItem = ({ item }) => {
        const isMember = Array.isArray(item.members) && item.members.includes(userId);
        
        return (
            <View style={styles.card}>
                <Image 
                    source={{ uri: item.thumbnail ? `https://tbooke.net/storage/${item.thumbnail}` : DEFAULT_IMAGE_URL }} 
                    style={styles.thumbnail} 
                />
                <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardDescription}>
                        {item.description && item.description.length > 60 
                            ? `${item.description.slice(0, 60)}...` 
                            : item.description || 'No description available'}
                    </Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.viewButton}
                            onPress={() => navigation.navigate('ShowGroup', { slug: item.slug })}
                        >
                            <Icon name="eye" size={16} color="#fff" />
                            <Text style={styles.buttonText}> View</Text>
                        </TouchableOpacity>
                        {isMember ? (
                            <TouchableOpacity style={styles.joinedButton} disabled>
                                <Icon name="checkmark" size={16} color="#fff" />
                                <Text style={styles.buttonText}> Joined</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={styles.joinButton}
                                onPress={() => handleJoinGroup(item.slug, item.id)}
                                disabled={joiningGroupId === item.id}
                            >
                                {joiningGroupId === item.id ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <>
                                        <Icon name="add" size={16} color="#fff" />
                                        <Text style={styles.buttonText}> Join</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    if (loading || loadingGroups) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
        <Navbar navigation={navigation} />

        <ScrollView style={styles.scrollcontainer}>
            <Text style={styles.heading}>Groups</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.buttonScrollContainer}>
                <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateGroup')}>
                    <Icon name="add-circle" size={16} color="#fff" />
                    <Text style={styles.buttonText}> Create Group</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('MyGroups')}>
                    <Icon name="list-circle" size={16} color="#fff" />
                    <Text style={styles.buttonText}> My Groups</Text>
                </TouchableOpacity>
            </ScrollView>
            {groups.length > 0 ? (
                <FlatList
                    data={groups}
                    renderItem={renderGroupItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={1}
                    contentContainerStyle={styles.list}
                />
            ) : (
                <Text style={styles.noGroupsText}>No groups available.</Text>
            )}
        </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5', // Light gray background for contrast
    },
    heading: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
        color: '#333', // Darker text for better readability
    },
    buttonScrollContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    createButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginHorizontal: 5,
        alignItems: 'center',
        flexDirection: 'row',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    card: {
        flex: 1,
        margin: 3,
        borderRadius: 5,
        backgroundColor: '#fff',
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    thumbnail: {
        height: 150,
        width: '100%',
        resizeMode: 'cover',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    cardBody: {
        padding: 10,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 16,
        marginBottom: 5,
        textAlign: 'center',
        color: '#333',
        fontWeight: 'bold',
    },
    cardDescription: {
        fontSize: 14,
        textAlign: 'center',
        color: '#877',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    viewButton: {
        backgroundColor: '#007bff',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    joinButton: {
        backgroundColor: '#28a745',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    joinedButton: {
        backgroundColor: '#6c757d', // Gray for joined state
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        marginLeft: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noGroupsText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
        fontSize: 14,
    },
});

export default GroupsScreen;
