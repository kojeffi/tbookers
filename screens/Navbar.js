

import React, { useState, useContext } from 'react';  
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { AuthContext } from './AuthContext';

const Navbar = () => {
  const { authToken, notificationCount, profileData } = useContext(AuthContext); // Use profileData instead of user
  const navigation = useNavigation();
  const route = useRoute(); // Get the current route
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      setSearchQuery('');
    }
  };

  const isActive = (screen) => route.name === screen;

  return (
    <View style={styles.navbar}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.collapseIcon}>
          <Icon name="menu" size={30} color="#333" />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#333"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={handleSearchSubmit} style={styles.searchButton}>
            <Icon name="search" size={20} color="#008080" />
          </TouchableOpacity>
        </View>

        <View style={styles.iconContainer}>
          {authToken && (
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <Icon name="bell" size={24} color="#333" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>
                  {notificationCount > 0 ? notificationCount : '0'}
                </Text>
              </View>
            </TouchableOpacity>
          )}

        <TouchableOpacity onPress={() => navigation.navigate('Post')}>
          <Image source={require('./../assets/images/splash.png')} style={styles.profileImage} />
        </TouchableOpacity>
        
          <TouchableOpacity onPress={() => navigation.navigate('Messages')} style={styles.settingsIcon}>
            <Icon name="mail" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Post')}
          style={[styles.navItem, isActive('Post') && styles.activeNavItem]}>
          <Icon name="home" size={24} color={isActive('Post') ? '#008080' : '#333'} />
          <Text style={[styles.navText, isActive('Post') && styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('TbookeLearning')}
          style={[styles.navItem, isActive('TbookeLearning') && styles.activeNavItem]}>
          <Icon name="book" size={24} color={isActive('TbookeLearning') ? '#008080' : '#333'} />
          <Text style={[styles.navText, isActive('TbookeLearning') && styles.activeNavText]}>
            T.Learning
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('LearningResources')}
          style={[styles.navItem, isActive('LearningResources') && styles.activeNavItem]}>
          <Icon name="shopping-cart" size={24} color={isActive('LearningResources') ? '#008080' : '#333'} />
          <Text style={[styles.navText, isActive('LearningResources') && styles.activeNavText]}>
            T.Marketplace
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Groups')}
          style={[styles.navItem, isActive('Groups') && styles.activeNavItem]}>
          <Icon name="users" size={24} color={isActive('Groups') ? '#008080' : '#333'} />
          <Text style={[styles.navText, isActive('Groups') && styles.activeNavText]}>T.Groups</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('SchoolsCorner')}
          style={[styles.navItem, isActive('SchoolsCorner') && styles.activeNavItem]}>
          <Icon name="book-open" size={24} color={isActive('SchoolsCorner') ? '#008080' : '#333'} />
          <Text style={[styles.navText, isActive('SchoolsCorner') && styles.activeNavText]}>Schools</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}>
        <View style={styles.menuContainer}>
          <View style={styles.menuContent}>
            <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.closeButton}>
              <Icon name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>

            <ScrollView style={styles.menuItems}>
              {/* Logo with background color #008080 */}
              <TouchableOpacity onPress={() => navigation.navigate('Post')} style={[styles.logoContainer, { backgroundColor: '#008080' }]}>
                <Image
                  source={require('./../assets/images/tboke.jpg')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
                {/* <Text style={styles.textLogo}>Tbooke</Text> */}
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  navigation.navigate('Home');
                  setMenuVisible(false);
                }}>
                <Icon name="grid" size={20} color="#fff" style={styles.menuIcon} />
                <Text style={styles.menuText}>Dashboard</Text>
              </TouchableOpacity> */}
                   <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  navigation.navigate('Post');
                  handleMenuClose();
                }}>
                <Icon name="edit-2" size={20} color="#333" style={styles.menuIcon} />
                <Text style={styles.menuText}>Posts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('Profile'); handleMenuClose(); }}>
                <Icon name="user" size={20} color="#333" style={styles.menuIcon} />
                <Text style={styles.menuText}>Profile</Text>
              </TouchableOpacity>
                <TouchableOpacity 
                style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  padding: 3, 
                }} 
                onPress={() => { 
                  navigation.navigate('LiveClasses'); 
                  handleMenuClose(); 
                }}
              >
                <Icon 
                  name="video" 
                  size={20} 
                  color="red"   // Icon is red
                  style={{ marginRight: 10 }} 
                />
                <Text 
                  style={{ 
                    fontSize: 16, 
                    color: 'red'  // Text is also red
                  }}
                >
                  Live Classes
                </Text>
              </TouchableOpacity>

           
              <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('Messages'); handleMenuClose(); }}>
                <Icon name="mail" size={20} color="#333" style={styles.menuIcon} />
                <Text style={styles.menuText}>Messages</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('Settings'); handleMenuClose(); }}>
                <Icon name="settings" size={20} color="#333" style={styles.menuIcon} />
                <Text style={styles.menuText}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('Login'); handleMenuClose(); }}>
                <Icon name="log-out" size={20} color="#333" style={styles.menuIcon} />
                <Text style={styles.menuText}>Logout</Text>
              </TouchableOpacity>
              
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 30,
    paddingHorizontal: 10,
    width: '100%',
    position: 'relative',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 3,
  },
  textLogo: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 26,
    fontStyle: 'italic',
    transform: [{ skewX: '-10deg' }],
    textShadowColor: 'rgba(0, 0, 0, 0.95)',
    textShadowOffset: { width: 1, height: 0 },
    textShadowRadius: 1,
    marginHorizontal: -20,
  },
  collapseIcon: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    width: '50%',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  searchButton: {
    position: 'absolute',
    right: 10,
    padding: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#f00',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginLeft: 20,
  },
  settingsIcon: {
    marginLeft: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderColor: '#008080',
  },
  navText: {
    fontSize: 12,
    color: '#333',
  },
  activeNavText: {
    color: '#008080',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#008080', // Background color set to #008080
  },
  menuContent: {
    backgroundColor: '#008080', // Modal background is #008080
    width: '100%',
    height: '100%', // Full screen height
    padding: 20,
    justifyContent: 'flex-start',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  menuItems: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 18,
    color: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
    flexDirection: 'row',
  },
  logoImage: {
    width: 150,
    height: 80,
    marginHorizontal: 100,
  },
});

export default Navbar;