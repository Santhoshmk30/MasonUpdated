import React, { useEffect, useState ,useCallback} from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ImageBackground, ActivityIndicator,BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('DashboardPage'); 
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );


  const fetchOrders = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      console.log('USER ID:', userId);
      if (!userId) {
        console.warn('User ID not found in AsyncStorage');
        return;
      }
  
      const response = await axios.get(`https://masonshop.in/api/orders-products?user_id=${userId}`);
      console.log('API RESPONSE:', response.data); 
      setOrders(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrders();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.product_image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.orderId}>Order ID: {item.order_id}</Text>
        <Text style={styles.productName}>{item.product_name}</Text>
        <Text style={styles.price}>₹{item.amount}</Text>
        <Text style={styles.date}>{item.date}</Text>
        
        <View style={styles.actionContainer}>
        <Text style={[styles.status, item.order_status === 'Shipped' ? styles.shipped : styles.delivered]}>
  {item.order_status}
</Text>

<TouchableOpacity
  style={styles.viewButton}
  onPress={() => navigation.navigate('ViewProduct', { orderId: item.order_id })}
>
  <Text style={styles.viewButtonText}>View Product</Text>
</TouchableOpacity>

        </View>
      </View>
    </View>
  );


  return (
    <ImageBackground
      source={require('../icons/masonbackground.jpeg')}  
      style={styles.container}
    >
    <View style={styles.container}>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 16,
  },
  list: {
    paddingHorizontal: 16,
  },
  card: {
    flexDirection: 'row',
    marginTop:10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 7,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  orderId: {
    fontWeight: 'bold',
  },
  productName: {
    color: '#555',
  },
  price: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#777',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
  shipped: {
    backgroundColor: '#f60138',
    color: '#fff',
  },
  delivered: {
    backgroundColor: '#2ecc71',
    color: '#fff',
  },
  viewButton: {
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#f60138',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  viewButtonText: {
    fontSize: 14,
    color: 'grey',
  },
});

export default MyOrders;
