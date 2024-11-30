import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import api from './api';
import { AuthContext } from './AuthContext';

const SchoolList = ({ navigation }) => {
    const { authToken } = useContext(AuthContext);
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch schools data
    const fetchSchools = async () => {
        try {
            setLoading(true);
            const response = await api.get('/schools', {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setSchools(response.data);
        } catch (err) {
            console.error('Error fetching schools', err);
            setError('Failed to load schools');
        } finally {
            setLoading(false);
        }
    };

    // Delete school
    const deleteSchool = async (schoolId) => {
        try {
            await api.delete(`/schools-corner/deleteSchool/${schoolId}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setSchools(schools.filter(school => school.id !== schoolId));
            Alert.alert('Success', 'School deleted successfully');
        } catch (err) {
            console.error('Error deleting school', err);
            Alert.alert('Error', 'Failed to delete school');
        }
    };

    // Confirmation before deleting
    const confirmDelete = (schoolId) => {
        Alert.alert(
            'Delete School',
            'Are you sure you want to delete this school?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: () => deleteSchool(schoolId) },
            ]
        );
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text style={{ color: 'red' }}>{error}</Text>;

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>My Schools</Text>
            <FlatList
                data={schools}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={() => <Text>No schools found.</Text>}
                renderItem={({ item }) => (
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 15,
                            borderBottomWidth: 1,
                            borderBottomColor: '#ccc',
                        }}
                    >
                        <TouchableOpacity onPress={() => navigation.navigate('SchoolDetail', { slug: item.slug })}>
                            <Text style={{ fontSize: 16, color: '#0000ff' }}>{item.name}</Text>
                        </TouchableOpacity>
                        <Text>{new Date(item.created_at).toLocaleDateString()}</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <Button
                                title="Edit"
                                color="#FFA500"
                                onPress={() => navigation.navigate('EditSchool', { id: item.id })}
                            />
                            <Button
                                title="Delete"
                                color="#FF0000"
                                onPress={() => confirmDelete(item.id)}
                            />
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

export default SchoolList;
