import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
// import { WebView } from 'react-native-webview';
import Navbar from './Navbar';
import api from './api';
import { AuthContext } from './AuthContext';

const ShowLive = ({ route, navigation }) => {
  const { liveClassSlug } = route.params;
  const { authToken, userId, profileData, loading: authLoading } = useContext(AuthContext);
  
  const [liveClass, setLiveClass] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const METERED_DOMAIN = 'tbooke.metered.live'; // Use the provided metered domain

  useEffect(() => {
    const fetchLiveClass = async () => {
      if (authLoading) return; // Avoid fetching if auth is still loading

      try {
        const response = await api.get(`/live-classes/${liveClassSlug}`, {
          headers: { Authorization: `Bearer ${authToken}` }, // Include token for authentication
        });
        console.log('LiveClass Response:', response.data);
        setLiveClass(response.data);
      } catch (error) {
        console.error('Error fetching live class:', error.response ? error.response.data : error.message);
        Alert.alert('Error', 'Failed to fetch live class details.');
      } finally {
        setLoading(false);
      }
    };

    fetchLiveClass();
  }, [liveClassSlug, authLoading, authToken]); // Added authToken to dependencies

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  if (!liveClass) {
    return (
      <View style={styles.container}>
        <Navbar navigation={navigation} />
        <View style={styles.mainContent}>
          <Text style={styles.errorText}>Failed to load class details.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
      <ScrollView contentContainerStyle={styles.mainContent}>
        <Text style={styles.title}>{liveClass.class_name}</Text>
        <Text style={styles.subtitle}>By {liveClass.creator_name}</Text>
        <Text style={styles.description}>{liveClass.class_description}</Text>
        {liveClass.video_room_name ? (
          <WebView
            source={{ uri: `https://${METERED_DOMAIN}/${liveClass.video_room_name}` }}
            style={styles.webview}
            allowsInlineMediaPlayback
            javaScriptEnabled
            mediaPlaybackRequiresUserAction={false}
            startInLoadingState={true}
            renderLoading={() => <ActivityIndicator size="large" color="#008080" style={styles.webviewLoader} />}
          />
        ) : (
          <Text style={styles.noStream}>No stream available for this class.</Text>
        )}
      </ScrollView>
    </View>
  );
};

// Enhanced Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f3',
  },
  mainContent: {
    padding: 16,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  webview: {
    width: '100%',
    height: 400, // Adjusted height for better responsiveness
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },
  webviewLoader: {
    flex: 1,
    justifyContent: 'center',
  },
  noStream: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ShowLive;
