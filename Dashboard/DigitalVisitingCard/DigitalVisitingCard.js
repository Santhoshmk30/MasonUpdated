import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const themes = [
  { id: '1', image: require('../icons/temp1.png') },
  { id: '2', image: require('../icons/temp2.png') },
  { id: '3', image: require('../icons/temp3.png') },
  { id: '4', image: require('../icons/temp4.png') },
  { id: '5', image: require('../icons/temp5.png') },
  { id: '6', image: require('../icons/temp6.png') },
  { id: '7', image: require('../icons/temp7.png') },
];

const ThemeSelectionScreen = () => {
  const [selectedId, setSelectedId] = useState('1');
  const [activeButton, setActiveButton] = useState('next');
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();


  useEffect(() => {
    const getUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('user_id');
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        Alert.alert('Error', 'User ID not found in storage');
      }
    };
    getUserId();
  }, []);

  const handleNext = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not available');
      return;
    }

    try {
      const response = await fetch('https://masonshop.in/api/dvc_first_page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          theme: selectedId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Theme selected successfully!');
        navigation.navigate('DigitalVisitingDetails');
      } else {
        Alert.alert('Error', data?.message || 'Failed to save theme');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong while sending theme');
    }
  };



  
  const renderItem = ({ item }) => {
    const isSelected = item.id === selectedId;
    return (
      <TouchableOpacity onPress={() => setSelectedId(item.id)}>
        <View style={[styles.cardContainer, isSelected && styles.selectedCard]}>
          <Image source={item.image} style={styles.cardImage} resizeMode="contain" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Theme</Text>

      <FlatList
        data={themes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardList}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.publishButton,
            activeButton === 'next' ? styles.active : styles.inactive,
          ]}
          onPress={() => {
            setActiveButton('next');
            handleNext();
          }}
        >
          <Text
            style={[
              styles.buttonText,
              activeButton === 'next' ? styles.activeText : styles.inactiveText,
            ]}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  cardList: {
    paddingHorizontal: 10,
  },
  cardContainer: {
    width: screenWidth * 0.6,
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#f5f5f5',
    elevation: 4,
  },
  selectedCard: {
    borderColor: '#f90',
  },
  cardImage: {
    width: '100%',
    height: 300,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'center',
    marginBottom: 70,
  },
  editButton: {
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginRight: 20,
    borderWidth: 2,
  },
  publishButton: {
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderWidth: 2,
  },
  active: {
    backgroundColor: 'red',
    borderColor: 'red',
  },
  inactive: {
    backgroundColor: '#fff',
    borderColor: 'red',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  activeText: {
    color: '#fff',
  },
  inactiveText: {
    color: 'red',
  },
});

export default ThemeSelectionScreen;
