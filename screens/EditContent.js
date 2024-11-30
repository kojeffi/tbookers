import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Text, Button, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from './AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import Navbar from './Navbar';
import DropDownPicker from 'react-native-dropdown-picker';
import api from './api';

const EditContentScreen = ({ route, navigation }) => {
    const { contentId } = route.params;
    const { authToken } = useContext(AuthContext);

    const [contentTitle, setContentTitle] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [contentThumbnail, setContentThumbnail] = useState(null);
    const [mediaFiles, setMediaFiles] = useState([]);
    const [contentBody, setContentBody] = useState('');
    const [categoryOptions, setCategoryOptions] = useState([
        { label: 'Pre School', value: 'Pre School' },
        { label: 'Grades 1-6', value: 'Grades 1-6' },
        { label: 'CBC Content', value: 'CBC Content' },
        { label: 'JSS', value: 'Junior Secondary School' },
        { label: 'High School', value: 'High School' },
    ]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (authToken) {
            fetchContentData();
        }
    }, [authToken]);

    const fetchContentData = async () => {
        try {
            const response = await api.get(`/tbooke-learning/${contentId}`);
            const content = response.data;

            if (content) {
                setContentTitle(content.content_title || '');
                setSelectedCategories(content.content_category ? content.content_category.split(',') : []);
                setContentThumbnail(content.content_thumbnail || null);
                setMediaFiles(content.media_files ? JSON.parse(content.media_files) : []);
                setContentBody(content.content || '');
            } else {
                Alert.alert('Error', 'Content not found');
            }
        } catch (error) {
            console.error('Failed to load content', error);
            Alert.alert('Error', 'Failed to load content');
        }
    };

    const handleThumbnailPick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync();
        if (!result.cancelled) {
            setContentThumbnail(result.uri);
        }
    };

    const handleMediaPick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true });
        if (!result.cancelled) {
            setMediaFiles(result.selected.map(file => file.uri));
        }
    };

    const handleUpdateContent = async () => {
        const formData = new FormData();
        formData.append('content_title', contentTitle);
        formData.append('content_category', selectedCategories.join(','));

        if (contentThumbnail) {
            formData.append('content_thumbnail', {
                uri: contentThumbnail,
                name: 'thumbnail.jpg',
                type: 'image/jpeg',
            });
        }

        mediaFiles.forEach((file, index) => {
            formData.append(`media_files[${index}]`, {
                uri: file,
                name: `media_${index}.jpg`,
                type: 'image/jpeg',
            });
        });

        formData.append('content', contentBody);

        try {
            await api.put(`/tbooke-learning/creator/${contentId}`, formData);
            Alert.alert('Success', 'Content updated successfully');
            navigation.goBack(); // Navigate back to the previous screen after success
        } catch (error) {
            console.error('Failed to update content', error);
            Alert.alert('Error', 'Failed to update content');
        }
    };

    const renderMediaFiles = ({ item }) => (
        <View style={styles.mediaItemContainer}>
            <Image source={{ uri: item }} style={styles.imagePreview} />
            <TouchableOpacity onPress={() => removeMediaFile(item)} style={styles.removeIcon}>
                <MaterialIcons name="close" size={20} color="#ff0000" />
            </TouchableOpacity>
        </View>
    );

    const removeMediaFile = (file) => {
        setMediaFiles(mediaFiles.filter(item => item !== file));
    };

    return (
        <View style={styles.container}>
            <Navbar navigation={navigation} />
            <ScrollView>
                <View style={styles.containerOne}>
                    <Text style={styles.title}>Edit Content</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Content title"
                        value={contentTitle}
                        onChangeText={setContentTitle}
                    />
                    <Text style={styles.label}>Select Content Categories:</Text>
                    <DropDownPicker
                        open={open}
                        value={selectedCategories}
                        items={categoryOptions}
                        setOpen={setOpen}
                        setValue={setSelectedCategories}
                        setItems={setCategoryOptions}
                        multiple={true}
                        min={0}
                        max={5}
                        placeholder="Select categories"
                        containerStyle={styles.dropdownContainer}
                        style={styles.dropdown}
                        dropDownStyle={styles.dropdownList}
                        searchable={true}
                        searchablePlaceholder="Search..."
                        searchablePlaceholderTextColor="gray"
                    />
                    <TouchableOpacity style={styles.uploadButton} onPress={handleThumbnailPick}>
                        <MaterialIcons name="file-upload" size={20} color="#fff" />
                        <Text style={styles.uploadText}>Upload Content Thumbnail</Text>
                    </TouchableOpacity>
                    {contentThumbnail && (
                        <View style={styles.imagePreviewContainer}>
                            <Image source={{ uri: contentThumbnail }} style={styles.imagePreview} />
                            <TouchableOpacity onPress={() => setContentThumbnail(null)} style={styles.removeIcon}>
                                <MaterialIcons name="close" size={20} color="#ff0000" />
                            </TouchableOpacity>
                        </View>
                    )}
                    <TouchableOpacity style={styles.uploadButton} onPress={handleMediaPick}>
                        <MaterialIcons name="attach-file" size={20} color="#fff" />
                        <Text style={styles.uploadText}>Upload Media Files</Text>
                    </TouchableOpacity>
                    
                    {/* Render media files in rows of 3 */}
                    {mediaFiles.length > 0 && (
                        <FlatList
                            data={mediaFiles}
                            renderItem={renderMediaFiles}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={3} // Display three items per row
                            columnWrapperStyle={styles.row} // Style for the row
                        />
                    )}

                    <TextInput
                        style={styles.textArea}
                        placeholder="Start typing your content..."
                        value={contentBody}
                        onChangeText={setContentBody}
                        multiline
                        numberOfLines={10}
                    />
                    <TouchableOpacity style={styles.submitButton} onPress={handleUpdateContent}>
                        <Text style={styles.submitButtonText}>Update Content</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    containerOne: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        padding: 10,
    },
    dropdownContainer: {
        height: 50,
        marginBottom: 15,
    },
    dropdown: {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderRadius: 5,
    },
    dropdownList: {
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    input: {
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 20,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
        color: "#333",
    },
    textArea: {
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 20,
        padding: 10,
        marginBottom: 15,
        height: 100,
        backgroundColor: '#fff',
    },
    label: {
        marginBottom: 10,
        fontWeight: 'bold',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#008080',
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
    },
    uploadText: {
        color: '#fff',
        marginLeft: 10,
        textDecorationLine: 'underline',
    },
    mediaItemContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5, // Adjust margin for spacing between items
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 5,
    },
    removeIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
        borderRadius: 15,
        padding: 5,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    row: {
        justifyContent: 'space-around',
    },
    submitButton: {
        backgroundColor: '#008080',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default EditContentScreen;
