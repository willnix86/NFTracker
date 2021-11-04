/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState, useRef } from 'react';
import { ColorSchemeName, Pressable, Platform, AppState } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import io from "socket.io-client";
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

import HomeScreen from '../screens/HomeScreen';
import ArtistsScreen from '../screens/ArtistsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddArtistScreen from '../screens/AddArtistScreen';

import { Artist, RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import { Subscription } from 'expo-modules-core';
import LinkingConfiguration from './LinkingConfiguration';
import { RootState } from '../store';
import { setNewDrops } from '../store/slices/artistsSlice';
import { setAllowNotifications } from '../store/slices/settingsSlice';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const [notification, setNotification] = useState<boolean>(false);
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>(undefined);

  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  const artists = useSelector((state: RootState) => state.artistsReducer.artists);
  const allowNotifications = useSelector((state: RootState) => state.settingsReducer.allowNotifications);
  const newDropAccounts = useSelector((state: RootState) => state.artistsReducer.newDropAccounts);
  
  const dispatch = useDispatch();

  // Open socket connection
  useEffect(() => {
    const socket = io("http://127.0.0.1:3000", { query: { artists: JSON.stringify(artists) } });

    socket.on("NFTracker", (artistsWithNewDrops: string[]) => {
      if (artistsWithNewDrops.length > 0) {
        const updatedAccounts = [...newDropAccounts];
        artistsWithNewDrops.forEach((artist: string) => {
          const index = updatedAccounts.findIndex(a => a === artist);
          if (index > -1) {
            updatedAccounts.push(artist);
          }
        });
        dispatch(setNewDrops(updatedAccounts));
        sendNotificationImmediately(updatedAccounts);
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [])

  // Add notification listener
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(!!notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(async response => {});

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  // Add AppState listener
  useEffect(() => {
    AppState.addEventListener('change', clearBadgeCount);
  }, []);

  const registerForPushNotificationsAsync = async() => {
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      if (allowNotifications) {
        dispatch(setAllowNotifications(false));
      }
      return;
    } else {
      if (!allowNotifications) {
        dispatch(setAllowNotifications(true));
      }
      if (Constants.isDevice) {
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
      }
    }
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    return token;
  }

  const sendNotificationImmediately = async (updatedAccounts: string[]) => {
    const artistsWithNewDrops: string[] = [];
    artists.forEach((artist: Artist) => {
      if (updatedAccounts.includes(artist.account)) {
        artistsWithNewDrops.push(artist.name);
      }
    });
    
    let body = `${artistsWithNewDrops.length > 1 ? 'Some of your artists' : artistsWithNewDrops[0]} just dropped something new!`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "NFTracker",
        body,
      },
      trigger: {
        seconds: 1,
      },
    });

    if (AppState.currentState !== 'active') {
      await Notifications.setBadgeCountAsync(1);
    };
  };

  const clearBadgeCount = async () => {
    const count = await Notifications.getBadgeCountAsync();
    if (count > 0 && AppState.currentState === 'active') {
      await Notifications.setBadgeCountAsync(0);
    }
  };

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="AddArtistModal" component={AddArtistScreen} options={{ title: 'Add Artist' }} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }: RootTabScreenProps<'Home'>) => ({
          title: 'NFTracker',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('AddArtistModal')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <MaterialIcons
                name="add"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      {/* <BottomTab.Screen
        name="Artists"
        component={ArtistsScreen}
        options={{
          title: 'Artists',
          tabBarIcon: ({ color }) => <TabBarIcon name="brush" color={color} />,
        }}
      /> */}
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name="settings" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
}) {
  return <MaterialIcons size={30} style={{ marginBottom: -3 }} {...props} />;
}
