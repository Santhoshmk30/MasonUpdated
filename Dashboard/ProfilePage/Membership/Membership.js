import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const Membership = () => {
  return (
    <View style={styles.container}>
        <ScrollView>
      {/* Premium Member Card */}
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://via.placeholder.com/50' }} // Replace with actual premium badge URL
          style={styles.badge}
        />
        <Text style={styles.title}>Premium Member</Text>
        <Text style={styles.price}>₹100</Text>
        <Text style={styles.featuresTitle}>Features</Text>
        <Text style={styles.featureItem}>• Expires on December 3, 2024.</Text>
        <Text style={styles.featureItem}>
          • Convenience Charges of ₹45 applicable at the time of Checkout.
        </Text>
        <Text style={styles.featureItem}>
          • Buy one get one can be availed on Burger + Softdrinks.
        </Text>
        <TouchableOpacity style={styles.activateButton}>
          <Text style={styles.buttonText}>Activate Now</Text>
        </TouchableOpacity>
      </View>

      {/* Platinum Member Card */}
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://via.placeholder.com/50' }} // Replace with actual platinum badge URL
          style={styles.badge}
        />
        <Text style={styles.title}>Platinum Member</Text>
        <Text style={styles.expiry}>Expires In 2 Days</Text>
        <Text style={[styles.kycBadge, styles.kycPending]}>KYC Pending</Text>
        <Text style={styles.price}>₹500</Text>
        <TouchableOpacity style={styles.renewButton}>
          <Text style={styles.buttonText1}>Renew</Text>
        </TouchableOpacity>
      </View>

      {/* VIP Member Card */}
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://via.placeholder.com/50' }} // Replace with actual VIP badge URL
          style={styles.badge}
        />
        <Text style={styles.title}>VIP Member</Text>
        <Text style={styles.expiry}>Expires In 2 Days</Text>
        <Text style={[styles.kycBadge, styles.kycVerified]}>KYC Verified</Text>
        <Text style={styles.price}>₹1000</Text>
        <TouchableOpacity style={styles.renewButton}>
          <Text style={styles.buttonText1}>Renew</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badge: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 8,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  activateButton: {
    backgroundColor: '#f60138',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    marginLeft:90,
    width: '50%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  renewButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    marginLeft:90,
    width: '50%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonText1: {
    color: '#f60138',
    fontWeight: 'bold',
    fontSize: 16,
  },
  expiry: {
    textAlign: 'center',
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  kycBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 4,
    borderRadius: 4,
    width: 80,
    alignSelf: 'center',
    marginBottom: 8,
  },
  kycPending: {
    backgroundColor: '#FFCDD2',
    color: '#E53935',
  },
  kycVerified: {
    backgroundColor: '#C8E6C9',
    color: '#4CAF50',
  },
});

export default Membership;
