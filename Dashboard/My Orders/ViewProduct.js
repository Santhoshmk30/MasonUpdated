import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView,TouchableOpacity } from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProductDetails = ({ route }) => {
  const { orderId } = route.params;
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finalAmount, setFinalAmount] = useState(0);

  useEffect(() => {
    fetch(`https://masonshop.in/api/get-order-product-details?order_id=${orderId}`)
      .then(res => res.json())
      .then(data => {
        setOrderData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('API error:', err);
        setLoading(false);
      });
  }, []);


  if (loading) {
    return <ActivityIndicator size="large" color="#f60138" style={{ marginTop: 20 }} />;
  }
  const handleBuyAgain = (product) => {
    Alert.alert("Buy Again", `You tapped Buy Again for ${product.product_name}`);

  };

  const handleReview = (product) => {
    Alert.alert("Review Product", `You tapped Review for ${product.product_name}`);

  };

  if (loading) {
    return <ActivityIndicator size="large" color="#f60138" style={{ marginTop: 20 }} />;
  }

  return (
    <ScrollView>
    <View>
      {/* Table Header */}
      <View style={styles.tableRow}>
        <Text style={[styles.cell, styles.headerCell, { width: 50 }]}>S.No</Text>
        <Text style={[styles.cell, styles.headerCell, { width: 70 }]}>Image</Text>
        <Text style={[styles.cell, styles.headerCell, { width: 150 }]}>Product Name</Text>
        <Text style={[styles.cell, styles.headerCell, { width: 60 }]}>Qty</Text>
        <Text style={[styles.cell, styles.headerCell, { width: 80 }]}>Amount</Text>
      </View>
  
      {/* Table Rows */}
      {orderData.map((product, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={[styles.cell, { width: 50 }]}>{index + 1}</Text>
          <View style={[styles.cell, { width: 70, alignItems: 'center' }]}>
            <Image source={{ uri: product.product_image }} style={styles.cellImage} />
          </View>
          <Text style={[styles.cell, { width: 150 }]}>{product.product_name}</Text>
          <Text style={[styles.cell, { width: 60 }]}>{product.quantity || 'NA'}</Text>
          <Text style={[styles.cell, { width: 80 }]}>₹{product.final_amount}</Text>
        </View>
      ))}
  
      {/* Final Amount Summary */}
      <View style={[styles.tableRow, { marginTop: 20, borderTopWidth: 1, borderTopColor: '#ccc' }]}>
        <Text style={[styles.cell, { width: 50 }]}></Text> 
        <Text style={[styles.cell, { width: 70 }]}></Text> 
        <Text style={[styles.cell, { width: 150 }]}>Total</Text> 
        <Text style={[styles.cell, { width: 60 }]}></Text> 
        <Text style={[styles.cell, { width: 80 }]}>
          ₹{orderData.reduce((total, product) => total + product.final_amount, 0)}
        </Text>
      </View>
    </View>
  </ScrollView>
  
  
  
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f1f1f1',
    marginTop:10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  cell: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    textAlign: 'center',
    justifyContent: 'center',
  },
  headerCell: {
    backgroundColor: '#fc92a4',
    fontWeight: 'bold',
  },
  cellImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    borderRadius: 4,
  },
});

export default ProductDetails;
