import React from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';

import { Artist, RootTabScreenProps } from '../types';
import { RootState } from '../store';
import ArtistItem from '../components/ArtistItem';

export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
  const artists = useSelector((state: RootState) => state.artistsReducer.artists);

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Text style={styles.title}>Tracked Artists</Text>
        {artists &&
          (artists as Artist[]).map((artist) => (
            <ArtistItem key={artist.name} name={artist.name} hasNewDrops={false} />
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
