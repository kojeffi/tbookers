import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Dimensions, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const Navbar = ({ notificationCount }) => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenuClose = () => setMenuVisible(false);
  const handleDropdownToggle = () => setDropdownVisible(!dropdownVisible);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      setSearchQuery('');
    }
  };

  return (
    <View style={styles.navbar}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.logoContainer}>
          <Image source={require('./../assets/images/splash.png')} style={styles.logoImage} resizeMode="contain" />
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
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Icon name="bell" size={24} color="#008080" />
            {notificationCount > 0 && (
              <View style={[styles.badge, styles.badgeNotification]}>
                <Text style={styles.badgeText}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setMenuVisible(true)} 
            style={[styles.collapseIcon, styles.pillBackground]}
          >
            <Icon name="ellipsis-h" size={24} color="#008080" />
          </TouchableOpacity>

        </View>
      </View>

      <View style={styles.bottomRow}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navItem}>
          <Icon name="home" size={24} color="#008080" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('TbookeLearning')} style={styles.navItem}>
          <Icon name="book" size={24} color="#008080" />
          <Text style={styles.navText}>T.Learning</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('LearningResources')} style={styles.navItem}>
          <Icon name="shopping-cart" size={24} color="#008080" />
          <Text style={styles.navText}>T.Resources</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Groups')} style={styles.navItem}>
          <Icon name="users" size={24} color="#008080" />
          <Text style={styles.navText}>T.Groups</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Modal */}
      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="slide"
        onRequestClose={handleMenuClose}
      >
        <View style={styles.menuContainer}>
          <View style={styles.menuContent}>
            <TouchableOpacity onPress={handleMenuClose} style={styles.closeButton}>
              <Icon name="arrow-left" size={24} color="#008080" />
            </TouchableOpacity>

            <ScrollView style={styles.menuItems}>
              <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('Home'); handleMenuClose(); }}>
                <Icon name="dashboard" size={20} color="#008080" style={styles.menuIcon} />
                <Text style={styles.menuText}>Dashboard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('Post'); handleMenuClose(); }}>
                <Icon name="edit" size={20} color="#008080" style={styles.menuIcon} />
                <Text style={styles.menuText}>Posts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('Groups'); handleMenuClose(); }}>
                <Icon name="users" size={20} color="#008080" style={styles.menuIcon} />
                <Text style={styles.menuText}>Groups</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('Profile'); handleMenuClose(); }}>
                <Icon name="user" size={20} color="#008080" style={styles.menuIcon} />
                <Text style={styles.menuText}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('LiveClasses'); handleMenuClose(); }}>
                <Icon name="video-camera" size={20} color="#008080" style={styles.menuIcon} />
                <Text style={styles.menuText}>Live Classes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('Settings'); handleMenuClose(); }}>
                <Icon name="cogs" size={20} color="#008080" style={styles.menuIcon} />
                <Text style={styles.menuText}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('Messages'); handleMenuClose(); }}>
                <Icon name="envelope" size={20} color="#008080" style={styles.menuIcon} />
                <Text style={styles.menuText}>Messages</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('Login'); handleMenuClose(); }}>
                <Icon name="sign-out" size={20} color="#008080" style={styles.menuIcon} />
                <Text style={styles.menuText}>Logout</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  navbar: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'column',
  },
  logoContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 30,
    height: 30,
    borderRadius: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    color: '#333',
  },
  searchButton: {
    paddingHorizontal: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  collapseIcon: {
    marginLeft: 10,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  badgeNotification: {
    backgroundColor: '#FF6347',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  navItem: {
    alignItems: 'center',
    padding: 5,
  },
  navText: {
    color: '#333',
    fontSize: 12,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent background
  },
  menuContent: {
    backgroundColor: '#fff',
    padding: 20,
    width: '100%',
    height: '100%', // Occupies the entire screen
    justifyContent: 'flex-start',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 1,
  },
  menuItems: {
    marginTop: 60, // To provide space for the close button
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    color: '#008080',
    fontSize: 18,
  },
  //ellipses
  collapseIcon: {
    marginLeft: 10,
    padding: 10, // Adding padding to create a better pill effect
  },
  pillBackground: {
    backgroundColor: '#f5f5f5', // Light background color #e0f7fa
    borderRadius: 10, // Rounded corners for pill shape
    paddingHorizontal: 10, // Padding for horizontal space
    paddingVertical: 5, // Padding for vertical space
    alignItems: 'center', // Centering the icon within the pill
    justifyContent: 'center', // Centering the icon within the pill
  },
});

export default Navbar;
