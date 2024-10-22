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
    }, []);

    const fetchResourceDetails = async () => {
        try {
            const response = await api.get(`/learning-resources/${slug}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            setResource(response.data);
        } catch (error) {
            console.error('Failed to fetch resource details:', error.response ? error.response.data : error.message);
        }
    };

    const fetchOtherItems = async () => {
        try {
            const response = await api.get('/learning-resources', {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            setOtherItems(response.data.resources || []);
        } catch (error) {
            console.error('Failed to fetch other items:', error.response ? error.response.data : error.message);
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
        <ScrollView style={styles.container}>
            <Navbar />
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
                            <Icon name="call" size={20} color="#FFFFFF" />
                            <Text style={styles.buttonText}>Call</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL(`https://api.whatsapp.com/send?phone=${resource.whatsapp_number}`)}>
                            <Icon name="logo-whatsapp" size={20} color="#FFFFFF" />
                            <Text style={styles.buttonText}>WhatsApp</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL(`mailto:${resource.contact_email}`)}>
                            <Icon name="mail" size={20} color="#FFFFFF" />
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
                                source={{ uri: `http://192.168.12.117:8000/storage/${image}` }}
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
                    {otherItems.map((item) => (
                        <View key={item.id} style={styles.otherItemCard}>
                            <TouchableOpacity onPress={() => navigation.navigate('ResourceDetail', { slug: item.slug })}>
                                <Image
                                    source={{ uri: `http://192.168.12.117:8000/storage/${item.item_thumbnail}` }}
                                    style={styles.otherItemImage}
                                />
                                <Text style={styles.otherItemTitle}>{item.item_name || 'No Name'}</Text>
                                <Text>
                                    <Text style={styles.label}>Price: </Text>
                                    Ksh {parseFloat(item.item_price).toFixed(2) || 'N/A'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    card: {
        padding: 16,
        margin: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 28,
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
        backgroundColor: '#007BFF',
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
        fontSize: 16,
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
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
        color: '#333',
    },
    otherItemCard: {
        marginRight: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        padding: 8,
        width: 300,
        alignItems: 'center',
    },
    otherItemImage: {
        width: '100%',
        height: 150,
        borderRadius: 6,
    },
    otherItemTitle: {
        fontWeight: '600',
        marginVertical: 4,
        textAlign: 'center',
        color: '#333',
    },
    label: {
        fontWeight: '600',
        color: '#777',
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
    },
    scrollContainer: {
        paddingHorizontal: 8,
    },
});

export default ResourceDetail;
