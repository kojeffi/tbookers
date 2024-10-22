import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Linking, ActivityIndicator, Alert } from 'react-native';
import { Card } from 'react-native-paper'; // Material Design card component
import { Video } from 'expo-av'; // Expo's Video component for handling video playback
import api from './api'; // API utility for making HTTP requests
import { AuthContext } from './AuthContext'; // Import AuthContext

const Content = ({ slug }) => {
    const { authToken } = useContext(AuthContext); // Use AuthContext
    const [content, setContent] = useState(null);
    const [relatedContent, setRelatedContent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Set Authorization header with authToken
                const response = await api.get(`/tbooke-learning/${slug}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // Include token in request
                    },
                });
                setContent(response.data);

                // Assuming you have a related endpoint defined
                const relatedResponse = await api.get(`/tbooke-learning/${slug}/related`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // Include token in request
                    },
                });
                setRelatedContent(relatedResponse.data);
            } catch (error) {
                console.error('Error fetching content:', error);
                Alert.alert('Error', 'Unable to fetch content. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug, authToken]); // Depend on slug and authToken

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center' }} />;
    }

    if (!content) {
        return <Text>No content found.</Text>;
    }

    const mediaFiles = JSON.parse(content.media_files || '[]');

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={{ flex: 1, padding: 16 }}>
                {/* Main Content */}
                <Card style={{ marginBottom: 16 }}>
                    <Card.Content>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
                            {content.content_title}
                        </Text>
                        <View style={{ marginBottom: 16 }}>
                            <Text>{content.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>')}</Text>
                        </View>

                        {/* Media Gallery */}
                        {mediaFiles.length > 0 && (
                            <View style={{ marginTop: 16 }}>
                                <Text style={{ fontSize: 18, marginBottom: 8 }}>Media Gallery</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
                                    {mediaFiles.map((media, index) => {
                                        const extension = media.split('.').pop().toLowerCase();
                                        const uri = `http://192.168.12.117:8000/storage/${media}`; // Update to your asset path

                                        if (['jpeg', 'jpg', 'png', 'gif'].includes(extension)) {
                                            return (
                                                <TouchableOpacity key={index} onPress={() => Linking.openURL(uri)}>
                                                    <Image source={{ uri }} style={{ width: '48%', height: 150, margin: '1%' }} />
                                                </TouchableOpacity>
                                            );
                                        } else if (['mp4', 'mov', 'avi', 'wmv'].includes(extension)) {
                                            return (
                                                <View key={index} style={{ width: '48%', height: 150, margin: '1%' }}>
                                                    <Video
                                                        source={{ uri }}
                                                        style={{ width: '100%', height: '100%' }}
                                                        useNativeControls
                                                        resizeMode="contain"
                                                    />
                                                </View>
                                            );
                                        } else if (['pdf', 'ppt', 'doc', 'docx'].includes(extension)) {
                                            return (
                                                <TouchableOpacity key={index} onPress={() => Linking.openURL(uri)}>
                                                    <Text style={{ color: 'blue', margin: '1%' }}>
                                                        View {extension.toUpperCase()} File
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        }
                                        return null;
                                    })}
                                </View>
                            </View>
                        )}
                    </Card.Content>
                </Card>

                {/* Related Content */}
                <Card>
                    <Card.Title title="Related Content" />
                    <Card.Content>
                        {relatedContent.map((related, index) => (
                            <View key={index} style={{ marginBottom: 16 }}>
                                <Image
                                    source={{ uri: `http://192.168.12.117:8000/storage/${related.content_thumbnail}` }} // Update to your asset path
                                    style={{ width: '100%', height: 100, marginBottom: 8 }}
                                />
                                <Text style={{ fontSize: 16 }}>{related.content_title}</Text>
                                <TouchableOpacity onPress={() => Linking.openURL(`http://192.168.12.117:8000/tbooke-learning/${related.slug}`)}>
                                    <Text style={{ color: 'blue' }}>View Content</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </Card.Content>
                </Card>
            </View>
        </ScrollView>
    );
};

export default Content;
