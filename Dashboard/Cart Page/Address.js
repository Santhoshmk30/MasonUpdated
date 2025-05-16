import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

export default function MapScreen() {
  const [region, setRegion] = useState(null);
  const [markerCoords, setMarkerCoords] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Location permission denied');
          return;
        }
      }
      getCurrentLocation();
    } catch (err) {
      console.warn(err);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(coords);
        setMarkerCoords(coords);
        fetchAddress(coords.latitude, coords.longitude);
        setLoading(false);
      },
      error => {
        console.log(error.code, error.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=YOUR_GOOGLE_MAPS_API_KEY`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        setAddress(data.results[0].formatted_address);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const handleRegionChangeComplete = region => {
    setMarkerCoords({
      latitude: region.latitude,
      longitude: region.longitude,
    });
    fetchAddress(region.latitude, region.longitude);
  };

  const handleUseThisLocation = () => {
    console.log('Selected Coordinates:', markerCoords);
    console.log('Selected Address:', address);
    // Send to API or pass back to previous screen
  };

  if (loading || !region) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="tomato" />
        <Text>Loading Map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {markerCoords && <Marker coordinate={markerCoords} />}
      </MapView>
      <View style={styles.bottomPanel}>
        <Text style={styles.addressLabel}>Selected Address:</Text>
        <Text style={styles.address}>{address || 'Loading address...'}</Text>
        <Button title="Use This Location" onPress={handleUseThisLocation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  bottomPanel: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 5,
  },
  addressLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    marginBottom: 12,
    color: '#333',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
