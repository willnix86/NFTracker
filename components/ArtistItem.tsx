import React from 'react';
import { View, Text } from './Themed';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';

export default function ArtistItem({ name, hasNewDrops }: { name: string, hasNewDrops: boolean }) {
  if (hasNewDrops) {
    return (
      <View style={styles.container}>
        <View 
          style={styles.newDrops}
        />
        <TouchableOpacity>
          <Text style={styles.artist}>{name}</Text>
        </TouchableOpacity>
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.artistNoDrop}>{name}</Text>
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
    marginLeft: 25,
  },
  artistLink: {
    marginHorizontal: 10,
  },
  artistLinkText: {
    fontSize: 18,
  }
});
