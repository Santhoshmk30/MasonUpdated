import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const InvoicePage = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Invoice#121354</Text>
        <Text style={styles.orderId}>Order ID: 12345</Text>
        <Text style={styles.status}>Invoice Paid</Text>
      </View>

      {/* Address Section */}
      <View style={styles.addressContainer}>
        <View>
          <Text style={styles.addressTitle}>From</Text>
          <Text style={styles.address}>NO:X ABC</Text>
          <Text style={styles.address}>Street, Kodambakkam</Text>
        </View>
        <View>
          <Text style={styles.addressTitle}>To</Text>
          <Text style={styles.address}>NO:X ABC</Text>
          <Text style={styles.address}>Street, Kodambakkam</Text>
        </View>
      </View>

      {/* Payment Method */}
      <View style={styles.paymentMethod}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentCard}>
          <Text style={styles.paymentText}>Google Pay</Text>
          <Text style={styles.paymentExpiry}>Expires On 23/06</Text>
        </View>
      </View>

      {/* Product Summary */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Product Summary</Text>
        <View style={styles.summaryItem}>
          <Text style={styles.productName}>Ultratech OPC Cement</Text>
          <Text style={styles.productDetails}>25kg</Text>
          <Text style={styles.productPrice}>₹350.00</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.productName}>Ultratech OPC Cement</Text>
          <Text style={styles.productDetails}>25kg</Text>
          <Text style={styles.productPrice}>₹350.00</Text>
        </View>
      </View>

      {/* Bill Summary */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Bill Summary</Text>
        <View style={styles.billItem}>
          <Text>Total</Text>
          <Text>₹499.00</Text>
        </View>
        <View style={styles.billItem}>
          <Text>Transport fee (will deduct through offline)</Text>
          <Text>₹0.00</Text>
        </View>
        <View style={styles.billItem}>
          <Text>Masson Wallet</Text>
          <Text>- ₹50.00</Text>
        </View>
        <View style={styles.billItem}>
          <Text>GST</Text>
          <Text>₹50.00</Text>
        </View>
        <View style={styles.billItem}>
          <Text style={styles.boldText}>Sub Total</Text>
          <Text style={styles.boldText}>₹500.00</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Show Invoice Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Download</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderId: {
    fontSize: 16,
    color: '#666',
    marginVertical: 4,
  },
  status: {
    backgroundColor: '#d4edda',
    color: '#155724',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  addressTitle: {
    fontWeight: 'bold',
    color: '#333',
  },
  address: {
    color: '#555',
  },
  paymentMethod: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  paymentCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    elevation: 1,
  },
  paymentText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  paymentExpiry: {
    fontSize: 14,
    color: '#888',
  },
  summarySection: {
    marginBottom: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  productName: {
    flex: 2,
    fontSize: 14,
  },
  productDetails: {
    flex: 1,
    textAlign: 'center',
    color: '#777',
  },
  productPrice: {
    flex: 1,
    textAlign: 'right',
    color: '#333',
  },
  billItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  boldText: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default InvoicePage;
