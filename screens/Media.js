import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import Video from 'react-native-video'; // Ensure you have react-native-video installed

const Media = ({ media, postId }) => {
    const extension = media.split('.').pop().toLowerCase();
    const isImage = ['jpeg', 'jpg', 'png', 'gif', 'PNG'].includes(extension);
    const isVideo = ['mp4', 'mov', 'avi', 'wmv'].includes(extension);

    const [modalVisible, setModalVisible] = React.useState(false);

    const handlePress = () => {
        if (isImage) {
            setModalVisible(true);
        }
        // Handle video playback if needed
    };

    return (
        <View style={styles.mediaItem}>
            {isImage ? (
                <>
                    <TouchableOpacity onPress={handlePress}>
                        <Image
                            source={{ uri: `http://192.168.12.117:8000/storage/${media}` }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                    <Modal visible={modalVisible} transparent={true}>
                        <TouchableOpacity style={styles.modalBackground} onPress={() => setModalVisible(false)}>
                            <Image
                                source={{ uri: `http://192.168.12.117:8000/storage/${media}` }}
                                style={styles.fullImage}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </Modal>
                </>
            ) : isVideo ? (
                <Video
                    source={{ uri: `http://192.168.12.117:8000/storage/${media}` }}
                    style={styles.video}
                    controls
                    resizeMode="cover"
                />
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    mediaItem: {
        width: Dimensions.get('window').width / 3 - 10,
        height: 100,
        margin: 5,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    },
    video: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: '90%',
        height: '80%',
    },
});

export default Media;
