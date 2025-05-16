import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet, ActivityIndicator, FlatList
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IncomeReport = () => {
  const [incomeList, setIncomeList] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchIncomeData = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) return;

      const response = await axios.get(`https://masonshop.in/api/income-details?user_id=${userId}`);
      console.log('API Response:', response.data);

      if (response.data && response.data.status) {
        setIncomeList(response.data.data || []);
        setTotalIncome(response.data.total_by_type?.sales ?? 0);
      } else {
        setIncomeList([]);
        setTotalIncome(0);
      }
    } catch (error) {
      console.error('Failed to fetch income data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeData();
  }, []);

  const renderReferralItem = ({ item }) => (
    <View style={styles.referralItem}>
      <Image source={{ uri: item.profile_url || 'https://via.placeholder.com/50' }} style={styles.referralImage} />
      <View style={styles.referralDetails}>
        <Text style={styles.name}>{item.from_user_name}</Text>
        <Text style={styles.phone}>ID: {item.from_id}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.amount}>₹{item.amount}</Text>
        <Text style={styles.typeText}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)} Income</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Stats */}
      <View style={styles.stats}>
        <View style={[styles.statBox, styles.card]}>
          <Text style={styles.statNumber}>{incomeList?.total_referrals ?? 0}</Text>
          <Text style={styles.statLabel}>Referral Income</Text>
        </View>
        <View style={[styles.statBox, styles.card]}>
          <Text style={styles.statNumber}>{incomeList?.today_referrals ?? 0}</Text>
          <Text style={styles.statLabel}>Sales Income</Text>
        </View>
        <View style={[styles.statBox, styles.card]}>
          <Text style={styles.statNumber}>{incomeList?.active_referrals ?? 0}</Text>
          <Text style={styles.statLabel}>Point Value</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Income Report</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : incomeList.length > 0 ? (
        <FlatList
          data={incomeList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderReferralItem}
        />
      ) : (
        <Text>No income data available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 4,
    alignItems: 'center',
    width: '30%',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  statBox: { alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#555' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  referralItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 8,
  },
  referralImage: { width: 50, height: 50, borderRadius: 25, marginRight: 16 },
  referralDetails: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  phone: { fontSize: 14, color: '#555' },
  date: { fontSize: 12, color: '#999' },
  row: { alignItems: 'flex-end' },
  amount: { fontSize: 16, fontWeight: 'bold', color: 'green' },
  typeText: { fontSize: 12, color: '#555' },
});

export default IncomeReport;
