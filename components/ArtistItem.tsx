import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Colors from '../constants/Colors';
import { RootState } from '../store';
import { setNewDrops } from '../store/slices/artistsSlice';
import { Artist } from '../types';
import { View, Text } from './Themed';

export default function ArtistItem({ artist, hasNewDrops }: { artist: Artist, hasNewDrops: boolean }) {
  const newDropAccounts = useSelector((state: RootState) => state.artistsReducer.newDropAccounts);
  const dispatch = useDispatch();

  const visitArtist = () => {
    WebBrowser.openBrowserAsync(
      `https://opensea.io/${artist.account}?search[sortBy]=CREATED_DATE&search[sortAscending]=false&search[toggles][0]=IS_NEW`
    );
    const unvisited = newDropAccounts.filter((acc) => acc !== artist.account);
    dispatch(setNewDrops(unvisited));
    // 
  };

  if (hasNewDrops) {
    return (
      <View style={styles.container}>
        <View 
          style={styles.newDrops}
        />
        <TouchableOpacity onPress={visitArtist}>
          <Text style={styles.artist}>{artist.name}</Text>
        </TouchableOpacity>
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.artistNoDrop}>{artist.name}</Text>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newDrops: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginRight: 15,
    backgroundColor: Colors.brand.color
  },
  artistContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  artist: {
    fontSize: 18,
  },
  artistNoDrop: {
    fontSize: 18,
    // marginLeft: 25,
  },
  artistLink: {
    marginHorizontal: 10,
  },
  artistLinkText: {
    fontSize: 18,
  }
});
