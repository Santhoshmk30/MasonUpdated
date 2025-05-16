import React from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';

const ProductPage =({ navigation }) => {
  return (
    <ImageBackground
      source={require('../icons/masonbackground.jpeg')}  // Replace with your background image URL
      style={styles.container}
    >
    <View style={styles.container}>

      {/* Product Info */}
      <ScrollView>
        <View style={styles.productSection}>
        <Image
        source={require('../icons/Cement.jpg')} // Replace with your image path
        style={styles.productImage}
      />
          <Text style={styles.brand}>Aditya Brila Cement</Text>
          <Text style={styles.productName}>Ultratech OPC Cement (50kg Bag)</Text>
          <Text style={styles.rating}>⭐⭐⭐⭐⭐ 2k+ reviews</Text>
          <Text style={styles.deliveryInfo}>FREE DELIVERY | 1hr</Text>

          {/* Horizontal Scroller */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.relatedProducts}>
            {Array(5).fill().map((_, i) => (
              <Image
                key={i}
                source={{ uri: 'https://example.com/related-product.png' }}
                style={styles.relatedProductImage}
              />
            ))}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.buyNowButton}>
              <Text style={styles.buttonText}>BUY NOW</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('CartPage')}style={styles.addToCartButton}>
              <Text style={styles.buttonText}>ADD TO CART</Text>
            </TouchableOpacity>
          </View>

          {/* Video Banner */}
          <View style={styles.videoBanner}>
            <Text>VIDEO BANNER</Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <Text style={[styles.tab, styles.activeTab]}>Description</Text>
            <Text style={styles.tab}>Details</Text>
            <Text style={styles.tab}>Review</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Text>🏠</Text>
        <Text>📷</Text>
        <Text>🛒</Text>
      </View>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1,},
  header: { flexDirection: 'row', padding: 10, alignItems: 'center', backgroundColor: '#f8f8f8' },
  
  productSection: { padding: 20 },
  productImage: { width: 150, height: 150, alignSelf: 'center' },
  brand: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
  productName: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
  rating: { fontSize: 14, color: '#888', textAlign: 'center', marginVertical: 5 },
  deliveryInfo: { fontSize: 14, color: '#444', textAlign: 'center' },
  relatedProducts: { flexDirection: 'row', marginVertical: 10 },
  relatedProductImage: { width: 80, height: 80, marginHorizontal: 5 },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  buyNowButton: { backgroundColor: '#f60138', padding: 10, borderRadius: 5 },
  addToCartButton: { backgroundColor: '#f60138', padding: 10, borderRadius: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  videoBanner: { backgroundColor: '#ddd', padding: 20, marginVertical: 10 },
  tabs: { flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: 1, borderColor: '#ddd' },
  tab: { padding: 10, color: '#888' },
  activeTab: { color: '#f60138', borderBottomWidth: 2, borderBottomColor: '#f60138' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, borderTopWidth: 1, borderColor: '#ddd' },
});

export default ProductPage;
