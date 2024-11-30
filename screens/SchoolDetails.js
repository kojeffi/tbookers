import React, { useContext, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Navbar from './Navbar';
import api from './api';
import { AuthContext } from './AuthContext';

const SchoolScreen = () => {
  const { profileData, loading, notificationCount, error } = useContext(AuthContext);

  useEffect(() => {
    // Add any data fetching here if necessary
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Navbar />
      <View style={styles.header}>
        <Text style={styles.schoolName}>{profileData?.school?.name}</Text>
        {profileData?.school?.thumbnail && (
          <Image
            source={{ uri: `http://192.168.12.117:8000/storage/${profileData.school.thumbnail}` }}
            style={styles.schoolLogo}
          />
        )}
      </View>

      {/* Programs and Courses */}
      <Section title="Programs and Courses">
        <Card title="STEM Program" text="Comprehensive science, technology, engineering..." />
        <Card title="Arts Program" text="Extensive arts program including visual arts, music, and theater." />
        <Card title="Sports Program" text="Wide range of sports activities and teams to join." />
      </Section>

      {/* Student and Parent Resources */}
      <Section title="Student and Parent Resources">
        <Card title="Homework Help" text="Resources and tools to help students with their homework." />
        <Card title="Parent Portal" text="Information and resources for parents to support their children..." />
        <Card title="Counseling Services" text="Support services for students’ mental and emotional well-being." />
      </Section>

      {/* News and Events */}
      <Section title="News and Events">
        <Event title="Annual Science Fair" date="March 20, 2024" text="Join us for the annual science fair showcasing student projects." />
        <Event title="Spring Concert" date="April 10, 2024" text="Enjoy performances by our talented students at the spring concert." />
        <Event title="Parent-Teacher Meetings" date="May 5, 2024" text="Schedule your meetings with teachers to discuss student progress." />
      </Section>
    </ScrollView>
  );
};

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const Card = ({ title, text }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardText}>{text}</Text>
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Learn More</Text>
    </TouchableOpacity>
  </View>
);

const Event = ({ title, date, text }) => (
  <View style={styles.event}>
    <Text style={styles.eventTitle}>{title}</Text>
    <Text style={styles.eventText}>{text}</Text>
    <Text style={styles.eventDate}>{date}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  schoolName: { fontSize: 24, fontWeight: 'bold' },
  schoolLogo: { width: 60, height: 60, borderRadius: 30 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  sectionContent: { flexDirection: 'row', flexWrap: 'wrap' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, width: '48%', margin: '1%' },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardText: { marginBottom: 10 },
  button: { borderWidth: 1, borderColor: '#007bff', padding: 10, borderRadius: 5 },
  buttonText: { color: '#007bff', textAlign: 'center' },
  event: { backgroundColor: '#f8f9fa', padding: 15, borderRadius: 5, marginBottom: 10 },
  eventTitle: { fontSize: 16, fontWeight: 'bold' },
  eventText: { marginBottom: 5 },
  eventDate: { fontSize: 12, color: '#6c757d' },
});

export default SchoolScreen;
