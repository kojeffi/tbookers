import React, { useContext, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthContext } from './AuthContext'; // Import the AuthContext
import { useNavigation } from '@react-navigation/native';

const UserProfile = () => {
  const navigation = useNavigation();
  const { profileData, loading, error } = useContext(AuthContext);

  // Debug: Log profileData to ensure it contains the correct data
  useEffect(() => {
    if (profileData) {
      console.log('Profile data:', profileData);
      if (profileData.user && profileData.user.profile_picture) {
        console.log('Profile picture URL:', `https://tbooke.net/storage/${profileData.user.profile_picture}`);
      } else {
        console.log('No profile picture available.');
      }
    } else {
      console.log('No profile data available.');
    }
  }, [profileData]);

  // Navigate to user profile on press
  const navigateToProfile = (user) => {
    navigation.navigate('UserProfile', { user });
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        {profileData ? (
          <TouchableOpacity onPress={() => navigateToProfile(profileData)}>
            <Image
              source={
                profileData.user && profileData.user.profile_picture
                  ? { uri: `https://tbooke.net/storage/${profileData.user.profile_picture}` }
                  : require('./../assets/images/avatar.png')
              }
              style={styles.avatar}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ) : (
          <Image
            source={require('./../assets/images/avatar.png')}
            style={styles.avatar}
            resizeMode="cover"
          />
        )}
        <View style={styles.infoSection}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreatePost')}>
            <Text style={styles.buttonText}>Share Your Thoughts</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && <ActivityIndicator size="large" color="#456" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderTopColor: '#008080',
    borderTopWidth: 1,
    paddingHorizontal: 0,
    paddingVertical:1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderColor: '#008080',
    borderWidth: 2,
  },
  infoSection: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#008080',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default UserProfile;
