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
              <Text style={styles.buttonText}>Schedule a Live Class</Text>
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
              {/* Start Learning Button on Thumbnail */}
              <TouchableOpacity
                style={styles.startButtonOnThumbnail}
                onPress={() => navigation.navigate('ContentDetail', { slug: content.slug })}
              >
                <Icon name="play" size={20} color="#fff" />
                <Text style={styles.startButtonText}>Play</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <View style={styles.cardHeader}>
            <Text style={styles.author}>
              {user ? `${user.first_name} ${user.surname}` : 'Unknown Author'}
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
                <Icon name="play" size={20} color="#fff" />
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
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Tbooke Learning</Text>
          </View>

          {/* Button Container */}
          <View style={styles.buttonRow}>{renderButtons()}</View>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <Text style={styles.label}>Search</Text>
            <View style={styles.searchInputContainer}>
              <Icon name="search" size={20} color="#aaa" style={styles.searchIcon} />
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
    marginVertical: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop:20,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: '#888',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  primaryButton: {
    backgroundColor: '#008080',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  myContentButton: {
    backgroundColor: '#003366',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    elevation: 2,
  },
  thumbnail: {
    height: 200,
    borderRadius: 10,
  },
  cardHeader: {
    marginTop: 15,
  },
  author: {
    color: '#777',
    fontSize: 14,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryBadge: {
    backgroundColor: '#eee',
    color: '#333',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 5,
    marginTop: 5,
  },
  contentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 5,
    color: '#666',
  },
  cardBody: {
    marginTop: 10,
  },
  description: {
    color: '#666',
    fontSize: 14,
  },
  startButton: {
    marginTop: 10,
    backgroundColor: '#008080',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonOnThumbnail: {
    position: 'absolute',
    bottom: 80,
    right: 130,
    backgroundColor: 'rgba(255, 0, 0, 0.9)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    marginLeft: 5,
  },
  searchContainer: {
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  searchIcon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  noContentText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TbookeLearning;
