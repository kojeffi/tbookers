



import React, { useContext } from 'react';    
import { View, ScrollView,StyleSheet } from 'react-native';
import { AuthContext } from './AuthContext';
import Navbar from './Navbar';
import UserProfile from './UserProfile';
import ActivityFeed from './PostItem';
import Feed from './Feed';

const Post = ({ navigation }) => {
  const { authToken } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <Navbar navigation={navigation} />
      <ScrollView>
        <UserProfile />
        <Feed />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Add any additional styles you need for the container
  },
});

export default Post;
