import React, { useState, useContext } from 'react';
import { View, TextInput, Text, Button, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from './AuthContext'; // Adjust the import according to your folder structure
import { MaterialIcons } from '@expo/vector-icons';
import Navbar from './Navbar';
import DropDownPicker from 'react-native-dropdown-picker';

const ContentCreationForm = ({ navigation }) => {
    const { authToken } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);
    const [mediaFiles, setMediaFiles] = useState([]);
    const [content, setContent] = useState('');
    const [open, setOpen] = useState(false); // State to control dropdown open/close
    const [categoryOptions, setCategoryOptions] = useState([
        { label: "Pre School", value: "Pre School" },
        { label: "Grades 1-6", value: "Grades 1-6" },
        { label: "CBC Content", value: "CBC Content" },
        { label: "JSS", value: "Junior Secondary School" },
        { label: "High School", value: "High School" },
    ]);

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('content_title', title);
        selectedCategories.forEach(category => {
            formData.append('content_category[]', category);
        });
        if (thumbnail) {
            formData.append('content_thumbnail', {
                uri: thumbnail.uri,
                type: thumbnail.mime || 'image/jpeg',
                name: `thumbnail.${thumbnail.uri.split('.').pop()}`,
            });
        }
        mediaFiles.forEach((file, index) => {
            formData.append('media_files[]', {
                uri: file.uri,
                type: file.mime || 'multipart/form-data',
                name: `media_file_${index}.${file.uri.split('.').pop()}`,
            });
        });
        formData.append('content', content);

        try {
            const response = await fetch('http://192.168.12.117:8000/api/tbooke-learning', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Accept': 'application/json',
                },
                body: formData,
            });

            if (response.ok) {
                Alert.alert('Content Created Successfully!');
                navigation.navigate('TbookeLearning');
            } else {
                const errorResponse = await response.json();
                Alert.alert('Error', errorResponse.message || 'Something went wrong!');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.message);
        }
    };

    const pickThumbnail = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setThumbnail(result.assets[0]);
        }
    };

    const pickMediaFiles = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
        });
        if (!result.canceled) {
            setMediaFiles(prevFiles => [...prevFiles, ...result.assets]);
        }
    };

    const removeThumbnail = () => {
        setThumbnail(null);
    };

    const removeMediaFile = (index) => {
        setMediaFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    return (
        <View style={styles.container}>
            <Navbar navigation={navigation} />
            <ScrollView>
                <View style={styles.containerOne}>
                    <Text style={styles.title}>Create Content</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Content title"
                        value={title}
                        onChangeText={setTitle}
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
                    <TouchableOpacity style={styles.uploadButton} onPress={pickThumbnail}>
                        <MaterialIcons name="file-upload" size={20} color="#fff" />
                        <Text style={styles.uploadText}>Upload Content Thumbnail</Text>
                    </TouchableOpacity>
                    {thumbnail && (
                        <View style={styles.imagePreviewContainer}>
                            <Image source={{ uri: thumbnail.uri }} style={styles.imagePreview} />
                            <TouchableOpacity onPress={removeThumbnail} style={styles.removeIcon}>
                                <MaterialIcons name="close" size={20} color="#ff0000" />
                            </TouchableOpacity>
                        </View>
                    )}
                    <TouchableOpacity style={styles.uploadButton} onPress={pickMediaFiles}>
                        <MaterialIcons name="attach-file" size={20} color="#fff" />
                        <Text style={styles.uploadText}>Upload Media Files</Text>
                    </TouchableOpacity>
                    {mediaFiles.length > 0 && mediaFiles.map((file, index) => (
                        <View key={index} style={styles.imagePreviewContainer}>
                            <Image source={{ uri: file.uri }} style={styles.imagePreview} />
                            <TouchableOpacity onPress={() => removeMediaFile(index)} style={styles.removeIcon}>
                                <MaterialIcons name="close" size={20} color="#ff0000" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TextInput
                        style={styles.textArea}
                        placeholder="Start typing your content..."
                        value={content}
                        onChangeText={setContent}
                        multiline
                        numberOfLines={10}
                    />
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Submit</Text>
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
        padding: 15,
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
        backgroundColor: '#800000',
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
    },
    uploadText: {
        color: '#fff',
        marginLeft: 10,
        textDecorationLine: 'underline',
    },
    imagePreviewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 5,
        marginRight: 10,
    },
    removeIcon: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: '#008080',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ContentCreationForm;
