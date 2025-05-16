import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';

const data = [
  {
    month: 'November',
    year: 2024,
    total: 599.0,
    transactions: [
      { id: '1', name: 'Cashback Coupon', amount: 599.0, status: 'Success' },
      { id: '2', name: 'Mason', amount: 599.0, status: 'Failed' },
      { id: '3', name: 'Mason', amount: 599.0, status: 'Success' },
      { id: '4', name: 'Mason', amount: 599.0, status: 'Success' },
    ],
  },
  {
    month: 'September',
    year: 2024,
    total: 599.0,
    transactions: [
      { id: '5', name: 'Mason', amount: 599.0, status: 'Success' },
      { id: '6', name: 'Mason', amount: 599.0, status: 'Success' },
      { id: '7', name: 'Mason', amount: 599.0, status: 'Success' },
    ],
  },
];

const PaymentsRefunds = () => {
  const renderTransaction = ({ item }) => (
    <TouchableOpacity style={styles.transactionRow} onPress={() => alert(`Transaction: ${item.name}`)}>
      <Text style={styles.transactionName}>{item.name}</Text>
      <Text
        style={
          item.status === 'Failed'
            ? styles.transactionAmountFailed
            : styles.transactionAmount
        }
      >
        {`\u20B9${item.amount.toFixed(2)}`}
      </Text>
      {item.status === 'Failed' && <Text style={styles.failedText}>Failed</Text>}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {data.map((section, index) => (
        <View key={index} style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{`${section.year} \n${section.month}`}</Text>
            <Text style={styles.sectionTotal}>{`\u20B9${section.total.toFixed(2)}`}</Text>
          </View>
          <FlatList
            data={section.transactions}
            keyExtractor={(item) => item.id}
            renderItem={renderTransaction}
            scrollEnabled={false}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  transactionName: {
    fontSize: 14,
  },
  transactionAmount: {
    fontSize: 14,
    color: '#28a745',
  },
  transactionAmountFailed: {
    fontSize: 14,
    color: '#dc3545',
  },
  failedText: {
    fontSize: 12,
    color: '#dc3545',
    marginLeft: 5,
  },
});

export default PaymentsRefunds;
