import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 
import api from './api'; 
import { AuthContext } from './AuthContext'; 
import DropDownPicker from 'react-native-dropdown-picker'; 
import Navbar from './Navbar';

const EditResource = ({ route, navigation }) => {
    const { resourceId } = route.params; 
    const { userToken } = useContext(AuthContext); 
    const [resource, setResource] = useState({});
    const [itemName, setItemName] = useState('');
    const [itemCategory, setItemCategory] = useState(null);
    const [county, setCounty] = useState(null);
    const [itemPrice, setItemPrice] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [itemThumbnail, setItemThumbnail] = useState(null);
    const [itemImages, setItemImages] = useState([]);
    const [loading, setLoading] = useState(false); // Loading state

    const categoryOptions = [
        { label: 'Books', value: 'Books' },
        { label: 'Stationery', value: 'Stationery' },
        { label: 'Educational Resources', value: 'Educational Resources' },
        { label: 'Educational Software', value: 'Educational Software' },
        { label: 'Electronics', value: 'Electronics' },
        { label: 'Online Courses and Tutorials', value: 'Online Courses and Tutorials' },
        { label: 'Sporting Equipment', value: 'Sporting Equipment' },
        { label: 'Other', value: 'Other' },
    ];

    const countyOptions = [
        { label: 'Nairobi', value: 'Nairobi' },
        { label: 'Mombasa', value: 'Mombasa' },
        // Add more counties here as needed
    ];

    useEffect(() => {
        const fetchResource = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/learning-resources/${resourceId}`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });
                const data = response.data;
                setResource(data);
                // Populate form fields with existing resource data
                setItemName(data.item_name);
                setItemCategory(data.item_category);
                setCounty(data.county);
                setItemPrice(data.item_price.toString());
                setContactPhone(data.contact_phone.toString());
                setContactEmail(data.contact_email);
                setWhatsappNumber(data.whatsapp_number.toString());
            } catch (error) {
                console.error(error);
                Alert.alert('Error fetching resource data');
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchResource();
    }, [resourceId, userToken]);

    const handleUpdate = async () => {
        setLoading(true); // Start loading during update
        const formData = new FormData();
        formData.append('item_name', itemName);
        formData.append('item_category', itemCategory);
        formData.append('county', county);
        formData.append('item_price', itemPrice);
        formData.append('contact_phone', contactPhone);
        formData.append('contact_email', contactEmail);
        formData.append('whatsapp_number', whatsappNumber);

        if (itemThumbnail) {
            formData.append('item_thumbnail', {
                uri: itemThumbnail.uri,
                type: 'image/jpeg',
                name: itemThumbnail.uri.split('/').pop(),
            });
        }

        itemImages.forEach((image) => {
            formData.append('item_images[]', {
                uri: image.uri,
                type: 'image/jpeg',
                name: image.uri.split('/').pop(),
            });
        });

        try {
            await api.put(`/learning-resources/seller/${resourceId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userToken}`,
                },
            });
            Alert.alert('Resource updated successfully');
            navigation.goBack(); // Navigate back after successful update
        } catch (error) {
            console.error(error);
            Alert.alert('Error updating resource');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const pickThumbnail = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setItemThumbnail(result);
        }
    };

    const pickImages = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.cancelled) {
            setItemImages(result.selected || [result]); // Handle single or multiple images
        }
    };

    return (
        <ScrollView style={{ padding: 16 }}>
            <View>
                <Navbar />
            </View>
            <Text style={{ fontSize: 24, marginBottom: 16 }}>Edit Resource</Text>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}

            <Text>Item Name</Text>
            <TextInput
                style={{ borderWidth: 1, marginBottom: 16 }}
                placeholder="Item Name"
                value={itemName}
                onChangeText={setItemName}
            />

            <Text>Item Category</Text>
            <DropDownPicker
                items={categoryOptions}
                defaultValue={itemCategory}
                containerStyle={{ height: 40, marginBottom: 16 }}
                onChangeItem={(item) => setItemCategory(item.value)}
                placeholder="Select category"
            />

            <Text>County</Text>
            <DropDownPicker
                items={countyOptions}
                defaultValue={county}
                containerStyle={{ height: 40, marginBottom: 16 }}
                onChangeItem={(item) => setCounty(item.value)}
                placeholder="Select county"
            />

            <Text>Item Price</Text>
            <TextInput
                style={{ borderWidth: 1, marginBottom: 16 }}
                placeholder="Item Price"
                value={itemPrice}
                onChangeText={setItemPrice}
                keyboardType="numeric"
            />

            <Text>Contact Phone</Text>
            <TextInput
                style={{ borderWidth: 1, marginBottom: 16 }}
                placeholder="Contact Phone"
                value={contactPhone}
                onChangeText={setContactPhone}
                keyboardType="numeric"
            />

            <Text>Contact Email</Text>
            <TextInput
                style={{ borderWidth: 1, marginBottom: 16 }}
                placeholder="Contact Email"
                value={contactEmail}
                onChangeText={setContactEmail}
                keyboardType="email-address"
            />

            <Text>WhatsApp Number</Text>
            <TextInput
                style={{ borderWidth: 1, marginBottom: 16 }}
                placeholder="WhatsApp Number"
                value={whatsappNumber}
                onChangeText={setWhatsappNumber}
                keyboardType="numeric"
            />

            <Button title="Update Thumbnail" onPress={pickThumbnail} />
            {itemThumbnail && <Text>{itemThumbnail.uri}</Text>}

            <Button title="Select Item Images" onPress={pickImages} />
            {itemImages.map((image, index) => (
                <Text key={index}>{image.uri}</Text>
            ))}

            <Button title="Update Resource" onPress={handleUpdate} disabled={loading} />
        </ScrollView>
    );
};

export default EditResource;
