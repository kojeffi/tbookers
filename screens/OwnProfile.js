import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Avatar, Badge } from 'react-native-elements';
import { AuthContext } from './AuthContext';
import api from './api';
import Navbar from './Navbar';

const OwnProfile = ({ route, navigation }) => {
    const { postUser } = route.params;
    const { authToken, profileData } = useContext(AuthContext); // Get authToken and profileData from AuthContext
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(postUser.followersCount || 0);

    // Effect hook to check if the user is following initially
    useEffect(() => {
        const checkIfFollowing = async () => {
            try {
                const response = await api.get(`/profile/${postUser.username}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}` // Pass the token for authentication
                    }
                });
                setIsFollowing(response.data.isFollowing); // Assuming "isFollowing" is in the response
            } catch (error) {
                console.error("Failed to fetch follow status:", error);
            }
        };
        checkIfFollowing();
    }, [postUser, authToken]);

    // Follow or Unfollow handler
    const handleFollowToggle = async () => {
        try {
            const action = isFollowing ? 'unfollow' : 'follow';
            const url = `/users/${postUser.id}/${action}`;
            console.log("Attempting to call:", url); // Log the URL for debugging
            
            const response = await api.post(url, {}, {
                headers: {
                    Authorization: `Bearer ${authToken}` // Include authToken in headers
                }
            });
     
            if (response.status === 200) {
                setIsFollowing(!isFollowing);
                setFollowersCount(prevCount => prevCount + (isFollowing ? -1 : 1));
            } else {
                console.error("Failed to toggle follow status, server response:", response);
                alert("Failed to toggle follow status. Please try again.");
            }
        } catch (error) {
            console.error("An error occurred while toggling follow status:", error.message);
            if (error.response) {
                console.error("Error response:", error.response.data); // Log the response data
                alert(`Error: ${error.response.data.message || 'An unknown error occurred.'}`);
            } else {
                alert("An error occurred. Please try again.");
            }
        }
    };
    
    
    if (!postUser) {
        return <Text>No user details available.</Text>;
    }

    const { first_name, surname, profile_picture, profile_type, about, user_subjects, favorite_topics, socials, institution_name, institutionDetails } = postUser;
    const profileImageUri = profile_picture ? `https://tbooke.net/storage/${profile_picture}` : require('./../assets/images/avatar.png');

    return (
        <View style={styles.container}>
            <Navbar />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Profile Details</Text>
                    </View>
                    <View style={styles.cardBody}>
                        <Avatar
                            rounded
                            size="xlarge"
                            source={typeof profileImageUri === 'string' ? { uri: profileImageUri } : profileImageUri}
                            containerStyle={styles.avatar}
                        />
                        <Text style={styles.profileName}>
                            {profile_type === 'institution' && institution_name ? institution_name : `${first_name} ${surname}`}
                        </Text>
                        <Text style={styles.profileType}>{profile_type}</Text>
                        <Text style={styles.followersCount}>Connections: {followersCount}</Text>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity 
                                style={styles.followButton}
                                onPress={handleFollowToggle}>
                                <Text style={styles.buttonText}>
                                    {isFollowing ? 'Remove Connection' : 'Connect'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.messageButton} 
                                onPress={() => navigation.navigate('Messages', { username: postUser.username })}>
                                <Text style={styles.buttonText}>Message</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.cardBody}>
                        <Text style={styles.cardSubTitle}>About</Text>
                        <Text style={styles.aboutText}>
                            {about || (institutionDetails && institutionDetails.institution_about) || 'No about given.'}
                        </Text>
                    </View>

                    <View style={styles.cardBody}>
                        <Text style={styles.cardSubTitle}>Subjects</Text>
                        <View style={styles.subjectLinks}>
                            {user_subjects ? (
                                user_subjects.split(',').map((subject, index) => (
                                    <Badge key={index} value={<Text style={styles.badgeText}>{subject.trim()}</Text>} badgeStyle={styles.badge} />
                                ))
                            ) : (
                                <Text>No Subjects added.</Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.cardBody}>
                        <Text style={styles.cardSubTitle}>Favorite Topics</Text>
                        <View style={styles.favoriteTopicLinks}>
                            {favorite_topics ? (
                                favorite_topics.split(',').map((topic, index) => (
                                    <Badge key={index} value={<Text style={styles.badgeText}>{topic.trim()}</Text>} badgeStyle={styles.badge} />
                                ))
                            ) : (
                                <Text>No topics added.</Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.cardBody}>
                        <Text style={styles.cardSubTitle}>Find me on</Text>
                        <View style={styles.socialLinks}>
                            {socials ? (
                                Object.entries(socials).map(([platform, link], index) => (
                                    <TouchableOpacity key={index} onPress={() => Linking.openURL(link)}>
                                        <Text style={styles.socialLink}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</Text>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text>No social media profiles found.</Text>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f9',
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#f4f4f4',
        borderRadius: 10,
        marginVertical: 12,
        padding: 20,
        elevation: 4,
        shadowColor: '#000000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
    },
    cardHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#e2e2e2',
        paddingBottom: 10,
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign:'center',
    },
    cardBody: {
        marginBottom: 20,
    },
    profileName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
        textAlign:'center',
    },
    profileType: {
        fontSize: 14,
        color: '#6c757d',
        marginTop: 5,
        textAlign:'center',
    },
    followersCount: {
        fontSize: 14,
        color: '#6c757d',
        marginVertical: 10,
        textAlign:'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    followButton: {
        backgroundColor: '#1E90FF',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        width: '48%',
        alignItems: 'center',
    },
    messageButton: {
        backgroundColor: '#28a745',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        width: '48%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    subjectLinks: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    favoriteTopicLinks: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    socialLinks: {
        marginTop: 10,
    },
    socialLink: {
        color: '#007bff',
        fontSize: 14,
        textDecorationLine: 'underline',
        marginBottom: 8,
    },
    cardSubTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    badge: {
        backgroundColor: '#007bff',
        margin: 4,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    badgeText: {
        color: '#fff',
        fontSize: 14,
    },
    aboutText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 22,
    },
    avatar: {
        alignSelf: 'center',
        marginVertical: 20,
    }
    
});

export default OwnProfile;
