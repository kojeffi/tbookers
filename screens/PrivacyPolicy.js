import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Linking } from 'react-native';

const PrivacyPolicy = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.content}>

      {/* Logo and Navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('./../assets/images/tbooke-logo.png')} style={styles.logo} />
        </TouchableOpacity>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.button}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Privacy Policy Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Privacy Policy for Tbooke</Text>
        <Text style={styles.paragraph}>
          At Tbooke, we are committed to protecting your personal information and ensuring that your privacy is safeguarded. This Privacy Policy outlines how we collect, use, and protect the data you provide when using our platform.
        </Text>

        <Text style={styles.subTitle}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>When signing up for Tbooke, we collect personal details such as:</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Name</Text>
          <Text style={styles.listItem}>• Email address</Text>
          <Text style={styles.listItem}>• Username</Text>
          <Text style={styles.listItem}>• Educational background and preferences (optional)</Text>
        </View>
        <Text style={styles.paragraph}>
          We may also collect non-personal data like device information, browser type, and usage statistics to enhance your experience.
        </Text>

        <Text style={styles.subTitle}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>Your personal data is used for the following purposes:</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Providing access to the platform and its features.</Text>
          <Text style={styles.listItem}>• Personalizing your experience with relevant content and recommendations.</Text>
          <Text style={styles.listItem}>• Communicating updates, new features, and educational resources.</Text>
          <Text style={styles.listItem}>• Improving the platform through data analysis and feedback.</Text>
        </View>
        <Text style={styles.paragraph}>
          We do not sell or share your personal information with third parties for marketing purposes.
        </Text>

        <Text style={styles.subTitle}>3. Data Security</Text>
        <Text style={styles.paragraph}>
          We implement robust security measures, including encryption, to protect your data from unauthorized access or misuse. While we strive to ensure the safety of your data, no online platform can guarantee 100% security.
        </Text>

        <Text style={styles.subTitle}>4. User Control</Text>
        <Text style={styles.paragraph}>
          You have control over your personal information. You can update, correct, or delete your account details by accessing your profile settings. If you wish to delete your account, please contact our support team.
        </Text>

        <Text style={styles.subTitle}>5. Third-Party Links</Text>
        <Text style={styles.paragraph}>
          Tbooke may contain links to external websites. Please note that we are not responsible for the privacy policies or content of these third-party sites.
        </Text>

        <Text style={styles.subTitle}>6. Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy periodically. If significant changes are made, we will notify you via email or a prominent notice on our platform.
        </Text>

        <Text style={styles.subTitle}>7. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this Privacy Policy, feel free to reach us at{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('mailto:privacy@tbooke.net')}>privacy@tbooke.net</Text>.
        </Text>

        <Text style={styles.paragraph}>By signing up on Tbooke, you agree to this Privacy Policy.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    marginLeft: 8,
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    marginVertical: 8,
    lineHeight: 24,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
  },
  list: {
    marginLeft: 16,
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});

export default PrivacyPolicy;
