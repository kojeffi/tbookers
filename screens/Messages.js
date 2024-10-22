// screens/Messages.js
import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Image, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import api from './api';
import { AuthContext } from './AuthContext';

const Messages = ({ route }) => {
    const { userId, userName } = route.params;
    const [recipient, setRecipient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messageContent, setMessageContent] = useState('');
    const flatListRef = useRef(null);

    const { authToken } = useContext(AuthContext);

    useEffect(() => {
        fetchRecipient();
        fetchMessages();
    }, []);

    const fetchRecipient = async () => {
        try {
            const response = await api.get(`/users/${userId}`); // Adjust the endpoint as needed
            setRecipient(response.data);
        } catch (error) {
            console.error('Error fetching recipient:', error);
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await api.get(`/messages/${userId}`); // Adjust the endpoint as needed
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (messageContent.trim() === '') return;

        try {
            const payload = {
                receiver_id: userId,
                content: messageContent,
            };
            const response = await api.post('/messages', payload); // Adjust the endpoint as needed
            setMessages([...messages, response.data]);
            setMessageContent('');
            // Optionally, scroll to the bottom
            flatListRef.current.scrollToEnd({ animated: true });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const renderMessage = ({ item }) => {
        const isSender = item.sender_id === parseInt(authToken); // Adjust according to your authToken structure
        return (
            <View style={[styles.messageContainer, isSender ? styles.sender : styles.receiver]}>
                <View style={styles.messageBubble}>
                    <Text style={styles.messageText}>{item.content}</Text>
                    <Text style={styles.timestamp}>{new Date(item.created_at).toLocaleString()}</Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!recipient) {
        return (
            <View style={styles.center}>
                <Text>Select a user to view messages</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={90}
        >
            <View style={styles.header}>
                <Image
                    source={recipient.profile_picture ? { uri: recipient.profile_picture_url } : require('./../assets/images/avatar.png')}
                    style={styles.profileImage}
                />
                <View>
                    <Text style={styles.userName}>{recipient.first_name} {recipient.surname}</Text>
                    <Text style={styles.profileType}>{recipient.profile_type}</Text>
                </View>
            </View>
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderMessage}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Type your message..."
                    multiline
                    value={messageContent}
                    onChangeText={setMessageContent}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    profileType: {
        color: 'gray',
        fontSize: 14,
        textTransform: 'capitalize',
    },
    messagesList: {
        padding: 10,
        flexGrow: 1,
    },
    messageContainer: {
        marginVertical: 5,
        flexDirection: 'row',
    },
    sender: {
        justifyContent: 'flex-end',
    },
    receiver: {
        justifyContent: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
    },
    messageText: {
        fontSize: 16,
    },
    timestamp: {
        fontSize: 10,
        color: 'gray',
        textAlign: 'right',
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Messages;
