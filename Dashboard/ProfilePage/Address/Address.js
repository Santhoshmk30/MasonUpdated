import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Address = () => {

  const [siteAddress, setSiteAddress] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [city, setCity] = useState('');
  const [location, setLocation] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [submittedAddress, setSubmittedAddress] = useState(null);
  // Function to get user_id from AsyncStorage
  const getUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      return userId;
    } catch (error) {
      console.error('Error retrieving user_id from AsyncStorage:', error);
    }
  };

  const handleSubmit = async () => {
    const userId = await getUserId(); 

    if (!userId) {
      console.error('User ID not found');
      return;
    }

    const baseUrl = 'https://masonshop.in/api/address_store';

    const data = {
      user_id: userId,
      site_name:siteAddress,
      full_address: fullAddress,
      city: city,
      location: location,
      state: state,
      country: country,
      zip_code: zipCode,
      phone: phone,
    };

    try {
      const response = await fetch(baseUrl, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(data), 
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Response Data:', result);
        
      } else {
        console.error('API request failed:', result);
       
      }
    } catch (error) {
      console.error('Error during API request:', error);
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>

    {/* Input Fields */}
    <View style={{ padding: 10 }}>
      {/* Site Address */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Icon name="location-on" size={20} color="#d9534f" />
        <TextInput
          placeholder="Site Name"
          value={siteAddress}
          onChangeText={setSiteAddress}
          style={{ flex: 1, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}
          placeholderTextColor="#888"
        />
      </View>

      {/* Search Address */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Icon name="search" size={20} color="#d9534f" />
        <TextInput
          placeholder="search Google Map Location"
          value={searchAddress}
          onChangeText={setSearchAddress}
          style={{ flex: 1, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}
          placeholderTextColor="#888"
        />
      </View>

      {/* Full Address */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Icon name="home" size={20} color="#d9534f" />
        <TextInput
          placeholder="Full Address"
          value={fullAddress}
          onChangeText={setFullAddress}
          style={{ flex: 1, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}
          placeholderTextColor="#888"
        />
      </View>

      {/* City */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Icon name="location-city" size={20} color="#d9534f" />
        <TextInput
          placeholder="City"
          value={city}
          onChangeText={setCity}
          style={{ flex: 1, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}
          placeholderTextColor="#888"
        />
      </View>

      {/* Location */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Icon name="place" size={20} color="#d9534f" />
        <TextInput
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
          style={{ flex: 1, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}
          placeholderTextColor="#888"
        />
      </View>

      {/* State */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Icon name="map" size={20} color="#d9534f" />
        <TextInput
          placeholder="State"
          value={state}
          onChangeText={setState}
          style={{ flex: 1, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}
          placeholderTextColor="#888"
        />
      </View>

      {/* Country */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Icon name="public" size={20} color="#d9534f" />
        <TextInput
          placeholder="Country"
          value={country}
          onChangeText={setCountry}
          style={{ flex: 1, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}
          placeholderTextColor="#888"
        />
      </View>

      {/* Zip Code */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Icon name="markunread-mailbox" size={20} color="#d9534f" />
        <TextInput
          placeholder="Zip Code"
          value={zipCode}
          onChangeText={setZipCode}
          keyboardType="number-pad"
          style={{ flex: 1, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}
          placeholderTextColor="#888"
        />
      </View>

      {/* Phone */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <Icon name="phone" size={20} color="#d9534f" />
        <TextInput
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={{ flex: 1, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}
          placeholderTextColor="#888"
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={{ backgroundColor: '#d9534f', padding: 15, alignItems: 'center', borderRadius: 5 }}
        onPress={handleSubmit}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>Submit</Text>
      </TouchableOpacity>

      {submittedAddress && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Saved Address:</Text>
            <Text>Site Address: {submittedAddress.siteAddress}</Text>
            <Text>Full Address: {submittedAddress.fullAddress}</Text>
            <Text>City: {submittedAddress.city}</Text>
            <Text>Location: {submittedAddress.location}</Text>
            <Text>State: {submittedAddress.state}</Text>
            <Text>Country: {submittedAddress.country}</Text>
            <Text>Zip Code: {submittedAddress.zipCode}</Text>
            <Text>Phone: {submittedAddress.phone}</Text>
          </View>
        )}
    </View>
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginHorizontal: 10,
  },
  resultSection: {
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  resultText: {
    marginLeft: 10,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  resultAddress: {
    fontSize: 14,
    color: '#555',
  },
});

export default Address;
