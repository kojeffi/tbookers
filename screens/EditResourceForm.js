import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 
import api from './api'; 
import { AuthContext } from './AuthContext'; 
import DropDownPicker from 'react-native-dropdown-picker'; 
import Navbar from './Navbar';
import RNPickerSelect from 'react-native-picker-select';

const EditResource = ({ route, navigation }) => {
    const { resourceId, resourceDetails } = route.params;
    const { userToken } = useContext(AuthContext); 
    const [resource, setResource] = useState(resourceDetails || {});
    const [itemName, setItemName] = useState(resourceDetails ? resourceDetails.item_name : '');
    const [itemCategories, setItemCategories] = useState(resourceDetails ? resourceDetails.item_category : []);
    const [counties, setCounties] = useState(resourceDetails ? resourceDetails.county : []);
    const [itemPrice, setItemPrice] = useState(resourceDetails ? resourceDetails.item_price.toString() : '');
    const [contactPhone, setContactPhone] = useState(resourceDetails ? resourceDetails.contact_phone.toString() : '');
    const [contactEmail, setContactEmail] = useState(resourceDetails ? resourceDetails.contact_email : '');
    const [whatsappNumber, setWhatsappNumber] = useState(resourceDetails ? resourceDetails.whatsapp_number.toString() : '');
    const [itemThumbnail, setItemThumbnail] = useState(null);
    const [itemImages, setItemImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState(resourceDetails ? resourceDetails.description : '');

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
        { label: 'Kisumu', value: 'Kisumu' },
        { label: 'Nakuru', value: 'Nakuru' },
        { label: 'Eldoret', value: 'Eldoret' },
        { label: 'Meru', value: 'Meru' },
        { label: 'Nyeri', value: 'Nyeri' },
        { label: 'Kakamega', value: 'Kakamega' },
        { label: 'Kericho', value: 'Kericho' },
        { label: 'Kitui', value: 'Kitui' },
        { label: 'Kilifi', value: 'Kilifi' },
        { label: 'Bomet', value: 'Bomet' },
        { label: 'Laikipia', value: 'Laikipia' },
        { label: 'Bungoma', value: 'Bungoma' },
        { label: 'Busia', value: 'Busia' },
        { label: 'Trans-Nzoia', value: 'Trans-Nzoia' },
        { label: 'Narok', value: 'Narok' },
        { label: 'Kajiado', value: 'Kajiado' },
        { label: 'Nyamira', value: 'Nyamira' },
        { label: 'Homa Bay', value: 'Homa Bay' },
        { label: 'Migori', value: 'Migori' },
        { label: 'Siaya', value: 'Siaya' },
        { label: 'Isiolo', value: 'Isiolo' },
        { label: 'Samburu', value: 'Samburu' },
        { label: 'Tharaka-Nithi', value: 'Tharaka-Nithi' },
        { label: 'Embu', value: 'Embu' },
        { label: 'Meru', value: 'Meru' },
        { label: 'West Pokot', value: 'West Pokot' },
        { label: 'Turkana', value: 'Turkana' },
        { label: 'Marsabit', value: 'Marsabit' },
        { label: 'Lamu', value: 'Lamu' },
        { label: 'Tana River', value: 'Tana River' },
        { label: 'Garissa', value: 'Garissa' },
        { label: 'Wajir', value: 'Wajir' },
        { label: 'Mandera', value: 'Mandera' },
        { label: 'Nairobi City', value: 'Nairobi City' },
        { label: 'Uasin Gishu', value: 'Uasin Gishu' },
        { label: 'Nyandarua', value: 'Nyandarua' },
        { label: 'Nandi', value: 'Nandi' },
        { label: 'Kericho', value: 'Kericho' },
        { label: 'Kiambu', value: 'Kiambu' },
        { label: 'Murang\'a', value: 'Murang\'a' },
        { label: 'Vihiga', value: 'Vihiga' },
        { label: 'Lamu', value: 'Lamu' },
        { label: 'Taita Taveta', value: 'Taita Taveta' },
        { label: 'Kilifi', value: 'Kilifi' },
    ];

    useEffect(() => {
        if (!resourceDetails) {
            const fetchResource = async () => {
                setLoading(true);
                try {
                    const response = await api.get(`/learning-resources/${resourceId}`, {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    });
                    const data = response.data;
                    setResource(data);
                    setItemName(data.item_name);
                    setItemCategories(data.item_category);
                    setCounties(data.county);
                    setItemPrice(data.item_price.toString());
                    setContactPhone(data.contact_phone.toString());
                    setContactEmail(data.contact_email);
                    setWhatsappNumber(data.whatsapp_number.toString());
                    setDescription(data.description || '');
                } catch (error) {
                    console.error(error);
                    Alert.alert('Error fetching resource data');
                } finally {
                    setLoading(false);
                }
            };
            fetchResource();
        }
    }, [resourceId, resourceDetails, userToken]);

    const validateInputs = () => {
        if (!itemName || !itemCategories.length || !counties.length || !itemPrice || !contactPhone || !contactEmail) {
            Alert.alert('Please fill all fields.');
            return false;
        }
        if (isNaN(itemPrice) || isNaN(contactPhone) || isNaN(whatsappNumber)) {
            Alert.alert('Price and Phone number must be numeric.');
            return false;
        }
        return true;
    };

    const handleUpdate = async () => {
        if (!validateInputs()) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('item_name', itemName);
        formData.append('item_category', JSON.stringify(itemCategories));
        formData.append('county', JSON.stringify(counties));
        formData.append('item_price', itemPrice);
        formData.append('contact_phone', contactPhone);
        formData.append('contact_email', contactEmail);
        formData.append('whatsapp_number', whatsappNumber);
        formData.append('description', description);

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
                    Authorization: `Bearer ${authToken}`,
                },
            });
            Alert.alert('Resource updated successfully');
            navigation.goBack();
        } catch (error) {
            if (error.response) {
                console.error("Error response data:", error.response.data);
                Alert.alert('Error updating resource', error.response.data.message || 'Unknown error');
            } else {
                console.error(error);
                Alert.alert('Error updating resource');
            }
        } finally {
            setLoading(false);
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
            setItemImages(result.selected || [result]);
        }
    };

    return (
        <View style={styles.container}>
            <Navbar />
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Sell on Tbooke</Text>
                    <ScrollView style={styles.scrollableCardContent}>
                        <View style={styles.formGroup}>
                            <TextInput
                                style={styles.input}
                                placeholder="Item Name"
                                value={itemName}
                                onChangeText={setItemName}
                            />

                            <RNPickerSelect
                                placeholder={{ label: 'Select category', value: null }}
                                items={categoryOptions}
                                onValueChange={setItemCategories}
                                value={itemCategories}
                                style={pickerSelectStyles}
                            />

                            <RNPickerSelect
                                placeholder={{ label: 'Select county', value: null }}
                                items={countyOptions}
                                onValueChange={setCounties}
                                value={counties}
                                style={pickerSelectStyles}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Item Price"
                                keyboardType="numeric"
                                value={itemPrice}
                                onChangeText={setItemPrice}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Whatsapp Number"
                                keyboardType="phone-pad"
                                value={whatsappNumber}
                                onChangeText={setWhatsappNumber}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Contact Email"
                                keyboardType="email-address"
                                value={contactEmail}
                                onChangeText={setContactEmail}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Contact Phone"
                                keyboardType="phone-pad"
                                value={contactPhone}
                                onChangeText={setContactPhone}
                            />

                            <TouchableOpacity style={styles.imagePicker} onPress={pickThumbnail}>
                                <Text style={styles.imagePickerText}>
                                    {itemThumbnail ? 'Change Thumbnail Image' : 'Pick Thumbnail Image'}
                                </Text>
                            </TouchableOpacity>
                            {itemThumbnail && <Image source={{ uri: itemThumbnail.uri }} style={styles.imagePreview} />}

                            <TouchableOpacity style={styles.imagePicker} onPress={pickImages}>
                                <Text style={styles.imagePickerText}>
                                    {itemImages.length > 0 ? 'Change Item Images' : 'Pick Item Images'}
                                </Text>
                            </TouchableOpacity>
                            {itemImages.length > 0 && (
                                <ScrollView horizontal style={styles.imagesPreviewContainer}>
                                    {itemImages.map((img, index) => (
                                        <Image key={index} source={{ uri: img.uri }} style={styles.imagePreview} />
                                    ))}
                                </ScrollView>
                            )}

                            <TextInput
                                style={[styles.input, { height: 100 }]}
                                placeholder="Description"
                                multiline
                                value={description}
                                onChangeText={setDescription}
                            />

                            <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
                                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Update Resource</Text>}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    contentContainer: { alignItems: 'center', padding: 20 },
    card: { backgroundColor: '#FFF', borderRadius: 10, padding: 20, width: '100%', elevation: 3 },
    cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 20 },
    formGroup: { marginBottom: 15 },
    input: { borderWidth: 1, borderColor: '#DDD', padding: 10, borderRadius: 5, marginBottom: 10, fontSize: 16 },
    submitButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 5, alignItems: 'center' },
    submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    imagePicker: { alignItems: 'center', padding: 10, backgroundColor: '#DDD', borderRadius: 5, marginVertical: 10 },
    imagePickerText: { color: '#333', fontSize: 16 },
    imagePreview: { width: 100, height: 100, marginRight: 10, borderRadius: 5 },
    imagesPreviewContainer: { flexDirection: 'row', marginTop: 10 },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: { fontSize: 16, paddingVertical: 12, paddingHorizontal: 10, borderWidth: 1, borderColor: '#DDD', borderRadius: 4, color: '#333', marginBottom: 10 },
    inputAndroid: { fontSize: 16, paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1, borderColor: '#DDD', borderRadius: 4, color: '#333', marginBottom: 10 },
});

export default EditResource;
