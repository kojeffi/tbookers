import React, { useEffect, useContext, useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Linking,
} from 'react-native';
import { AuthContext } from './AuthContext';
import api from './api';
import Navbar from './Navbar';
import Icon from 'react-native-vector-icons/Ionicons';

const ResourceDetail = ({ route, navigation }) => {
    const { slug } = route.params;
    const { authToken } = useContext(AuthContext);
    const [resource, setResource] = useState(null);
    const [otherItems, setOtherItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            await fetchResourceDetails();
            await fetchOtherItems();
            setLoading(false);
        };

        fetchData();
    }, [slug, authToken]);

    const fetchResourceDetails = async () => {
        try {
            const response = await api.get(`/learning-resources/${slug}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            console.log('Resource Details:', response.data);
            setResource(response.data.resource);
        } catch (error) {
            console.error('Failed to fetch resource details:', error.response ? error.response.data : error.message);
        }
    };

    const fetchOtherItems = async () => {
        try {
            const response = await api.get('/learning-resources', {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            console.log('Other Items:', response.data);
            setOtherItems(response.data.resources || []);
        } catch (error) {
            console.error('Failed to fetch other items:', error.response ? error.response.data : error.message);
            alert('Failed to fetch other items. Please try again later.');
        }
    };

    if (loading) {
        return <Text style={styles.loadingText}>Loading...</Text>;
    }

    if (!resource) {
        return <Text style={styles.loadingText}>Resource not found.</Text>;
    }

    const itemImages = JSON.parse(resource.item_images || '[]');

    return (
        <View style={styles.container}>
            <Navbar />
            <ScrollView style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>{resource.item_name || 'No Title'}</Text>
                    <View style={styles.row}>
                        <View style={styles.details}>
                            <Text style={styles.detailText}>
                                <Text style={styles.label}>Price: </Text>
                                Ksh {parseFloat(resource.item_price).toFixed(2) || 'N/A'}
                            </Text>
                            <Text style={styles.detailText}>
                                <Text style={styles.label}>Location: </Text>
                                {resource.county || 'N/A'}
                            </Text>
                            <Text style={styles.detailText}>
                                <Text style={styles.label}>Category: </Text>
                                {resource.item_category || 'N/A'}
                            </Text>
                        </View>
                        <View style={styles.contact}>
                            <Text style={styles.sellerTitle}>Seller Contact</Text>
                            <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL(`tel:${resource.contact_phone}`)}>
                                <Icon name="call" size={14} color="#FFFFFF" />
                                <Text style={styles.buttonText}>Call</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL(`https://api.whatsapp.com/send?phone=${resource.whatsapp_number}`)}>
                                <Icon name="logo-whatsapp" size={14} color="#FFFFFF" />
                                <Text style={styles.buttonText}>WhatsApp</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL(`mailto:${resource.contact_email}`)}>
                                <Icon name="mail" size={14} color="#FFFFFF" />
                                <Text style={styles.buttonText}>Email</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.description}>
                        <Text>{resource.description || 'No description available.'}</Text>
                    </View>

                    <View style={styles.imageGallery}>
                        {itemImages.length > 0 ? (
                            itemImages.map((image, index) => (
                                <Image
                                    key={index}
                                    source={{ uri: `https://tbooke.net/storage/${image}` }}
                                    style={styles.image}
                                />
                            ))
                        ) : (
                            <Text>No images available.</Text>
                        )}
                    </View>
                </View>

                <View style={styles.otherItemsContainer}>
                    <Text style={styles.otherItemsTitle}>Other Items</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                        {otherItems.length > 0 ? (
                            otherItems.map((item) => (
                                <View key={item.id} style={styles.otherItemCard}>
                                    <TouchableOpacity onPress={() => navigation.navigate('ResourceDetail', { slug: item.slug })}>
                                        <Image
                                            source={{ uri: `https://tbooke.net/storage/${item.item_thumbnail}` }}
                                            style={styles.otherItemImage}
                                        />
                                        <Text style={styles.otherItemTitle}>{item.item_name || 'No Name'}</Text>
                                        <Text>
                                            <Text style={styles.label}>Price: </Text>
                                            Ksh {parseFloat(item.item_price).toFixed(2) || 'N/A'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                        ) : (
                            <Text>No other items available.</Text>
                        )}
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    card: {
        padding: 16,
        margin: 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    details: {
        flex: 1,
    },
    contact: {
        flex: 1,
        alignItems: 'flex-end',
    },
    sellerTitle: {
        fontWeight: '600',
        marginBottom: 8,
        color: '#555',
    },
    contactButton: {
        marginVertical: 4,
        backgroundColor: '#008080',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '500',
        marginLeft: 8,
    },
    description: {
        marginVertical: 16,
        fontSize: 14,
        lineHeight: 24,
        color: '#555',
    },
    imageGallery: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    image: {
        width: '48%',
        height: 200,
        borderRadius: 8,
        margin: 4,
    },
    otherItemsContainer: {
        margin: 16,
    },
    otherItemsTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    scrollContainer: {
        paddingHorizontal: 3,
    },
    otherItemCard: {
        marginRight: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        elevation: 2,
        padding: 20,
        alignItems: 'center',
    },
    otherItemImage: {
        width: 200,
        height: 150,
        borderRadius: 8,
    },
    otherItemTitle: {
        marginTop: 4,
        fontWeight: '600',
        color: '#333',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 14,
        color: '#888',
    },
    label: {
        fontWeight: '600',
    },
});

export default ResourceDetail;
