import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './screens/AuthContext';
import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';
import Post from './screens/Post';
import Profile from './screens/Profile';
import OwnProfile from './screens/OwnProfile'; // Ensure this screen is created
import Settings from './screens/Settings';
import LearningResources from './screens/LearningResources';
import TbookeLearning from './screens/TbookeLearning';
import Notifications from './screens/Notifications';
import About from './screens/About';
import SchoolsCorner from './screens/SchoolsCorner';
import AddSchool from './screens/AddSchool';
import TbookeBlueboard from './screens/TbookeBlueboard';
import CreateBlueboardPost from './screens/CreateBlueboardPost';
import Messages from './screens/Messages';
import Form from './screens/CreateResource';
import LiveClasses from './screens/LiveClasses';
import CreateLiveClass from './screens/CreateLiveClass';
import EditLiveClass from './screens/EditLiveClass';
import CreateContent from './screens/CreateContent';
import Content from './screens/Content';
import CreatePost from './screens/CreatePost';
import ForgotPassword from './screens/ForgotPassword';
import EditProfile from './screens/EditProfile';
import ShowLive from './screens/ShowLive';
import Groups from './screens/Groups'; 
import ShowGroup from './screens/ShowGroup';
import CreateGroup from './screens/CreateGroup';
import PostItem from './screens/PostItem';
import ContentDetail from './screens/ContentDetail';
import PrivacyPolicy from './screens/PrivacyPolicy';
import MyContent from './screens/MyContent';
import MyGroups from './screens/MyGroups';
// import MediaGallery from './screens/MediaGallery';
import Feed from './screens/Feed';

import CreateModal from './screens/CreateModal'; // Modal for creating posts
import ResourceDetail from './screens/ResourceDetail'; // Adjust the import path as necessary

import MyResources from './screens/MyResources';
import EditResource from './screens/EditResourceForm';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="LearningResources" component={LearningResources} options={{ headerShown: false }} />
          <Stack.Screen name="TbookeLearning" component={TbookeLearning} options={{ headerShown: false }} />
          <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />
          <Stack.Screen name="About" component={About} options={{ headerShown: true }} />
          <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
          <Stack.Screen name="OwnProfile" component={OwnProfile} options={{ headerShown: false }} />
          <Stack.Screen name="Post" component={Post} options={{ headerShown: false }} />
          <Stack.Screen name="SchoolsCorner" component={SchoolsCorner} options={{ headerShown: false }} />
          <Stack.Screen name="AddSchool" component={AddSchool} options={{ headerShown: false }} />
          <Stack.Screen name="TbookeBlueboard" component={TbookeBlueboard} options={{ headerShown: false }} />
          <Stack.Screen name="CreateBlueboardPost" component={CreateBlueboardPost} options={{ headerShown: false }} />
          <Stack.Screen name="Messages" component={Messages} options={{ headerShown: false }} />
          <Stack.Screen name="Form" component={Form} options={{ headerShown: false }} />
          <Stack.Screen name="LiveClasses" component={LiveClasses} options={{ headerShown: false }} />
          <Stack.Screen name="CreateLiveClass" component={CreateLiveClass} options={{ headerShown: false }} />
          <Stack.Screen name="EditLiveClass" component={EditLiveClass} options={{ headerShown: false }} />
          <Stack.Screen name="CreateContent" component={CreateContent} options={{ headerShown: false }} />
          <Stack.Screen name="Content" component={Content} options={{ headerShown: false }} />
          <Stack.Screen name="ContentDetail" component={ContentDetail} options={{ headerShown: false }} />
          <Stack.Screen name="CreatePost" component={CreatePost} options={{ headerShown: false }} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: true }} />
          <Stack.Screen name="Groups" component={Groups} options={{ headerShown: false }} />
          <Stack.Screen name="ShowGroup" component={ShowGroup} options={{ headerShown: false }} />
          <Stack.Screen name="ShowLive" component={ShowLive} options={{ headerShown: false }} />
          
          <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
          <Stack.Screen name="CreateGroup" component={CreateGroup} options={{ headerShown: false }} />
          <Stack.Screen name="PostItem" component={PostItem} options={{ headerShown: false }} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ headerShown: false }} />
          <Stack.Screen name="Mycontent" component={MyContent} options={{ headerShown: false }} />
          
          <Stack.Screen name="MyGroups" component={MyGroups} options={{ headerShown: false }} />
          <Stack.Screen name ="Feed" component={Feed} options={{headerShown: false }} />
          
          <Stack.Screen name="CreateModal" component={CreateModal} />
          <Stack.Screen name ="ResourceDetail" component={ResourceDetail} options={{headerShown: false }} />
          
          <Stack.Screen name ="MyResources" component={MyResources} options={{headerShown: false }} />
          {/* <Stack.Screen name="MediaGallery" component={MediaGallery} options={{ headerShown: false }} />
         */}


          <Stack.Screen name="EditResource" component={EditResource}  options={{headerShown: false }} />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}
