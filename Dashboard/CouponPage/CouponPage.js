import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, ImageBackground, StyleSheet } from "react-native";


const coupons = [
  {
    id: 1,
    brand: 'UltraTech',
    discount: 'Flat ₹150 OFF On Cement Purchase',
    code: 'ULTRA150',
    type: 'FLAT COUPON',
    amount: '₹150 OFF',
    expiry: 'Valid Till 09 May',
    image: require('../icons/cement-bag.jpg'),
  },
  {
    id: 2,
    brand: 'JSW',
    discount: 'Get 10% OFF On Orders Above ₹999',
    code: 'JSW10',
    type: 'PERCENTAGE',
    amount: '10% OFF',
    expiry: 'Valid Till 09 May',
    image: require('../icons/cement-bag.jpg'),
  },
  {
    id: 3,
    brand: 'HITACHI',
    discount: '₹200 Cashback On Power Tool Rentals',
    code: 'HITCASH200',
    type: 'CASHBACK',
    amount: '₹200',
    expiry: 'Valid Till 09 May',
    image: require('../icons/cement-bag.jpg'),
  },
];

const CouponPage = () => {
  return (
    <ScrollView style={styles.container}>
      <ImageBackground source={require('../icons/cement-bag.jpg')} style={styles.headerBackground} resizeMode="cover">
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>
            ₹0 Total
          </Text>
        </View>
      </ImageBackground>

      <View style={styles.progressContainer}>
        {[1, 2, 3, 4, 5, 6].map((step) => (
          <View key={step} style={{ alignItems: 'center' }}>
            
          </View>
        ))}
      </View>

      <View style={styles.promoCard}>
        <Image source={require('../icons/earth.png')} style={styles.promoImage} resizeMode="contain" />
        <View style={styles.promoTextContainer}>
          <Text style={styles.promoTitle}>Rs 99 - Rs 999</Text>
          <Text style={styles.promoSubtitle}>Welcome Bonus On First Deposit On Mason</Text>
        </View>
        <TouchableOpacity style={styles.getNowButton}>
          <Text style={styles.getNowButtonText}>Get Now</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Your Coupon</Text>
      {coupons.map((item) => (
        <View key={item.id} style={styles.couponCard}>
          <View style={styles.couponLeft}>
            <Image source={item.image} style={styles.couponImage} resizeMode="contain" />
            <Text style={styles.couponDiscount}>{item.discount}</Text>
            <Text style={styles.couponExpiry}>{item.expiry}</Text>
          </View>
          <View style={styles.couponRight}>
            <Text style={styles.couponType}>{item.type}</Text>
            <Text style={styles.couponAmount}>{item.amount}</Text>
            <Text style={styles.couponCode}>{item.code}</Text>
            <TouchableOpacity style={styles.getCodeButton}>
              <Text style={styles.getCodeButtonText}>Get Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBackground: {
    height: 150,
    padding: 16,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  searchIcon: {
    alignSelf: 'flex-end',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  stepCompleted: {
    backgroundColor: '#4CAF50',
  },
  promoCard: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoImage: {
    width: 60,
    height: 60,
  },
  promoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  promoSubtitle: {
    color: '#666',
  },
  getNowButton: {
    backgroundColor: 'red',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  getNowButtonText: {
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
  },
  couponCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    flexDirection: 'row',
  },
  couponLeft: {
    flex: 1,
    padding: 12,
  },
  couponImage: {
    width: 80,
    height: 80,
  },
  couponDiscount: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  couponExpiry: {
    color: '#777',
  },
  couponRight: {
    width: 140,
    padding: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
    justifyContent: 'center',
  },
  couponType: {
    fontSize: 12,
    color: 'green',
    fontWeight: 'bold',
  },
  couponAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  couponCode: {
    fontSize: 12,
    color: '#777',
  },
  getCodeButton: {
    backgroundColor: 'red',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  getCodeButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default CouponPage;