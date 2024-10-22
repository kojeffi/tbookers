import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Alert,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import api from './api'; // Import your API setup here
import { AuthContext } from './AuthContext';
import Navbar from './Navbar';
import Video from 'react-native-video';

const ContentDetail = ({ route, navigation }) => {
    const { slug } = route.params;
    const { authToken } = useContext(AuthContext);
    const [content, setContent] = useState(null);
    const [relatedContent, setRelatedContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/tbooke-learning/${slug}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // Include auth token if required
                    },
                });
                setContent(response.data.content);
                setRelatedContent(response.data.relatedContent || []);
            } catch (err) {
                setError(err.response?.data.message || 'Failed to fetch content');
                Alert.alert('Error', err.response?.data.message || 'Failed to fetch content');
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [slug, authToken]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Icon name="exclamation-triangle" size={50} color="#dc3545" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.retryButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!content) {
        return (
            <View style={styles.noContentContainer}>
                <Text style={styles.noContentText}>No content found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Navbar navigation={navigation} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.contentSection}>
                    <Text style={styles.title}>{content.content_title}</Text>
                    <Text style={styles.textContent}>{content.content.replace(/<[^>]*>/g, '')}</Text>

                    {/* Media Gallery */}
                    {content.media_files && Array.isArray(JSON.parse(content.media_files)) && (
                        <View style={styles.mediaGallery}>
                            <Text style={styles.galleryTitle}>Media Gallery</Text>
                            <View style={styles.mediaRow}>
                                {JSON.parse(content.media_files).map((media, index) => {
                                    const extension = media.split('.').pop().toLowerCase();
                                    return (
                                        <View key={index} style={styles.mediaItem}>
                                            {['jpeg', 'jpg', 'png', 'gif'].includes(extension) && (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        // Navigate to the image in fullscreen or handle image view
                                                    }}
                                                >
                                                    <Image
                                                        source={{ uri: `https://tbooke.net/storage/${media}` }}
                                                        style={styles.image}
                                                        resizeMode="cover"
                                                    />
                                                </TouchableOpacity>
                                            )}
                                            {['mp4', 'mov', 'avi', 'wmv'].includes(extension) && (
                                                <Video
                                                    source={{ uri: `https://tbooke.net/storage/${media}` }}
                                                    style={styles.video}
                                                    controls
                                                    resizeMode="contain"
                                                />
                                            )}
                                            {['pdf', 'ppt', 'doc', 'docx'].includes(extension) && (
                                                <TouchableOpacity onPress={() => {/* Handle document viewing */}}>
                                                    <Text style={styles.fileLink}>View {extension.toUpperCase()} File</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    )}
                </View>

                {/* Related Content Section */}
                {relatedContent.length > 0 && (
                    <View style={styles.relatedContentSection}>
                        <Text style={styles.relatedTitle}>Related Content</Text>
                        {relatedContent.map((related, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.relatedItem}
                                onPress={() => navigation.navigate('ContentDetail', { slug: related.slug })}
                            >
                                <Image
                                    source={{ uri: `https://tbooke.net/storage/${related.content_thumbnail}` }}
                                    style={styles.relatedImage}
                                />
                                <Text style={styles.relatedContentTitle}>{related.content_title}</Text>
                                <View style={styles.viewContentButton}>
                                    <Text style={styles.viewContentButtonText}>View Content</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5' },
    scrollContainer: { padding: 16 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5' },
    loadingText: { marginTop: 10, fontSize: 18, color: '#007bff' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f0f2f5' },
    errorText: { marginTop: 10, fontSize: 16, color: '#dc3545', textAlign: 'center' },
    retryButton: { marginTop: 20, backgroundColor: '#007bff', padding: 10, borderRadius: 5 },
    retryButtonText: { color: '#fff', fontWeight: 'bold' },
    noContentContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f0f2f5' },
    noContentText: { fontSize: 18, color: '#555' },
    contentSection: {
        marginBottom: 20,
        padding: 8,
        backgroundColor: '#f4f4f4',
        borderRadius: 10,
    },
    title: { fontSize: 28, fontWeight: '700', color: '#333' },
    textContent: { fontSize: 16, color: '#444', lineHeight: 22 },
    mediaGallery: { marginTop: 20 },
    galleryTitle: { fontSize: 22, fontWeight: '600', marginBottom: 15, color: '#007bff' },
    mediaRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    mediaItem: { width: '48%', marginBottom: 15, borderRadius: 10, backgroundColor: '#f9f9f9' },
    image: { width: '100%', height: 150 },
    video: { width: '100%', height: 150 },
    fileLink: { padding: 10, color: '#007bff', textAlign: 'center', textDecorationLine: 'underline' },
    relatedContentSection: { marginTop: 10, padding: 20, backgroundColor: '#fff', borderRadius: 10 },
    relatedTitle: { fontSize: 22, fontWeight: '600', marginBottom: 15, color: '#007bff' },
    relatedItem: { marginBottom: 15, borderRadius: 10, backgroundColor: '#f9f9f9', padding: 10 },
    relatedImage: { width: '100%', height: 100, borderRadius: 10 },
    relatedContentTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 5, color: '#333' },
    viewContentButton: { marginTop: 5, padding: 10, backgroundColor: '#007bff', borderRadius: 5 },
    viewContentButtonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});

export default ContentDetail;
