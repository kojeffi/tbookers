import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Footer from './Footer';  // Import your Navbar component


const About = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('./../assets/images/tbooke-logo.png')} style={styles.logo} />
        </TouchableOpacity>
        <View style={styles.headerButtons}>
  <TouchableOpacity style={styles.maroonButton} onPress={() => navigation.navigate('Login')}>
    <Text style={styles.buttonText}>Login</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.maroonButton} onPress={() => navigation.navigate('Register')}>
    <Text style={styles.buttonText}>Register</Text>
  </TouchableOpacity>
</View>

      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* About Tbooke */}
        <View style={styles.section}>
          <Text style={styles.heading}>About Tbooke</Text>
          <Text style={styles.paragraph}>
          Tbooke media introduces a new era of professional engagement, networking and learning tailored for the education sector.
         </Text>
          <Text style={styles.paragraph}>
          It stands as the premier platform for educational enthusiasts, bridging the gap often found in social media platforms with meaningful conversations that are frequently lost amidst the noise.

          </Text>
          <Text style={styles.paragraph}>
          Tbooke is where education intersects with social networking, challenging and moving beyond the negative perceptions typically associated with mainstream social media platforms. It promises to be a fertile ground for high quality content designed to cater to the needs of educators and learners of all ages.
 
          </Text>
          <Image source={require('./../assets/images/about.jpg')} style={styles.image} />
        </View>

        {/* Learning Resources */}
        <View style={styles.section}>
          <Text style={styles.heading}>Learning Resources</Text>
          <Text style={styles.paragraph}>
            Tbooke creates a one stop shop for all school learning resources for all levels of learning.
          
          </Text>
          <Text style={styles.paragraph}>
            Approved educational resources for both in and out of class requirements from publishers, KICD, etc.
          
          </Text>
          <Text style={styles.paragraph}>
            Listing can be done at a premium.
          </Text>
          <Text style={styles.paragraph}>
            Tbooke.net offers space for educational content creation both in and outside classroom.
          </Text>
          <Text style={styles.paragraph}>
            The platform is a safe space for all ages. Shift through age and Grade relevant super content and LEARN.
          </Text>
          <Text style={styles.paragraph}>
            With Tbooke, homegrown talent for all age groups is shared for edutainment purposes.
          </Text>
          <Image source={require('./../assets/images/learning-resources.png')} style={{ width: '100%', height: 320, marginBottom: 10 }} />
           
        <Text style={styles.paragraph}>
        A dedicated learning segment that allows for content from professional teachers and students
          </Text>
          <Text style={styles.paragraph}>
          Learning materials and media available for users sorted by grade and age
          </Text>
          <Text style={styles.paragraph}>
          Subscribe to access more premium learning content 
          </Text>
          <Text style={styles.paragraph}>
          LIVE learning on school content
          </Text>
            {/* Educational Images */}
        <View style={styles.imageRow}>
          <Image source={require('./../assets/images/cbc.png')} style={styles.circleImage} />
          <Image source={require('./../assets/images/primary.png')} style={styles.circleImage} />
          <Image source={require('./../assets/images/High_school.png')} style={styles.circleImage} />
        </View>
        <View style={styles.imageRow}>
          <Image source={require('./../assets/images/KCSE_Revision.png')} style={styles.circleImage} />
          <Image source={require('./../assets/images/IGCSE.png')} style={styles.circleImage} />
        </View>
        </View>

        {/* Content Creation */}
        <View style={styles.section}>
         
          <View style={styles.textBlock}>
            <Text style={styles.heading}>Content Creation</Text>
            <Text style={styles.paragraph}>
              Tbooke.net offers space for educational content creation both in and outside classroom.
            </Text>
            <Text style={styles.paragraph}>
              The platform is a safe space for all ages. Shift through age and Grade relevant super content and LEARN.
            </Text>
            <Text style={styles.paragraph}>
              With Tbooke, homegrown talent for all age groups is shared for edutainment purposes.
            </Text>
          </View>
          <Image source={require('./../assets/images/content.jpg')} style={{ width: '100%', height: 320, marginBottom: 10 }} />
        </View>

        {/* Tbooke Blueboard */}
        <View style={styles.section}>
          <Text style={styles.heading}>Tbooke Blueboard</Text>
          <Text style={styles.paragraph}>
            A dedicated space for important educational communications, notices and announcements tailored for local and regional needs.
          </Text>
          <Text style={styles.paragraph}>
            It serves as a moderated official channel for delivering verified information directly to the education community while ensuring relevance and authenticity.
          </Text>
          <Image source={require('./../assets/images/blueboard.jpg')} style={{ width: '100%', height: 320, marginBottom: 10 }} />
        </View>

        {/* School's Corner */}
        <View style={styles.section}>
          <View style={styles.textBlock}>
            <Text style={styles.heading}>School's Corner</Text>
            <Text style={styles.paragraph}>
              Tbooke offers a unique platform for educational institutions to run dedicated social media pages for content creation and publicity.
            </Text>
            <Text style={styles.paragraph}>
              The page allows schools to showcase their unique and celebrated potential, achievements, talents and facilities.
            </Text>
          </View>
          <Image source={require('./../assets/images/schoolscorner.jpg')} style={{ width: '100%', height: 320, marginBottom: 10 }} />
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  logo: {
    width: 100,
    height: 50,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    marginHorizontal: 10,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 12,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 150, // Adjusted height to reduce size
    marginBottom: 10,
  },
  circleImage: {
    width: 100, // Reduced width
    height: 100, // Reduced height
    borderRadius: 50, // Adjusted for smaller circle size
    margin: 10,
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  textBlock: {
    marginTop: 10,
  },
  footer: {
    backgroundColor: '#008080',
    padding: 10,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
  },
  maroonButton: {
    backgroundColor: '#800000',  // Maroon color
    paddingVertical: 10,         // Adjust padding for the button
    paddingHorizontal: 20,
    borderRadius: 5,             // Optional: Adds rounded corners
    marginHorizontal: 10,        // Spacing between the buttons
  },
  buttonText: {
    color: '#fff',               // White text for contrast
    fontSize: 14,
    textAlign: 'center',
  },

  //footer
  footer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerColStart: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  footerColEnd: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  footerText: {
    color: '#6c757d',
    fontSize: 14,
  },
  linkText: {
    color: '#007bff',
    fontWeight: 'bold',
    textDecorationLine: 'underline', // To mimic the link style
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  linkText: {
    color: '#6c757d',
    marginLeft: 15,
    textDecorationLine: 'underline',
  },
  
});

export default About;
