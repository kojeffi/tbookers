import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

const Footer = () => {
  return (
    <View style={styles.footer}>
      {/* First Row: Support Links */}
      <View style={styles.footerRow}>
        <TouchableOpacity onPress={() => Linking.openURL('#')}>
          <Text style={styles.footerLink}>Support</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('#')}>
          <Text style={styles.footerLink}>Help Center</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('#')}>
          <Text style={styles.footerLink}>Privacy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('#')}>
          <Text style={styles.footerLink}>Terms</Text>
        </TouchableOpacity>
      </View>

      {/* Second Row: Copyright Info */}
      <View style={styles.copyrightRow}>
        <Text style={styles.footerText}>
          <Text style={styles.bold}>Tbooke</Text> - 
          <Text style={styles.footerLink} onPress={() => Linking.openURL('#')}>
            <Text style={styles.bold}>Copyright 2024</Text>
          </Text> &copy;
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#f8f9fa', // light background color
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#e7e7e7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around', // space between links
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 5, // added padding for better spacing
  },
  copyrightRow: {
    flexDirection: 'row',
    justifyContent: 'center', // center the copyright text
    width: '100%',
    paddingVertical: 5, // added padding for better spacing
  },
  footerText: {
    color: '#6c757d',
    fontSize: 14,
  },
  footerLink: {
    color: '#007bff',
    textDecorationLine: 'underline',
    marginHorizontal: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default Footer;
