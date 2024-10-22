import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import { AuthContext } from './AuthContext';
import api from './api';
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import Navbar from './Navbar';

const EditProfile = ({ navigation }) => {
    const { authToken, profileData } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        first_name: '',
        surname: '',
        email: '',
        about: '',
        user_subjects: [],
        favorite_topics: [],
        socials: {
            facebook: '',
            twitter: ''
        },
        profile_picture: null
    });

    const [subjects, setSubjects] = useState(['Math', 'Science', 'History', 'Art', 'Music']);
    const [topics, setTopics] = useState(['Algebra', 'Geometry', 'Biology', 'Chemistry', 'Physics']);
    
    const [userSubjectsOpen, setUserSubjectsOpen] = useState(false);
    const [favoriteTopicsOpen, setFavoriteTopicsOpen] = useState(false);
    const [userSubjectsValue, setUserSubjectsValue] = useState([]); // Ensure initial state is an array
    const [favoriteTopicsValue, setFavoriteTopicsValue] = useState([]); // Ensure initial state is an array

    useEffect(() => {
        if (profileData && profileData.user) { // Ensure profileData is defined
            setFormData((prevFormData) => ({
                ...prevFormData,
                first_name: profileData.user.first_name || '',
                surname: profileData.user.surname || '',
                email: profileData.user.email || '',
                about: profileData.profileDetails.about || '',
                user_subjects: Array.isArray(profileData.profileDetails.user_subjects) ? profileData.profileDetails.user_subjects : [],
                favorite_topics: Array.isArray(profileData.profileDetails.favorite_topics) ? profileData.profileDetails.favorite_topics : [],
                socials: profileData.profileDetails.socials || {},
                profile_picture: profileData.user.profile_picture || null
            }));
            setUserSubjectsValue(Array.isArray(profileData.profileDetails.user_subjects) ? profileData.profileDetails.user_subjects : []);
            setFavoriteTopicsValue(Array.isArray(profileData.profileDetails.favorite_topics) ? profileData.profileDetails.favorite_topics : []);
        }
    }, [profileData]);

    const handleInputChange = (name, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setFormData((prevFormData) => ({ ...prevFormData, profile_picture: result.assets[0].uri }));
        }
    };

    const handleSubmit = async () => {
        const formDataToSend = new FormData();
        formDataToSend.append('first_name', formData.first_name);
        formDataToSend.append('surname', formData.surname);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('about', formData.about);
        formDataToSend.append('user_subjects', JSON.stringify(userSubjectsValue)); // JSON.stringify for array
        formDataToSend.append('favorite_topics', JSON.stringify(favoriteTopicsValue)); // JSON.stringify for array
        formDataToSend.append('socials', JSON.stringify(formData.socials));

        if (formData.profile_picture) {
            const localUri = formData.profile_picture;
            const filename = localUri.split('/').pop();
            const type = `image/${filename.split('.').pop()}`;
            formDataToSend.append('profile_picture', {
                uri: localUri,
                name: filename,
                type,
            });
        }

        try {
            const response = await api.post('/profile.update', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${authToken}`,
                },
            });
            Alert.alert("Profile Updated!", "Your profile has been updated successfully.");
        } catch (error) {
            console.error("Error updating profile:", error);
            Alert.alert("Error", "There was an error updating your profile. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Navbar navigation={navigation} />
            <ScrollView style={styles.scrollContainer}>
                <Text style={styles.header}>Edit Profile</Text>

                <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
                    {formData.profile_picture ? (
                        <Image source={{ uri: formData.profile_picture }} style={styles.profileImage} />
                    ) : (
                        <Image source={require('./../assets/images/avatar.png')} style={styles.profileImage} />
                    )}
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={formData.first_name}
                    onChangeText={(text) => handleInputChange('first_name', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Surname"
                    value={formData.surname}
                    onChangeText={(text) => handleInputChange('surname', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="About"
                    value={formData.about}
                    onChangeText={(text) => handleInputChange('about', text)}
                />

                <DropDownPicker
                    open={userSubjectsOpen}
                    value={userSubjectsValue}
                    items={subjects.map((subject) => ({ label: subject, value: subject }))} 
                    multiple={true}
                    setOpen={setUserSubjectsOpen}
                    setValue={setUserSubjectsValue} // Directly set value
                    setItems={setSubjects}
                    placeholder="Select Subjects"
                    style={styles.dropdown}
                />

                <DropDownPicker
                    open={favoriteTopicsOpen}
                    value={favoriteTopicsValue}
                    items={topics.map((topic) => ({ label: topic, value: topic }))} 
                    multiple={true}
                    setOpen={setFavoriteTopicsOpen}
                    setValue={setFavoriteTopicsValue} // Directly set value
                    setItems={setTopics}
                    placeholder="Select Favorite Topics"
                    style={styles.dropdown}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Facebook Profile"
                    value={formData.socials.facebook}
                    onChangeText={(text) => handleInputChange('socials.facebook', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Twitter Profile"
                    value={formData.socials.twitter}
                    onChangeText={(text) => handleInputChange('socials.twitter', text)}
                />

                <Button title="Save Profile" onPress={handleSubmit} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff'
    },
    scrollContainer: {
        marginBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    imagePicker: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 128,
        height: 128,
        borderRadius: 64,
        borderWidth: 2,
        borderColor: '#007BFF',
    },
    dropdown: {
        marginBottom: 15,
    },
});

export default EditProfile;
