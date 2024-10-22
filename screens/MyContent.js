import React, { useEffect, useContext, useState } from 'react'; 
import { View, Text, Button, FlatList, Alert, StyleSheet } from 'react-native';
import api from './api'; // Adjust the import based on your project structure
import { AuthContext } from './AuthContext';
import Navbar from './Navbar';

const MyContent = ({ navigation }) => {
    const { authToken, profileData } = useContext(AuthContext); // Assuming profileData is available in AuthContext
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchContents();
    }, []);

    const fetchContents = async () => {
        try {
            const response = await api.get('/tbooke-learning'); // Fetch all Tbooke Learning contents

            // Log the response to see its structure
            console.log("API Response:", response);

            // Check if response.data is an array
            if (Array.isArray(response.data)) {
                // Filter contents to include only those created by the logged-in user
                const userContents = response.data.filter(content => content.user?.id === profileData?.user?.id);
                setContents(userContents);
            } else {
                setError('No contents found or the data structure is incorrect.');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load contents');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (content) => {
        Alert.alert(
            'Delete Confirmation',
            'Are you sure you want to delete this content?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            await api.delete(`/tbooke-learning/${content.slug}`); // Use the slug for deletion
                            fetchContents(); // Refresh the list after deletion
                        } catch (err) {
                            console.error(err);
                            setError('Failed to delete content');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <Navbar navigation={navigation} />
            
            <Text style={styles.header}>My Content</Text>
            <FlatList
                data={contents}
                keyExtractor={(item) => item.slug} // Use slug for key extractor
                renderItem={({ item }) => (
                    <View style={styles.contentItem}>
                        <Text style={styles.title}>{item.content_title}</Text>
                        <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
                        <View style={styles.actions}>
                            <Button
                                title="Edit"
                                onPress={() => navigation.navigate('EditContent', { slug: item.slug })} // Navigate to edit screen with slug
                                color="#FFA500" // orange color for edit
                            />
                            <Button
                                title="Delete"
                                onPress={() => handleDelete(item)}
                                color="#FF0000" // red color for delete
                            />
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    contentItem: {
        marginBottom: 15,
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    title: {
        fontSize: 18,
    },
    date: {
        fontSize: 14,
        color: '#777',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});

export default MyContent;
