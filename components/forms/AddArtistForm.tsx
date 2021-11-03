import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import Colors from '../../constants/Colors';
import { Text, View, TextInput } from '../Themed';

export default function AddArtistForm() {
  const [selectedPlatform, setSelectedPlatform] = useState('opensea')
  const [artistName, setArtistName] = useState('');
  const [artistAccount, setArtistAccount] = useState('');
  const [error, setError] = useState('');

  function saveArtist() {
    if (!selectedPlatform || !artistName || !artistAccount) {
      setError('Please fill out all fields');
      // setTimeout(() => {
      //   setError('');
      // }, 5000);
    }
    // CORE DATA
    // USER PREFS etc
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>
        {error}
      </Text>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Platform</Text>
        <Picker
          selectedValue={selectedPlatform}
          mode="dropdown"
          dropdownIconColor={Colors.brand.color}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedPlatform(itemValue)
          }>
          <Picker.Item label="Opensea" value="opensea" />
        </Picker>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Artist Name</Text>
        <TextInput 
          style={styles.textInput}
          placeholder="e.g KumaheadgearNFT"
          onChangeText={setArtistName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Artist Address</Text>
        <TextInput 
          style={styles.textInput}
          placeholder="e.g 0xdcd49761c86547a18936cdcb46eb3cd65a34e617"
          onChangeText={setArtistAccount}
        />
      </View>
      <TouchableOpacity onPress={saveArtist} style={styles.button}>
        <Text style={styles.buttonText}>
          Add
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.brand.color
  },
  container: {
    alignItems: 'center',
    flex: 1,
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 15
  },
  inputContainer: {
    width: 300,
    marginVertical: 20,
  },
  textInput: {
    fontSize: 18,
    marginTop: 15,
  },
  button: {
    backgroundColor: Colors.brand.color,
    padding: 10,
    marginTop: 30,
    width: 150,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
    color: Colors.dark.background,
    fontWeight: 'bold'
  }
});
