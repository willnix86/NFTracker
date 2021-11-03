import React from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';

import { Artist, RootTabScreenProps } from '../types';
import { RootState } from '../store';

export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
  const artists = useSelector((state: RootState) => state.artistsReducer.artists);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Tracked Artists</Text>
        {artists &&
          (artists as Artist[]).map((artist) => (
            <Text key={artist.name}>
              {artist.name}
            </Text>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
