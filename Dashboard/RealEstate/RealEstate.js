import React, { useState,useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,Modal,ImageBackground,Dimensions
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const RealEstate =({ navigation,item, increaseQuantity, decreaseQuantity  }) => {
  const route = useRoute();
  const { categoryId } = route.params || {};



  
  const isActiveRoute = (routeName) => route.name === routeName;

  const [selectedProduct, setSelectedProduct] = useState(null);

  
  const [modalVisible, setModalVisible] = useState(false);
  const [ProductmodalVisible, setProductModalVisible] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [showQuantity, setShowQuantity] = useState(false);
  const itemCount = Object.values(showQuantity).reduce((sum, count) => sum + count, 0);
  const totalPrice = products?.reduce((total, product) => {
    const qty = showQuantity[product.id] || 0;
    return total + qty * product.selling;
  }, 0) || 0;
  
  
  
 

  const [products, setProducts] = useState([]);
  const [subcategory, setSubcategory] = useState([]);

  useEffect(() => {
    if (itemCount > 0) {
      const selectedItems = products
        .filter(item => showQuantity[item.id] > 0)
        .map(item => ({
          id: item.id,
          name: item.name,
          image: item.image,
          selling: item.selling,
          market_price: item.market_price,
          quantity: showQuantity[item.id],
          totalPrice: item.selling * showQuantity[item.id],
        }));
  
      AsyncStorage.setItem('cartItems', JSON.stringify(selectedItems))
        .then(() => console.log('Cart items saved to AsyncStorage'))
        .catch(err => console.error(' Failed to save cart items', err));
    }
  }, [itemCount, showQuantity]);


  const fetchData = async () => {
    try {
      const response = await fetch(`https://masonshop.in/api/products?cid=${categoryId}`);
      const data = await response.json();
      
      console.log('API Response:', data);  
      
      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
      } else if (Array.isArray(data)) {
        setProducts(data);
      } else {
        throw new Error('Invalid products response format');
      }
  
      if (data.Subcategory && Array.isArray(data.Subcategory)) {
        setSubcategory(data.Subcategory);
      } else if (Array.isArray(data)) {
        setSubcategory(data);
      } else {
        throw new Error('Invalid subcategory response format');
      }
  
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };
  
 
  useEffect(() => {
    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);
  
  
  


  const handleOpenModal = () => {
    setModalVisible(true);
  };


  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const ProducthandleOpenModal = (product) => {
    setSelectedProduct(product);
    setProductModalVisible(true);
  };
  
  const ProducthandleCloseModal = () => {
    setProductModalVisible(false);
    setSelectedProduct(null);
  };
  

  const handleBrandSelect = (brand) => {
    setSelectedBrands((prev) => 
      prev.includes(brand) ? prev.filter(item => item !== brand) : [...prev, brand]
    );
  };

  const handlePriceRangeSelect = (range) => {
    setSelectedPriceRange(range);
  };

  const handleDone = () => {
    
    setModalVisible(false);
    console.log("Selected Brands: ", selectedBrands);
    console.log("Selected Price Range: ", selectedPriceRange);
  };

  const handleIncrease = async (productId) => {
    try {
      
      setShowQuantity((prev) => ({
        ...prev,
        [productId]: prev[productId] ? prev[productId] + 1 : 1,
      }));
  
      
      const data = await AsyncStorage.getItem('cartItems');
      const existingCart = data ? JSON.parse(data) : [];
  
      // Find product from your product list
      const product = products.find((p) => p.id === productId);
      if (!product) return;
  
      const existingIndex = existingCart.findIndex((item) => item.id === product.id);
  
      let updatedCart;
  
      if (existingIndex !== -1) {
       
        updatedCart = existingCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
       
        updatedCart = [...existingCart, { ...product, quantity: 1 }];
      }
  
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));
      console.log('Product added to cart:', updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  
  
  
  const handleDecrease = (id) => {
    setShowQuantity((prev) => {
      const newCount = (prev[id] || 1) - 1;
      if (newCount <= 0) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return {
        ...prev,
        [id]: newCount,
      };
    });
  };  




  
  return (
    <ImageBackground
      source={require('../icons/masonbackground.jpeg')} 
      style={styles.container}
    >
    <View style={styles.container}>

      
    <ScrollView>
    <View style={styles.headerContainer}>
  {/* Back Button */}
  <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
  <Icon name="chevron-back" size={20} color="#333" style={{ marginRight: 6 }} />
    <Text style={styles.backButtonText}>Real Estate</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.rightCard} onPress={() => navigation.navigate('UploadDetailsScreen')}>
    <Text style={styles.cardText}>+ Add</Text>
  </TouchableOpacity>


  <TouchableOpacity style={styles.rightCard1}>
  <Icon name="location-outline" size={20} color="#fff" />
</TouchableOpacity>

</View>

    <View style={styles.section}>
  {subcategory.length > 0 ? (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.scrollContainer}
    >
      {subcategory.map((item) => ( 
        <TouchableOpacity 
          key={item.id} 
          onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
          style={styles.item}
        >
          <Image source={{ uri: item.image }} style={styles.image1} resizeMode="cover" />
          <Text style={styles.imageText}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  ) : (
    <Text>No products found</Text>
  )}
</View>


      <View style={styles.sectionHeader}>
      

       <TouchableOpacity style={styles.filterButton} onPress={handleOpenModal}>
        <Text style={styles.filterText}>Filter</Text>
      </TouchableOpacity>

    
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
    
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Filter By</Text>

            <ScrollView>
              
              <Text style={styles.optionTitle}>Brands</Text>
              <View style={styles.option}>
                {['Ramco', 'Priya Cement', 'UltraTech'].map((brand) => (
                  <TouchableOpacity key={brand} onPress={() => handleBrandSelect(brand)}>
                    <Text style={styles.optionText}>
                      {selectedBrands.includes(brand) ? '✔' : '✘'} {brand}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Price Range Option */}
              <Text style={styles.optionTitle}>Price Range</Text>
              <View style={styles.option}>
                <TouchableOpacity onPress={() => handlePriceRangeSelect('Low to High')}>
                  <Text style={styles.optionText}>
                    {selectedPriceRange === 'Low to High' ? '✔' : '✘'} Low to High
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePriceRangeSelect('High to Low')}>
                  <Text style={styles.optionText}>
                    {selectedPriceRange === 'High to Low' ? '✔' : '✘'} High to Low
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
           
      {selectedBrands.length > 0 && (
        <Text style={styles.selectedText}>Selected Brands: {selectedBrands.join(', ')}</Text>
      )}
      {selectedPriceRange && (
        <Text style={styles.selectedText}>Selected Price Range: {selectedPriceRange}</Text>
      )}

           
            <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

     
      </View>


  
      <View style={styles.imageRow}>
        {products.map((product) => (
          <View key={product.id} style={styles.productCard}>
    
    <TouchableOpacity onPress={() => ProducthandleOpenModal(product)}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
            </TouchableOpacity>

           
            <Text style={styles.productName}>{product.name}</Text>

          
            <View style={styles.priceContainer}>
                <Text style={styles.price}>₹{product.selling}</Text>
                <Text style={styles.oldPrice}>₹{product.market}</Text>
              </View>

           
            <Text style={styles.rating}>⭐⭐⭐⭐⭐</Text>

          
      <View>
      {!showQuantity[product.id] ? (
  <TouchableOpacity 
  style={styles.addButton} 
  onPress={() => handleIncrease(product.id)}
>
  <Text style={styles.addButtonText}>Add to Cart</Text>
</TouchableOpacity>

) : (
  <View style={styles.quantityControl}>
    <TouchableOpacity onPress={() => handleDecrease(product.id)} style={styles.quantityButton}>
      <Text style={styles.buttonText}>-</Text>
    </TouchableOpacity>
    <Text style={styles.quantityText}>{showQuantity[product.id]}</Text>
    <TouchableOpacity onPress={() => handleIncrease(product.id)} style={styles.quantityButton}>
      <Text style={styles.buttonText}>+</Text>
    </TouchableOpacity>
  </View>
)}
    </View>
            
          </View>
        ))}
      </View>
    </ScrollView>

   
      <Modal
        animationType="slide"
        transparent={true}
        visible={ProductmodalVisible}
        onRequestClose={ProducthandleCloseModal}
      >
        <View style={styles.ProductmodalContainer}>
          <View style={styles.ProductmodalContent}>
           
            <TouchableOpacity style={styles.closeButton} onPress={ProducthandleCloseModal}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            <View style={styles.modalcardContainer}>
            {selectedProduct && (
  <>
    <Image
      source={{ uri: selectedProduct.image }}
      style={styles.modalproductImage}
    />
    <View style={styles.modaldetailsContainer}>
    <Text style={styles.modalbrandName}>{selectedProduct.brand}</Text>
    <Text style={styles.modalproductName}>{selectedProduct.name}</Text>
   

    <View style={styles.modalpriceContainer}>
      <Text style={styles.modalcurrentPrice}>₹{selectedProduct.selling}</Text>
      <Text style={styles.modaloldPrice}>₹{selectedProduct.market}</Text>
    </View>

    <View style={styles.modalratingContainer}>
          <Text style={styles.modalratingStars}>⭐⭐⭐⭐⭐</Text>
          <Text style={styles.modalreviews}>2k reviews</Text>
        </View>

        
        <Text style={styles.modaldeliveryInfo}>Free Delivery Fee | 1hr</Text>
        <View>
  {!showQuantity[selectedProduct.id] ? (
    <TouchableOpacity 
      style={styles.modaladdButton} 
      onPress={() => handleIncrease(selectedProduct.id)}
    >
      <Text style={styles.modaladdButtonText}>Add to Cart</Text>
    </TouchableOpacity>
  ) : (
    <View style={styles.quantityControl}>
      <TouchableOpacity 
        onPress={() => handleDecrease(selectedProduct.id)} 
        style={styles.quantityButton}
      >
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.quantityText}>
        {showQuantity[selectedProduct.id]}
      </Text>
      <TouchableOpacity 
        onPress={() => handleIncrease(selectedProduct.id)} 
        style={styles.quantityButton}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  )}
</View>

        {/* Buttons */}
        <View style={styles.modalbuttonContainer}>
        <TouchableOpacity
  style={styles.modaldetailsButton}
  onPress={() => {
    ProducthandleCloseModal(); // close the modal first
    navigation.navigate('Product');
  }}
>
      <Text style={styles.modalbuttonText}>More Details</Text>
    </TouchableOpacity>
          <TouchableOpacity style={styles.modalorderButton}>
            <Text style={styles.modalbuttonText}>Bulk Order</Text>
          </TouchableOpacity>
          </View>

          </View>
  </>
)}
      
      </View>
          </View>
        </View>
      </Modal>

      
      {itemCount > 0 && (
  <View style={styles.footer}>
    <Text style={styles.itemCount}>
      {itemCount} item{itemCount > 1 ? 's' : ''} Selected
    </Text>
    <View>
    <TouchableOpacity
  style={styles.payButton}
  onPress={() => {
    const selectedItems = products.filter(item => (showQuantity[item.id] || 0) > 0).map(item => ({
      id: item.id,
      name: item.name,
      selling: item.selling,
      marketPrice: item.marketPrice,
      image: item.image,
      quantity: showQuantity[item.id],
    }));

    navigation.navigate('CartPage', { cartItems: selectedItems });
  }}
>
  <Text style={styles.payButtonText}>
    View Cart ₹{products.reduce((sum, item) => {
      const qty = showQuantity[item.id] || 0;
      return sum + item.selling * qty;
    }, 0).toFixed(2)}
  </Text>
</TouchableOpacity>

</View>

  </View>
)}

<View style={styles.spacer}>
               
            </View>

      
    </View>
    <View style={[styles.bottomNav]}>
      
        <TouchableOpacity
          style={[styles.navButton, isActiveRoute('DashboardPage') && styles.activeNavButton]}
          onPress={() => navigation.navigate('DashboardPage')}>
<Icon 
  name="home-outline" 
  size={30} 
  color={isActiveRoute('DashboardPage') ? "#d91f48" : "#1B1212"} 
/>
          <Text style={[styles.navText, isActiveRoute('DashboardPage') && styles.activeNavText]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, isActiveRoute('Creditfit') && styles.activeNavButton]}
          onPress={() => navigation.navigate("Creditfit")}>
          <Icon name="grid-outline" size={30} color={isActiveRoute('Creditfit') ? "#d91f48" : "#1B1212"} />
          <Text style={[styles.navText, isActiveRoute('Creditfit') && styles.activeNavText]}>Categories</Text>
        </TouchableOpacity>

        <View style={styles.spacer}>
               
            </View>

        <TouchableOpacity style={styles.qrcode}>
        <LottieView 
                source={require('../icons/Animation - 1744287970490.json')} 
                autoPlay
                loop
                style={styles.animation}
              />
        </TouchableOpacity>

        <View style={styles.spacer}>
               
            </View>


        <TouchableOpacity
          style={[styles.navButton, isActiveRoute('CreditReport') && styles.activeNavButton]}
          onPress={() => navigation.navigate('CreditReport')}>
          <Icon name="cart-outline" size={30} color={isActiveRoute('CreditReport') ? "#d91f48" : "#1B1212"} />
          <Text style={[styles.navText, isActiveRoute('CreditReport') && styles.activeNavText]}>Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, isActiveRoute('ProfilePage') && styles.activeNavButton]}
          onPress={() => navigation.navigate('ProfilePage')}>
          <Icon name="person-outline" size={30} color={isActiveRoute('ProfilePage') ? "#d91f48" : "#1B1212"} />
          <Text style={[styles.navText, isActiveRoute('ProfilePage') && styles.activeNavText]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  section: {
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginHorizontal: 10, 
    marginVertical: 20, 
},
item: {
  flexDirection: 'column',  
  alignItems: 'center',           
  justifyContent: 'center',     
  padding: 10,                    
},
image1: {
  width: 80,                     
  height: 60,                     
},
imageText: {
  fontSize: 14,             
  color: '#000',                
  textAlign: 'center',          
  marginTop: 5,                   
},
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryText: {
    marginTop: 4,
    fontSize: 14,
  },
  image1: {
    width: 40,
    height: 40,
    marginLeft:5,
  },
  image2: {
    width: 60,
    height: 50,
    marginLeft:5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 75,
  },
  filterText: {
    color: '#888',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    Color: '#f60138',
    marginRight:10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
  },
  option: {
    marginVertical: 10,
  },
  optionText: {
    fontSize: 16,
    paddingVertical: 8,
  },
  doneButton: {
    marginTop: 20,
    backgroundColor: '#f60138',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  ProductmodalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  ProductmodalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  productList: {
    paddingHorizontal: 16,
  },
  productCard: {
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: (screenWidth - 40) / 2,
  },
  productImage: {
    width: ((screenWidth - 40) / 2) * 0.8,
    height: ((screenWidth - 40) / 2) * 0.8,
    borderRadius: 10,
  },
  productName: {
    fontSize: responsiveFontSize(2), // ~16px on standard screen
    fontWeight: 'bold',
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
  },
  price: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: '#333',
    marginRight: responsiveWidth(1.5),
  },
  oldPrice: {
    fontSize: responsiveFontSize(1.8),
    textDecorationLine: 'line-through',
    color: '#999',
  },
  addButton: {
    backgroundColor: '#f60138',
    borderRadius: 10,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.2),
    marginTop: responsiveHeight(1.5),
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', 
  },
  
  qrFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  modalproductImage: {
    width: 120,
    height: 170,
    marginBottom: 10,
    alignSelf: 'center',
  },
  
  modaldetailsContainer: {
    flex: 3,
    paddingHorizontal: 8,
    marginLeft:2,
  },
  modalbrandName: {
    fontSize: 14,
    color: '#888',
  },
  modalproductName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  modalpriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalcurrentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e91e63',
    marginRight: 8,
  },
  modaloldPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#888',
  },
  modalratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  modalratingStars: {
    fontSize: 14,
    color: '#fdd835',
    marginRight: 8,
  },
  modalreviews: {
    fontSize: 12,
    color: '#888',
  },
  modaldeliveryInfo: {
    fontSize: 12,
    color: '#888',
    marginVertical: 5,
  },
  modalbuttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  modaldetailsButton: {
    backgroundColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  modalorderButton: {
    backgroundColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modalbuttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  modaladdButton: {
    backgroundColor: '#f60138',
    paddingVertical:8,
    paddingHorizontal: 18,
    borderRadius: 5,
    marginBottom:5,
    marginRight:15,
    width:120,
    borderRadius:10,
  },
  modaladdButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalcardContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    marginHorizontal: 15,
    marginVertical: 10,
    alignItems: 'center',
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    borderRadius: 10,
    width: 112,
    height: 35,
    borderWidth: 1,
    borderColor: "#f60138",
    backgroundColor: "#fff"
  },
  quantityButton: {
    width: 30,
    height: 33,
    borderRadius: 8,
    backgroundColor: "#FF5B61",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFf"
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10
  },  
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#f60138',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  itemCount: {
    fontSize: 16,
    fontWeight: 'bold',
     color: "#fff"
  },
  payButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  payButtonText: {
    color: '#f60138',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    position: 'relative', // important for QR button to position correctly
  },  
  navButton: {
    alignItems: "center",
    paddingVertical: 3,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  navText: {
    color: "#1B1212",
    fontSize: 12,
    marginTop: 4,
  },
  activeNavText: {
    color: "#d91f48",
  },
  qrcode: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#fff',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
    marginLeft: screenWidth * 0.41, 
  },
  image3: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  spacer: {
    height: 1,
  },
  animation: {
    width: 85,
    height: 110,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40, // status bar padding
    marginBottom: 10,
  },
  
  backButton: {
    flexDirection:'row',
    padding: 8,
    borderRadius: 10,
  },
  
  backButtonText: {
    color: '#333',
    fontSize: 18,
  },
  
  rightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f60138',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    marginLeft:130,
  },
  rightCard1: {
    width: 35,
    height: 35,
    borderRadius: 25,
    backgroundColor: '#f60138',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  
  mapIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  
  cardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },  
});

export default RealEstate;
