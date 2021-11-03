/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { ColorSchemeName, Pressable } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import io from "socket.io-client";

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

import HomeScreen from '../screens/HomeScreen';
import ArtistsScreen from '../screens/ArtistsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddArtistScreen from '../screens/AddArtistScreen';

import { Artist, RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import { RootState } from '../store';
import { setNewDrops } from '../store/slices/artistsSlice';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const artists = useSelector((state: RootState) => state.artistsReducer.artists);
  const newDropAccounts = useSelector((state: RootState) => state.artistsReducer.newDropAccounts);
  
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io("http://127.0.0.1:3000", { query: { artists: JSON.stringify(artists) } });
    socket.on("FromAPI", (artistsWithNewDrops: string[]) => {
      if (artistsWithNewDrops.length > 0) {
        const updatedAccounts = [...newDropAccounts];
        artistsWithNewDrops.forEach((artist: string) => {
          const index = updatedAccounts.findIndex(a => a === artist);
          if (index > -1) {
            updatedAccounts.push(artist);
          }
        });
        dispatch(setNewDrops(updatedAccounts));
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [])
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
