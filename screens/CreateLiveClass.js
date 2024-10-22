import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import Navbar from './Navbar';
import DropDownPicker from 'react-native-dropdown-picker';
import { AuthContext } from './AuthContext'; // Import AuthContext to access the token
import api from './api'; // Import the custom api with token interceptor
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateLiveClass = ({ navigation }) => {
    const [className, setClassName] = useState('');
    const [classCategory, setClassCategory] = useState(null);
    const [classDate, setClassDate] = useState(new Date());
    const [classTime, setClassTime] = useState(new Date());
    const [classDescription, setClassDescription] = useState('');
    const [open, setOpen] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [items, setItems] = useState([
        { label: 'Select category', value: null },
        { label: 'Math', value: 'Math' },
        { label: 'Science', value: 'Science' },
        { label: 'Language Arts', value: 'Language Arts' },
        { label: 'History', value: 'History' },
        { label: 'Technology', value: 'Technology' },
        { label: 'Arts', value: 'Arts' },
        { label: 'Physical Education', value: 'Physical Education' },
        { label: 'Other', value: 'Other' },
    ]);

    const { authToken } = useContext(AuthContext); // Get authToken from AuthContext

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || classDate;
        setShowDatePicker(false);
        setClassDate(currentDate);
    };

    const handleTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || classTime;
        setShowTimePicker(false);
        setClassTime(currentTime);
    };

    const handleSubmit = async () => {
        // Validate inputs
        if (!className || !classCategory || !classDate || !classTime || !classDescription) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        const data = {
            class_name: className,
            class_category: classCategory,
            class_date: classDate.toISOString().split('T')[0], // Format the date as needed
            class_time: classTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Format time
            class_description: classDescription,
        };

        try {
            // Use the custom API instance (which includes token) to POST the data
            const response = await api.post('/live-classes', data); // Laravel 'live-classes.store' route

            if (response.status === 201 || response.status === 200) {
                Alert.alert("Success", "Class created successfully!");
                // Optionally, reset form fields here
                setClassName('');
                setClassCategory(null);
                setClassDate(new Date());
                setClassTime(new Date());
                setClassDescription('');
            } else {
                Alert.alert("Error", "Failed to create class");
            }
        } catch (error) {
            console.error('Error creating class:', error);
            Alert.alert("Error", "Something went wrong!");
        }
    };

    return (
        <View style={styles.container}>
            <Navbar navigation={navigation} />
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Create Live Class</Text>
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Class Name"
                        value={className}
                        onChangeText={setClassName}
                    />
                   
                    <Button title="Select Class Date" onPress={() => setShowDatePicker(true)} />
                    {showDatePicker && (
                        <DateTimePicker
                            value={classDate}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}
                
                    <View style={styles.space} />
                    <Button style={styles.buttonStyle} title="Select Class Time" onPress={() => setShowTimePicker(true)} />
                    {showTimePicker && (
                        <DateTimePicker
                            value={classTime}
                            mode="time"
                            display="default"
                            onChange={handleTimeChange}
                        />
                    )}

                        <DropDownPicker
                        open={open}
                        value={classCategory}
                        items={items}
                        setOpen={setOpen}
                        setValue={setClassCategory}
                        setItems={setItems}
                        placeholder="Select category"
                        containerStyle={{ height: 40 }}
                        style={styles.picker}
                        dropDownContainerStyle={{ backgroundColor: '#fafafa',marginTop:20, }}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Start typing class description..."
                        value={classDescription}
                        onChangeText={setClassDescription}
                        multiline
                        numberOfLines={4}
                    />
                    <Button title="Create Class" onPress={handleSubmit} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: '#007060',
    },
    form: {
        marginVertical: 10,
    },
    buttonStyle: {
        marginTop: 80,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        marginTop: 20,
    },
    picker: {
        marginBottom: 20, // Add space between dropdown and other elements
    },
    space: {
        height: 20, // Space between dropdowns
    },
});

export default CreateLiveClass;
