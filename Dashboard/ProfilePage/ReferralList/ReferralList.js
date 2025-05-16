import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReferralList = () => {
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReferralData = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) return;

      const response = await axios.get(`https://masonshop.in/api/referred_user_details?referred_by=${userId}`);
      console.log('API Response:', response.data);

      if (response.data && response.data.data) {
        setReferralData(response.data.data);
      } else {
        setReferralData(null);
      }
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, []);

  return (
    <View style={styles.container}>

      <View style={styles.inviteSection}>
        <TextInput style={styles.inviteLink} value="www.Mason.in" editable={false} />
        <TouchableOpacity style={styles.button}>
          <Image source={require('../ReferralList/Copyicon.png')} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Image source={require('./Shareicon.png')} style={styles.image} />
        </TouchableOpacity>
      </View>

     
      <View style={styles.stats}>
        <View style={[styles.statBox, styles.card]}>
          <Text style={styles.statNumber}>{referralData?.total_referrals ?? 0}</Text>
          <Text style={styles.statLabel}>Total Referral</Text>
        </View>
        <View style={[styles.statBox, styles.card]}>
          <Text style={styles.statNumber}>{referralData?.today_referrals ?? 0}</Text>
          <Text style={styles.statLabel}>Today Referral</Text>
        </View>
        <View style={[styles.statBox, styles.card]}>
          <Text style={styles.statNumber}>{referralData?.active_referrals ?? 0}</Text>
          <Text style={styles.statLabel}>Active Referral</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>New Referral</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : referralData ? (
        <View style={styles.referralItem}>
          <Image source={{ uri: referralData.profile || 'https://via.placeholder.com/50' }} style={styles.referralImage} />
          <View style={styles.referralDetails}>
            <Text style={styles.name}>{referralData.name}</Text>
            <Text style={styles.phone}>{referralData.phone}</Text>
            <Text style={styles.id}>ID: {referralData.user_id}</Text>
            <Text style={styles.date}>{referralData.jdate}</Text>
          </View>
          <Text
            style={[
              styles.status,
              referralData.status === 'active' ? styles.approved : styles.pending,
            ]}
          >
            {referralData.status}
          </Text>
        </View>
      ) : (
        <Text>No referral data available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  inviteSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  inviteLink: { flex: 1, borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 8, marginRight: 8 },
  button: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 98,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  image: {
    width: 18,
    height: 20,
    resizeMode: 'contain',
  },
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
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: { alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 10, color: '#555' },
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
  id: { fontSize: 14, color: '#555' },
  date: { fontSize: 12, color: '#999' },
  status: { fontSize: 14, fontWeight: 'bold' },
  approved: { color: 'green' },
  pending: { color: 'red' },
  seeMore: { textAlign: 'center', color: '#f04', marginTop: 16 },
});

export default ReferralList;
