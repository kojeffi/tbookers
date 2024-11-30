import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from './AuthContext';
import api from './api';
import Navbar from './Navbar';

const MyContent = ({ navigation }) => {
    const { authToken, profileData } = useContext(AuthContext);
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (authToken) {
            fetchContents();
        } else {
            setLoading(false);
            setError('You need to log in to view your content.');
        }
    }, [authToken]);

    const fetchContents = async () => {
        try {
            const response = await api.get('/tbooke-learning', {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            const userId = profileData?.user?.id || profileData?.profileDetails?.id;

            if (userId) {
                const userContents = response.data.contents.filter(
                    content => content.user_id.toString() === userId.toString()
                );
                setContents(userContents);
            } else {
                setContents([]);
            }
        } catch (e) {
            console.error('Failed to fetch contents', e);
            setError('Failed to load contents');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (content) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this content?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            await api.delete(`/tbooke-learning/${content.slug}`, {
                                headers: { Authorization: `Bearer ${authToken}` }
                            });
                            fetchContents(); // Refresh the list
                        } catch (e) {
                            console.error('Failed to delete content', e);
                            Alert.alert('Error', 'Failed to delete content');
                        }
                    }
                }
            ]
        );
    };

    const handleEditContent = (contentId) => {
        navigation.navigate('EditContent', { contentId });
    };
    

    const handleCreateContent = () => {
        navigation.navigate('CreateContent');
    };

    if (loading) {
        return <Text style={styles.loadingText}>Loading...</Text>;
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <Navbar /> 
            <Text style={styles.title}>My Content</Text>
            <TouchableOpacity style={styles.createButton} onPress={handleCreateContent}>
                <Text style={styles.createButtonText}>Create New Content</Text>
            </TouchableOpacity>
            <FlatList
                data={contents}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <TouchableOpacity onPress={() => navigation.navigate('ContentDetail', { slug: item.slug })}>
                            <Text style={styles.contentTitle}>{item.content_title}</Text>
                            <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        <View style={styles.actions}>

                        <TouchableOpacity 
                        style={styles.editButton} 
                        onPress={() => navigation.navigate('EditContent', { contentId: item.slug, contentDetails: item })}>
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.editButton} onPress={() => handleEditContent(item.slug)}>
                         <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity> */}

                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)}>
                          <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No content found. Please create new content.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: '#343a40',
    },
    createButton: {
        backgroundColor: '#008080',
        padding: 10,
        borderRadius: 5,
        marginBottom: 16,
        alignItems: 'center',
    },
    createButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    card: {
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3, // for Android shadow
    },
    contentTitle: {
        fontSize: 16,
        color: '#007bff',
        marginBottom: 4,
    },
    date: {
        fontSize: 14,
        color: '#6c757d',
        marginBottom: 8,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    editButton: {
        backgroundColor: 'orange',
        padding: 10,
        borderRadius: 5,
        width: '48%', // Adjust width for spacing
        alignItems: 'center',
    },
    editButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        width: '48%', // Adjust width for spacing
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 14,
        marginTop: 20,
    },
    errorText: {
        textAlign: 'center',
        fontSize: 14,
        color: 'red',
        marginTop: 20,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#6c757d',
        marginTop: 20,
    },
});

export default MyContent;
