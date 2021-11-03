import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { AnyObject, StoredItemKey, StoredItem } from '../types';

export default function useAsyncStorage(key: StoredItemKey): [StoredItem, (item: StoredItem) => void, string] {
  const [storedItem, setStoredItem] = useState<StoredItem>(null);
  const [storageError, setStorageError] = useState<string>('');

  useEffect(() => {
    getItem();
  }, [])

  const storeItem = async (value: StoredItem) => {
    try {
      if (typeof value === 'string') {
        await AsyncStorage.setItem(`@${key}`, value);
        setStoredItem(value);
      } else {
        switch (key) {
          case 'artists':
            const artists = [...storedItem as AnyObject[], value];
            await AsyncStorage.setItem(`@${key}`, JSON.stringify(artists));
            break;
          default:
            setStorageError(`Error storing ${key}`);
            break;
        }
        setStoredItem(value);
      }
    } catch (e) {
      setStorageError(`Error saving ${key}`);
    }
  }

  const getItem = async () => {
    try {
      switch (key) {
        case 'artists':
          const artists = await AsyncStorage.getItem('@artists');
          setStoredItem(artists ? JSON.parse(artists) : []);
          break;
        default:
          setStorageError(`Error getting ${key}`);
          break;
      }
    } catch (e) {
      setStorageError(`Error fetching ${key}`);
    }
  }  

  return [storedItem, storeItem, storageError];
}
