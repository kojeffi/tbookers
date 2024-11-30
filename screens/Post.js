import React, { useContext } from 'react';    
import { View, ScrollView,StyleSheet } from 'react-native';
import { AuthContext } from './AuthContext';
import Navbar from './Navbar';
import UserProfile from './UserProfile';
import ActivityFeed from './PostItem';
import Feed from './Feed';

import PostDetail from './PostDetail';

const Post = ({ navigation }) => {
  const { authToken } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <Navbar navigation={navigation} />
      <ScrollView>
        <UserProfile />
        {/* <PostDetail /> */}
        <Feed />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Post;
