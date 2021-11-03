import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoredItem, StoredItemKey } from '../types';

import store from '../store';
import { setArtists } from '../store/slices/artistsSlice';

class StorageController {
  constructor() {
    this.getItem("artists");
  }
  storageError = '';

  storeItem = async (key: StoredItemKey, value: StoredItem) => {
    try {      
      if (typeof value === 'string') {
        await AsyncStorage.setItem(`@${key}`, value);
      } else {
        await this.getItem(key);
        switch (key) {
          case 'artists':
            if (value) {
              const artists = store.getState().artistsReducer.artists;
              const updatedArtists = [...artists, value];
              await AsyncStorage.setItem(`@${key}`, JSON.stringify(updatedArtists));
              store.dispatch(setArtists(updatedArtists));
            }
            break;
          default:
            this.storageError = `Error storing ${key}`;
            break;
        }
      }
    } catch (e) {
      this.storageError = `Error storing ${key}`;
    }
  }

  getItem = async (key: StoredItemKey) => {
    try {
      switch (key) {
        case 'artists':
          const jsonValue = await AsyncStorage.getItem(`@${key}`)
          if (jsonValue !== null) {
            store.dispatch(setArtists(JSON.parse(jsonValue)));
          }
          break;
        default:
          this.storageError = `Error fetching ${key}`;
          break;
      }
    } catch (e) {
      this.storageError = `Error fetching ${key}`;
    }
  }  
}

export default new StorageController();
