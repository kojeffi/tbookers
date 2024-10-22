import React, { useState } from 'react';
import { View, Text, TextInput, Picker, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import Navbar from './Navbar'; // Adjust the import based on your file structure

const EditLiveClass = ({ route }) => {
    const { liveClass } = route.params; // Assuming liveClass data is passed via navigation

    const [className, setClassName] = useState(liveClass.class_name || '');
    const [classCategory, setClassCategory] = useState(liveClass.class_category || '');
    const [classDate, setClassDate] = useState(liveClass.class_date || '');
    const [classTime, setClassTime] = useState(liveClass.class_time || '');
    const [classDescription, setClassDescription] = useState(liveClass.class_description || '');

    const [errors, setErrors] = useState({});

    const categories = [
        'Math', 'Science', 'Language Arts', 'History',
        'Technology', 'Arts', 'Physical Education', 'Other'
    ];

    const handleSubmit = () => {
        const newErrors = {};

        // Basic validation
        if (!className) newErrors.className = 'Class Name is required';
        if (!classCategory) newErrors.classCategory = 'Class Category is required';
        if (!classDate) newErrors.classDate = 'Class Date is required';
        if (!classTime) newErrors.classTime = 'Class Time is required';
        if (!classDescription) newErrors.classDescription = 'Class Description is required';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // Make API request to update the live class
            Alert.alert('Class Updated', `Class "${className}" updated successfully!`);
        }
    };

    return (
        <View style={styles.container}>
            <Navbar />
            <ScrollView style={styles.scrollView}>
                <Text style={styles.title}>Edit Live Class</Text>
                <View style={styles.inputContainer}>
                    <Text>Class Name</Text>
                    <TextInput
                        style={styles.input}
                        value={className}
                        onChangeText={setClassName}
                    />
                    {errors.className && <Text style={styles.errorText}>{errors.className}</Text>}
                </View>
                <View style={styles.inputContainer}>
                    <Text>Class Category</Text>
                    <Picker
                        selectedValue={classCategory}
                        style={styles.picker}
                        onValueChange={(itemValue) => setClassCategory(itemValue)}
                    >
                        <Picker.Item label="Select category" value="" />
                        {categories.map((category, index) => (
                            <Picker.Item key={index} label={category} value={category} />
                        ))}
                    </Picker>
                    {errors.classCategory && <Text style={styles.errorText}>{errors.classCategory}</Text>}
                </View>
                <View style={styles.inputContainer}>
                    <Text>Class Date</Text>
                    <TextInput
                        style={styles.input}
                        value={classDate}
                        onChangeText={setClassDate}
                        placeholder="YYYY-MM-DD"
                    />
                    {errors.classDate && <Text style={styles.errorText}>{errors.classDate}</Text>}
                </View>
                <View style={styles.inputContainer}>
                    <Text>Class Time</Text>
                    <TextInput
                        style={styles.input}
                        value={classTime}
                        onChangeText={setClassTime}
                        placeholder="HH:MM"
                    />
                    {errors.classTime && <Text style={styles.errorText}>{errors.classTime}</Text>}
                </View>
                <View style={styles.inputContainer}>
                    <Text>Class Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={classDescription}
                        onChangeText={setClassDescription}
                        multiline
                    />
                    {errors.classDescription && <Text style={styles.errorText}>{errors.classDescription}</Text>}
                </View>
                <Button title="Update Class" onPress={handleSubmit} color="#007bff" />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollView: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    inputContainer: {
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff',
    },
    textArea: {
        height: 100,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    errorText: {
        color: 'red',
        marginTop: 4,
    },
});

export default EditLiveClass;
