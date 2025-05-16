import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const OrderConfirmedScreen = ({ route }) => {
  const {
    created_at,
    final_amount,
    order_id,
    user_id,
    total_amount,
    discount_amount,
  } = route.params;

  const navigation = useNavigation();

  // Handle Android back button to navigate to Home screen
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('DashboardPage'); // Replace 'Home' with your actual home screen name
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  const createdAtDate = new Date(created_at);
  const day = String(createdAtDate.getDate()).padStart(2, '0');
  const month = String(createdAtDate.getMonth() + 1).padStart(2, '0');
  const year = createdAtDate.getFullYear();
  let hours = createdAtDate.getHours();
  const minutes = String(createdAtDate.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const formattedDate = `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.confirmedBox}>
        <Image
          source={require('../icons/checkmark.png')}
          style={styles.successIcon}
        />
        <Text style={styles.confirmedText}>Order Confirmed</Text>
      </View>

      <View style={styles.deliveryBox}>
        <View style={styles.deliveryLeft}>
          <Image
            source={require('../icons/truck1.png')}
            style={styles.deliveryTruck}
          />
        </View>
        <View style={styles.deliveryRight}>
          <Text style={styles.itemDetails}>Amount: ₹{final_amount}</Text>
          <Text style={styles.dateText}>Order Date: {formattedDate}</Text>
          <Text style={styles.statusText}>Order ID: {order_id}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => navigation.navigate('MyOrders')} // Navigate to Home
      >
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f6f6f6',
    flexGrow: 1,
  },
  confirmedBox: {
    borderRadius: 12,
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
    marginTop: 200,
  },
  successIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  confirmedText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  deliveryBox: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 7,
  },
  deliveryLeft: {
    justifyContent: 'center',
    marginRight: 10,
  },
  deliveryTruck: {
    width: 90,
    height: 70,
  },
  deliveryRight: {
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d23b3b',
    marginTop: 10,
  },
  statusText: {
    fontSize: 14,
    color: '#333',
    marginTop: 10,
  },
  itemDetails: {
    fontSize: 14,
    fontWeight: '500',
    color: 'green',
  },
  doneButton: {
    backgroundColor: '#d23b3b',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 250,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderConfirmedScreen;
