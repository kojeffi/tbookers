import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from './Navbar'; // Import the Navbar component
import Footer from './Footer'; // Adjust path as needed

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Navbar */}
      <Navbar navigation={navigation} />

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>

        {/* Buttons Row */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Post')}>
            <Text style={styles.loginButtonText}>Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButtonT} onPress={() => navigation.navigate('Dashboard')}>
            <Text style={styles.loginButtonText}>Dashboard</Text>
          </TouchableOpacity>
        </View>
        {/* Tbooke Learning */}
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: '#E75480' }]} // Different background color
          onPress={() => navigation.navigate('TbookeLearning')}
        >
          <View style={styles.cardHeader}>
            <Icon name="book" size={30} color="#fff" style={styles.icon} />
            <Text style={styles.cardTitle}>Tbooke Learning</Text>
            <Text style={styles.cardText}>Explore Tbooke Learning, your hub for diverse educational content, interactive lessons, and meaningful connections with learners and educators.</Text>
          </View>
        </TouchableOpacity>

        {/* Learning Resources */}
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: '#800000' }]} // Different background color
          onPress={() => navigation.navigate('LearningResources')}
        >
          <View style={styles.cardHeader}>
            <Icon name="archive" size={30} color="#fff" style={styles.icon} />
            <Text style={styles.cardTitle}>Learning Resources</Text>
            <Text style={styles.cardText}>Discover a variety of educational tools and resources at Tbooke Shop. Enhance your skills and knowledge with resources designed to support your learning journey.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Schools Corner */}
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: '#008080' }]} // Different background color
          onPress={() => navigation.navigate('SchoolsCorner')}
        >
          <View style={styles.cardHeader}>
            <Icon name="graduation-cap" size={30} color="#fff" style={styles.icon} />
            <Text style={styles.cardTitle}>Schools Corner</Text>
            <Text style={styles.cardText}>Explore Schools Corner at Tbooke, dedicated pages for educational institutions to create and share content, fostering collaboration and innovation.</Text>
          </View>
        </TouchableOpacity>

        {/* Tbooke Blueboard */}
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: '#30D5C8' }]} // Different background color
          onPress={() => navigation.navigate('TbookeBlueboard')}
        >
          <View style={styles.cardHeader}>
            <Icon name="bullhorn" size={30} color="#fff" style={styles.icon} />
            <Text style={styles.cardTitle}>Tbooke Blueboard</Text>
            <Text style={styles.cardText}>Discover Tbooke's Blueboard, a moderated platform for education-related communications and announcements, connecting educators and learners.
            </Text>
          </View>
        </TouchableOpacity>
        < Footer />
      </ScrollView>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  content: {
    padding: 20,
  },
  buttonRow: {
    flexDirection: 'row', // Align buttons horizontally
    justifyContent: 'space-between', // Distribute buttons evenly
    marginBottom: 20, // Add space below the buttons
  },
  loginButton: {
    backgroundColor: '#30D5C8', // Set button color to maroon
    padding: 10,
    borderRadius: 10,
    flex: 1, // Take equal space
    marginHorizontal: 5, // Space between buttons
  },
  loginButtonT: {
    backgroundColor: '#008567', // Set button color to maroon
    padding: 10,
    borderRadius: 10,
    flex: 1, // Take equal space
    marginHorizontal: 5, // Space between buttons
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  card: {
    width: '100%',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    backgroundColor: '#008080',
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
});

export default Home;
