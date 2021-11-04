import React from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';

import { Artist, RootTabScreenProps } from '../types';
import { RootState } from '../store';
import ArtistItem from '../components/ArtistItem';

export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
  const artists = useSelector((state: RootState) => state.artistsReducer.artists);
  const newDropAccounts = useSelector((state: RootState) => state.artistsReducer.newDropAccounts);

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Text style={styles.title}>New Drops</Text>
        {newDropAccounts.length > 0 ? 
          artists.map((artist: Artist) => {
            if (newDropAccounts.includes(artist.account)) {
              return <ArtistItem artist={artist} key={artist.name} hasNewDrops={true} />
            }
          })
          : <Text style={styles.text}>No new drops</Text>
        }
      </View>
      <View style={styles.subContainer}>
        <Text style={styles.title}>Tracked Artists</Text>
        {artists.length > 0 ?
          artists.map((artist) => {
            if (!newDropAccounts.includes(artist.account)) {
              return <ArtistItem artist={artist} key={artist.name} hasNewDrops={false} />
            }
          })
          : <Text style={styles.text}>No tracked artists</Text>
        }
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
  text: {

  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
