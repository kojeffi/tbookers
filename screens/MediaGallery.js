// import React from 'react';
// import { View, Text, StyleSheet, Dimensions } from 'react-native';
// import ImageViewing from 'react-native-image-viewing';
// import Video from 'react-native-video';

// const { width, height } = Dimensions.get('window');

// const MediaGallery = ({ route, navigation }) => {
//   const { mediaArray, postId } = route.params;

//   // Prepare images for ImageViewing
//   const images = mediaArray.map((media) => ({
//     uri: `https://tbooke.net/storage/${media}`,
//   }));

//   return (
//     <ImageViewing
//       images={images}
//       imageIndex={0}
//       visible={true}
//       onRequestClose={() => navigation.goBack()}
//       FooterComponent={({ imageIndex }) => {
//         const media = mediaArray[imageIndex];
//         const extension = media.split('.').pop().toLowerCase();
//         if (['mp4', 'mov', 'avi', 'wmv'].includes(extension)) {
//           return (
//             <Video
//               source={{ uri: `https://tbooke.net/storage/${media}` }}
//               style={styles.video}
//               controls
//               resizeMode="contain"
//             />
//           );
//         }
//         return null;
//       }}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   video: {
//     width: width,
//     height: height * 0.4,
//     backgroundColor: '#000',
//   },
// });

// export default MediaGallery;
