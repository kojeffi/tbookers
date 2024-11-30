import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Navbar from './Navbar';
import api from './api';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from './AuthContext';
import { debounce } from 'lodash';

const TbookeLearning = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contents, setContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);
  const [loading, setLoading] = useState(true);

  const { authToken, profileData, loading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    if (authToken) {
      fetchContents();
      const intervalId = setInterval(() => {
        fetchContents();
      }, 10000); // Check for new content every 10 seconds

      return () => clearInterval(intervalId); // Cleanup on unmount
    } else {
      setLoading(false); // No token means no contents to fetch
    }
  }, [authToken]);

  useEffect(() => {
    const debouncedHandleSearch = debounce(() => {
      handleSearch();
    }, 300);

    debouncedHandleSearch();

    return () => {
      debouncedHandleSearch.cancel();
    };
  }, [searchQuery, contents]);

  const fetchContents = async () => {
    try {
      const response = await api.get('/tbooke-learning');
      if (response.data && Array.isArray(response.data.contents)) {
        setContents(response.data.contents);
        setFilteredContents(response.data.contents);
      } else {
        setContents([]);
        setFilteredContents([]);
        Alert.alert('Error', 'Invalid data format received from server.');
      }
      setLoading(false);
    } catch (error) {
      console.error('Fetch Contents Error:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch contents.';
      Alert.alert('Error', errorMessage);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredContents(contents);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = contents.filter((content) => {
        const title = content.content_title
          ? content.content_title.toLowerCase()
          : '';
        const creatorFirstName = content.user?.first_name
          ? content.user.first_name.toLowerCase()
          : '';
        const creatorLastName = content.user?.surname
          ? content.user.surname.toLowerCase()
          : '';
        const categories = content.content_category
          ? content.content_category.toLowerCase()
          : '';

        return (
          title.includes(query) ||
          creatorFirstName.includes(query) ||
          creatorLastName.includes(query) ||
          categories.includes(query)
        );
      });
      setFilteredContents(filtered);
    }
  };

  const renderButtons = () => {
    if (authLoading) {
      return <ActivityIndicator size="small" color="#008080" />;
    }

    if (!profileData) {
      return null;
    }

    const { userIsCreator, user } = profileData;
    const profile_type = user?.profile_type;

    const isCreator = userIsCreator || profile_type === 'teacher';

    if (isCreator) {
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('CreateLiveClass')}
          >
            <View style={styles.buttonContent}>
              <Icon name="calendar" size={14} color="#fff" />
              <Text style={styles.buttonText}>Schedule  Class</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('CreateContent')}
          >
            <View style={styles.buttonContent}>
              <Icon name="plus" size={14} color="#fff" />
              <Text style={styles.buttonText}>Create Content</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.myContentButton}
            onPress={() => navigation.navigate('Mycontent')}
          >
            <View style={styles.buttonContent}>
              <Icon name="folder" size={14} color="#fff" />
              <Text style={styles.buttonText}>My Content</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else if (profile_type === 'student') {
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('LiveClasses')}
          >
            <View style={styles.buttonContent}>
              <Icon name="sign-in" size={14} color="#fff" />
              <Text style={styles.buttonText}>Join Live Class</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  const renderContentCards = () => {
    if (loading || authLoading) {
      return <ActivityIndicator size="large" color="#008080" />;
    }

    if (filteredContents.length === 0) {
      return <Text style={styles.noContentText}>No contents found.</Text>;
    }

    return filteredContents.map((content) => {
      const { user } = content;

      return (
        <View key={content.id} style={styles.card}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ContentDetail', { slug: content.slug })}
          >
            <View>
              <Image
                source={{
                  uri: `https://tbooke.net/storage/${content.content_thumbnail || 'default-images/default-bg.jpg'}`,
                }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>

          <View style={styles.cardHeader}>
          <Text style={styles.author}>
            {user?.profile_type === 'institution'
              ? `${user.first_name || ''} ${user.surname || ''}`.trim() || 'Institution Name Unavailable'
              : user
                ? `${user.first_name || ''} ${user.surname || ''}`.trim() || 'Unknown Author'
                : 'Unknown Author'}
          </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('ContentDetail', { slug: content.slug })}
            >
              <Text style={styles.contentTitle}>
                {content.content_title || 'Untitled Content'}
              </Text>
            </TouchableOpacity>
            <View style={styles.categoryContainer}>
              {content.content_category &&
                content.content_category.split(',').map((category, idx) => (
                  <Text key={idx} style={styles.categoryBadge}>
                    {category.trim()}
                  </Text>
                ))}
            </View>
            <View style={styles.contentStats}>
              <View style={styles.statItem}>
                <Icon name="calendar" size={20} color="#800" />
                <Text style={styles.statText}>
                  {new Date(content.created_at).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.description}>
              {content.content
                ? `${content.content.replace(/<[^>]+>/g, '').substring(0, 100)}...`
                : 'No description available.'}
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => navigation.navigate('ContentDetail', { slug: content.slug })}
            >
              <View style={styles.buttonContent}>
                <Icon name="arrow-right" size={12} color="#fff" />
                <Text style={styles.startButtonText}>Start Learning</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainContent}>
          {/* Button Container */}
          <View style={styles.buttonRow}>{renderButtons()}</View>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            {/* <Text style={styles.label}>Search</Text> */}
            <View style={styles.searchInputContainer}>
              <Icon name="search" size={20} color="#008080" style={styles.searchIcon} />
              <TextInput
                style={styles.input}
                placeholder="Search by title, creator, or categories"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Content List */}
          <View style={styles.contentContainer}>{renderContentCards()}</View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 1,
    backgroundColor: '#ccc',
  },
  mainContent: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    flexWrap: 'wrap',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  secondaryButton: {
    backgroundColor: '#30d5c8',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  primaryButton: {
    backgroundColor: '#008080',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  myContentButton: {
    backgroundColor: '#800',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 5,
  },
  noContentText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 12,
  },
  card: {
    marginVertical: 2,
    borderRadius: 5,
    backgroundColor: '#fff',
    overflow: 'hidden',
    // marginHorizontal: 2,
    width: '100%',
  },
  thumbnail: {
    height: 150,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  cardHeader: {
    marginTop: 160, // Pushes content below the thumbnail
    paddingHorizontal: 10, // Adds padding only for the content
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4682B4',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryBadge: {
    backgroundColor: '#ddd',
    color: '#333',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    marginRight: 5,
    marginTop: 5,
  },
  author: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  contentStats: {
    flexDirection: 'row',
    marginTop: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#666',
  },
  cardBody: {
    marginTop: 1,
    paddingHorizontal: 10, // Adds padding only for the body content
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  startButton: {
    backgroundColor: '#008080',
    borderRadius: 8,
    marginTop: 10,
    paddingVertical: 7,
    alignItems: 'center',
    marginHorizontal: 50,
    marginBottom:30,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  // label: {
  //   fontSize: 14,
  //   color: '#333',
  //   marginBottom: 8,
  //   fontWeight: 'bold',

  // },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
  },
  contentContainer: {
    paddingHorizontal: 2,
  },
});


export default TbookeLearning;
