/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { HomeScreen } from './components/HomeScreen';
import {ChatScreen} from './components/ChatScreen';
import { LoginScreen } from './components/LoginScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, NavigationActions } from 'react-navigation';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */
const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  return (
    <LoginScreen></LoginScreen>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

// const appNavigator = createStackNavigator({
//   HomeScreen: {
//     screen: App
//   }
// });


    

// export default createAppContainer(appNavigator);
// export default createStackNavigator({
//   Home: HomeScreen,
//   Chat: ChatScreen,
// }, {
//   initialRouteName: 'Inbox',
// });

const RootStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: () => ({
      title: `Chitchat`,
      headerStyle: {
        backgroundColor: '#29088A',
      },
      headerTintColor: 'white'
    })
  },
  Login:{
    screen: LoginScreen,
    headerStyle: {
      backgroundColor: '#29088A',
    },
    headerTintColor: 'white'
  },
  Chat: {
    screen: ChatScreen,
    
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.chatDetails.displayName}`,
      headerStyle: {
        backgroundColor: '#29088A',
      },
      headerTintColor: 'white',
      // headerRight: () => (
      //   <MaterialIcons name="close" size={30} backgroundColor="white" color={"white"}
      //         onPress={()=>console.warn("CLICKED HEADER BUTTON")} >
      //   </MaterialIcons>
      // )
    })
  }
});

const AppRouter = createAppContainer(RootStack);

export default AppRouter;