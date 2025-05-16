import React, { useState,useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch, FlatList, StyleSheet, Image,Modal,ImageBackground} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

const CartPage = ({ route }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [AddressmodalVisible, setAddressModalVisible] = useState(false);
  const [walletmodalVisible, setwalletModalVisible] = useState(false);
  const [selfPickup, setSelfPickup] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [finalAmount, setFinalAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [appliedCouponCode, setAppliedCouponCode] = useState(null);
  const [userId, setUserId] = useState(null);
  const [addresses, setAddresses] = useState([]);
const [selectedAddress, setSelectedAddress] = useState(null);
const navigation = useNavigation();




const [selectedCoupon, setSelectedCoupon] = useState(null);

useEffect(() => {
  const fetchUserId = async () => {
    const storedUserId = await AsyncStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(storedUserId);
      console.log(storedUserId)
    } else {
      console.warn('No user ID found');
    }
  };

  fetchUserId();
}, []);


const fetchCoupons = async () => {
  try {
    const userId = await AsyncStorage.getItem('user_id');
console.log("Retrieved userId:", userId);

    if (!userId) {
      console.warn('No user ID in storage');
      return;
    }

    const response = await fetch(`https://masonshop.in/api/coupons_customer?id=${userId}`,
       {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log("API Response:", data);

    if (Array.isArray(data) && data.length > 0) {
      setCoupons(data);
    } else {
      console.warn('No valid coupons found');
    }

  } catch (error) {
    console.error('Error fetching coupons:', error);
   
  }
};

useEffect(() => {
  fetchCoupons();
}, []);



  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    if (route.params?.cart) {
      setCart(route.params.cart);
      saveCart(route.params.cart);
    }
  }, [route.params?.cart]);
  

  const [cart, setCart] = useState([]);

const loadCart = async () => {
  try {
    const savedCart = await AsyncStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  } catch (error) {
    console.error("Error loading cart:", error);
  }
};

const saveCart = async (cartData) => {
  try {
    await AsyncStorage.setItem("cart", JSON.stringify(cartData));
  } catch (error) {
    console.error("Error saving cart:", error);
  }
};

const updateQuantity = (id, change) => {
  const updatedCart = cart
    .map(item => item.id === id ? { ...item, quantity: item.quantity + change } : item)
    .filter(item => item.quantity > 0);

  setCart(updatedCart);
  saveCart(updatedCart);
};

const getTotalPrice = () => {
  return cart.reduce((total, item) => total + (item.selling * item.quantity), 0);
};

const getTotalQuantity = () => {
  return cart.reduce((total, item) => total + (item.quantity), 0);
};


useEffect(() => {
  if (route.params?.cart) {
    const newCart = [...cart];
    route.params.cart.forEach((newItem) => {
      const index = newCart.findIndex((item) => item.id === newItem.id);
      if (index !== -1) {
        newCart[index].quantity += newItem.quantity;
      } else {
        newCart.push(newItem);
      }
    });
    setCart(newCart);
    saveCart(newCart);
  }
}, [route.params?.cart]);
  
  const increaseQuantity = async (itemId) => {
    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
    saveCart(updatedCart);
  };
  
  const decreaseQuantity = async (itemId) => {
    const updatedCart = cartItems
      .map((item) =>
        item.id === itemId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);
      
    setCartItems(updatedCart);
    saveCart(updatedCart);
  };
  
  const addToCart = async (newItem) => {
    try {
      const updatedCart = [...cartItems];
      const existingIndex = updatedCart.findIndex(item => item.id === newItem.id);
  
      if (existingIndex !== -1) {
        updatedCart[existingIndex].quantity += 1;
      } else {
        updatedCart.push({ ...newItem, quantity: 1 });
      }
  
      setCartItems(updatedCart);
      saveCart(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  
  
  const handleOpenModal = (coupon) => {
    setSelectedCoupon(coupon); // Set selected coupon data
    setModalVisible(true); // Open modal
  };
  
  const handleCloseModal = () => {
    setModalVisible(false); // Close modal
  };
  const handlewalletOpenModal = () => {
    setwalletModalVisible(true);
  };


  const handlewalletCloseModal = () => {
    setwalletModalVisible(false);
  };

  
 
  
  const handleApplyCoupon = async (couponCode) => {
    if (appliedCouponCode === couponCode) {
      setAppliedCouponCode(null);
      setDiscount(0);
      setFinalAmount(totalPrice); 
      setCouponApplied(false);
      return;
    }
    try {
      const userId = await AsyncStorage.getItem('user_id');
      console.log("Retrieved userd:", userId);
      if (!userId) {
        console.warn("No user ID found");
        return;
      }
  
      const totalPrice = getTotalPrice();
  
      const url = `https://masonshop.in/api/apply_coupson?id=${userId}&couponcode=${couponCode}&total=${totalPrice}`;
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const result = await response.json();
    console.log('Coupon response:', result);

    const discountAmount = result.discount || 0;

    setDiscount(discountAmount);
    setFinalAmount(totalPrice - discountAmount);
    setCouponApplied(true); 
    setAppliedCouponCode(couponCode);

  } catch (error) {
    console.error('Error applying coupon:', error);
  }
  };
  
  useEffect(() => {
    const total = getTotalPrice();
    
    if (couponApplied) {
      setFinalAmount(total - discount);
    } else {
      setFinalAmount(total);
    }
  }, [cart, couponApplied, discount]); 
  
  const handlePayment = async () => {
    try {
  
      const payload = {
        id: userId,  
        items: JSON.stringify(cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.selling,
        }))),
        total_price: getTotalPrice(),
        coupon_applied: couponApplied,
        coupon_code: appliedCouponCode,
        discount_amount: discount,
        wallet_amount_used: 50,
        gst_amount: 50,
        delivery_address: selectedAddress,
        self_pickup: selfPickup,
        final_amount: couponApplied ? finalAmount : getTotalPrice(),
      };
      
  
      sendOrderToAPI(payload,navigation);
      console.log(payload)
    
  
    } catch (error) {
      console.error('Error fetching userId:', error);

    }
  };
  

  const sendOrderToAPI = async (payload, navigation) => {
    try {
    
      const response = await fetch('https://masonshop.in/api/get_cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      // Parsing the response data as JSON
      const responseData = await response.json();
      console.log('API Response:', responseData); // Log the entire response to inspect
  
   
      if (
        responseData.success === true ||
        responseData.status === true ||
        responseData.success === 1
      ) {
        console.log('Order placed successfully');
        await AsyncStorage.removeItem('cart'); // Correct key!
        setCart([]);
        setCartItems([]);
        
        const { data } = responseData;
        
     
        const { created_at, final_amount, order_id, user_id, total_amount, discount_amount } = data;
        

        console.log('Extracted Data:', {
          created_at,
          final_amount,
          order_id,
          user_id,
          total_amount,
          discount_amount,
        });
  
        
        navigation.navigate('OrderConfirmedScreen', {
          created_at,
          final_amount,
          order_id,
          user_id,
          total_amount,
          discount_amount,
        });
      } else {
        
        const errorMsg = responseData.message || 'Something went wrong.';
        console.error('Order failed:', errorMsg);
      }
    } catch (error) {

      console.error('Error during API request:', error.message);
    }
  };
  
  useEffect(() => {
    const fetchUserIdAndAddresses = async () => {
      try {
        const response = await fetch(`https://masonshop.in/api/address-list?user_id=${userId}`);
        const data = await response.json();
        setAddresses(data);
        setSelectedAddress(data[0]);
        console.log(data);
      } catch (error) {
        console.error('Error fetching user ID or addresses:', error);
      }
    };
  
    fetchUserIdAndAddresses();
  }, [userId]); 
  


  // Handle address change
  const handleAddressChange = async (address) => {
    setSelectedAddress(address);
    await AsyncStorage.setItem('selectedAddress', JSON.stringify(address)); // Save the selected address
    setAddressModalVisible(false); 
  };
  
  
  
  
  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.quantityControl}>
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, -1)}
            style={styles.quantityButton}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, 1)}
            style={styles.quantityButton}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.itemPrice}>₹ {item.selling * item.quantity}</Text>
    </View>
  );
  
  return (
    <ImageBackground
      source={require('../icons/masonbackground.jpeg')}  // Replace with your background image URL
      style={styles.container}
    >
    <View>
        <ScrollView>
        
        <View style={styles.cardContainer} contentContainerStyle={{ flexGrow: 1 }}>
        <View>
  <ScrollView>
    <View>
      <View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      {cart.length === 0 ? (
        <View style={{ alignItems: "center" }}>
          <Text style={styles.emptyCartText}>Your cart is empty.</Text>
          <LottieView
            source={require("../icons/Animation - 1744276123206.json")}
            autoPlay
            loop
            style={styles.animation}
          />
        </View>
      ) : (
        <FlatList
          data={cart}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          contentContainerStyle={styles.cartList}
        />
      )}
        </ScrollView>
      </View>
    </View>


    <View style={styles.spacer}></View>
  </ScrollView>
</View>

  
  <View style={styles.actionButtons}>
    <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("DashboardPage")}>
      <Text style={styles.actionButtonText}>Add Items</Text>
    </TouchableOpacity>
    <View style={styles.spacer1}></View>
    <TouchableOpacity style={styles.actionButton} onPress={() => {
    navigation.navigate('Addresspage');
  }}>
      <Text style={styles.actionButtonText}>Clear Cart</Text>
    </TouchableOpacity>
  </View>


</View>


  
      <View style={styles.walletSection}>
      <View style={styles.cardContainer1}>
        <Text style={styles.walletBalance}>Mason Wallet Balance ₹1000.00</Text>
        <View style={styles.walletInput}>
          <TextInput placeholder="Enter Amount" style={styles.input} />
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>


 
      <View style={styles.couponCard}>
  {coupons.length === 0 ? (
    <Text>No Coupons Available</Text>
  ) : (
    <>
      {(expanded ? coupons : [coupons[0]]).map((coupon, index) => (
        <View key={index} style={styles.cardContainer2}>
          <TouchableOpacity onPress={() => handleOpenModal(coupon)} style={styles.row}>

            <View style={styles.couponLeft}>
            <Image source={require('../icons/couponimage.png')} style={styles.couponImage} resizeMode="contain" />
            <Text style={styles.couponDiscount}>{coupon.discount}</Text>
            <Text style={styles.couponExpiry}>{coupon.expiry}</Text>
            <View style={styles.badge}>
      <Text style={styles.badgeText}>2 Days Left</Text>
    </View>
          </View>

          <View style={styles.middleSection}>
          <Image source={require('../icons/couponsponser.png')} style={styles.companyLogo} resizeMode="contain" />
<Text style={styles.offerText}>Get 10% OFF On Orders Above ₹999</Text>
<Text style={styles.validityText}>Valid Till 09 May</Text>
</View>

<View style={styles.rightSection}>
<Text style={styles.offerType}>{coupon.coupon_type}</Text>
     <Text style={styles.discount}>₹ 500</Text>
    <Text style={styles.code}>{coupon.coupon_code}</Text>


    <TouchableOpacity
              style={[
                styles.getCodeButton,
                appliedCouponCode === coupon.coupon_code && styles.disabledButton,
              ]}
              onPress={() => handleApplyCoupon(coupon.coupon_code)}
            >
              <Text style={styles.getCodeButtonText}>
                {appliedCouponCode === coupon.coupon_code ? 'APPLIED' : 'APPLY'}
              </Text>
            </TouchableOpacity>
  </View>
          </TouchableOpacity>
        </View>
      ))}

      {coupons.length > 1 && (
        <TouchableOpacity style={styles.viewAllRow} onPress={() => setExpanded(!expanded)}>
          <Text style={styles.viewAllText}>
            {expanded ? 'Close' : 'View all coupons'}
          </Text>
          <Text style={styles.arrow}>{expanded ? '˄' : '›'}</Text>
        </TouchableOpacity>
      )}
    </>
  )}

  {/* Modal */}
  {selectedCoupon && (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{selectedCoupon.name}</Text>
            <Image source={{ uri: selectedCoupon.logo }} style={styles.logo} />
            <TouchableOpacity onPress={handleCloseModal}>
              <Text style={styles.closeButton}>X</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <TouchableOpacity style={styles.getCodeButton}>
              <Text style={styles.getCodeButtonText}>Get Code</Text>
            </TouchableOpacity>
            <Text style={styles.codeText}>Code: {selectedCoupon.coupon_code}</Text>
            <Text style={styles.title}>Free {selectedCoupon.name}</Text>
            <Text style={styles.description}>{selectedCoupon.coupon_type}</Text>

            <Text style={styles.discountText}>Discount: {selectedCoupon.discount}</Text>
            <Text style={styles.expiryText}>Expiry: {selectedCoupon.expiry}</Text>

            <View style={styles.detailsContainer}>
              <Text style={styles.detailsHeader}>Details</Text>
              {selectedCoupon.details?.map((detail, index) => (
                <Text key={index} style={styles.detailsItem}>• {detail}</Text>
              ))}
            </View>
          </ScrollView>

         

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.redeemButton}>
              <Text style={styles.redeemButtonText}>Redeem</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )}
</View>

 
 
<View style={styles.deliverySection}>
<View style={styles.cardContainer3}>
  <View style={styles.addressRow}>
  <Text style={styles.deliveryAddress}>
  <Text style={styles.boldText}>Deliver to: </Text>
  {selectedAddress ? `${selectedAddress.site_name}, ${selectedAddress.full_address}, ${selectedAddress.city}, ${selectedAddress.location}, ${selectedAddress.state}, ${selectedAddress.country}, ${selectedAddress.zip_code}, ${selectedAddress.phone}` : 'Loading...'}
</Text>

    <TouchableOpacity style={styles.changeButton} onPress={() => setAddressModalVisible(true)}>
      <Text style={styles.changeButtonText}>Change</Text>
    </TouchableOpacity>
  </View>
</View>


    
      <Modal
        visible={AddressmodalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent1}>
            <Text style={styles.modalTitle}>Select an Address</Text>
            {Array.isArray(addresses) && addresses.length > 0 ? (
              addresses.map((address, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.addressItem}
                  onPress={() => handleAddressChange(address)}
                >
                  <Text>{address.site_name},{address.full_address},{address.city},{address.location}, {address.zip_code},{address.state},{address.country},{address.phone}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text>No addresses available</Text>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={() => setAddressModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>

    
      <View style={styles.selfPickup}>
      <View style={styles.cardContainer1}>
        <Text>Self Pickup</Text>
        <Switch
        value={selfPickup}
        onValueChange={setSelfPickup}
        trackColor={{ false: '#d3d3d3', true: '#f60138' }}
        thumbColor={selfPickup ? '#ffffff' : '#f4f4f4'} />
        
        </View>
        </View>

         
         <View style={styles.card}>
                <Text style={styles.sectionTitle}>Delivery Instructions</Text>
                <View style={styles.deliveryOptions}>
                    <TouchableOpacity style={styles.option}>
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/854/854878.png' }}
                            style={styles.icon}
                        />
                        <Text style={styles.optionText}>Pin Location</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}>
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1484/1484892.png' }}
                            style={styles.icon}
                        />
                        <Text style={styles.optionText}>Site Address</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}>
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3595/3595455.png' }}
                            style={styles.icon}
                        />
                        <Text style={styles.optionText}>Tips To Delivery Partner</Text>
                    </TouchableOpacity>
                </View>
            </View>

       
            <View style={styles.card}>
                <TouchableOpacity onPress={handlewalletOpenModal}>
                <Text style={styles.sectionTitle}>Bill Details</Text>
                <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Total</Text>
                    <Text style={styles.billValue}>₹{getTotalPrice()}</Text>
                </View>
                <Text style={styles.transportFee}>
                    Transport fee (will deduct through offline)
                </Text>
                {couponApplied && (
  <View style={styles.billRow}>
    <Text style={styles.billLabel}>Coupon Applied</Text>
    <Text style={styles.billValue}>- ₹{discount}</Text>
  </View>
)}

                <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Masson Wallet</Text>
                    <Text style={styles.billValue}>- ₹50.00</Text>
                </View>
                <View style={styles.billRow}>
                    <Text style={styles.billLabel}>GST</Text>
                    <Text style={styles.billValue}>₹50.00</Text>
                </View>
                <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Sub Total</Text>
                    <Text style={styles.billValue}>₹500.00</Text>
                </View>

                <Modal
        animationType="slide"
        transparent={true}
        visible={walletmodalVisible}
        onRequestClose={handlewalletCloseModal}
      >
         <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        
                        <View style={styles.header}>
                            <Text style={styles.headerText}>Mason Wallet</Text>
                            <TouchableOpacity onPress={() => setwalletModalVisible(false)}>
                                <Text style={styles.closeButton}>X</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.walletcard}>
                            <Text style={styles.wallettext}>Wallet Amount</Text>
                            <Text style={styles.walletamount}>RS.10,000.00</Text>
                        </View>

                        <View style={styles.walletcard}>
                            <Text style={styles.wallettext}>Earnings</Text>
                            <Text style={styles.walletamount}>RS.20,000.00</Text>
                        </View>

                        <View style={styles.walletcard}>
                            <Text style={styles.wallettext}>Refrell</Text>
                            <Text style={styles.walletamount}>RS.30,000.00</Text>
                        </View>

                        <View style={styles.buttonContainer}>
                            
                            <TouchableOpacity style={styles.walletConfirmButton}>
                                <Text style={styles.redeemButtonText}>Confirm</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.walletCancelButton}>
                                <Text style={styles.walletButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
      </Modal>

                </TouchableOpacity>




            </View>

            


            
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Payment</Text>
                <View style={styles.paymentOptions}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/870/870140.png' }}
                        style={styles.paymentIcon}
                    />
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
                        style={styles.paymentIcon}
                    />
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3063/3063887.png' }}
                        style={styles.paymentIcon}
                    />
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/875/875610.png' }}
                        style={styles.paymentIcon}
                    />
                </View>
            </View>

            
            <View style={styles.card}>
                <Text style={styles.cancellationNote}>
                    <Text style={{ fontWeight: 'bold' }}>Note: </Text>
                    This order will not be refunded once you ordered. Check once when you place an
                    order <Text style={styles.link}>For More Details</Text>.
                </Text>
            </View>
      </ScrollView>

     
      {cart.length > 0 && (
  <View style={styles.footer}>
    <Text style={styles.itemCount}>{getTotalQuantity()} item Selected</Text>
    <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
      <Text style={styles.payButtonText}>
        Pay ₹{couponApplied ? finalAmount : getTotalPrice()}
      </Text>
    </TouchableOpacity>
  </View>
)}

      
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1,alignItems: 'center', },
  header: { flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: "#f8f8f8" },
  backButton: { fontSize: 18, marginRight: 10 },
  title: { fontSize: 18, fontWeight: "bold" },
  cartList: { padding: 10 },
  cartItem: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  itemImage: { width: 50, height: 50, marginRight: 10 },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 16 },
  quantityControl: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  quantityButton: { padding: 5, borderWidth: 1, borderColor: "#ccc", borderRadius: 5 },
  buttonText: { fontSize: 16 },
  quantityText: { marginHorizontal: 10 },
  itemPrice: { fontSize: 16, fontWeight: "bold" },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor:'white',
    borderRadius:25,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  disabledButton: {
    backgroundColor: 'transprant',
  },
  actionButton: { padding: 10, backgroundColor: "#f60138", borderRadius: 5 },
  actionButtonText: { color: "#fff" },
  walletSection: { padding: 10, backgroundColor: "#f8f8f8" },
  walletBalance: { fontSize: 16, marginBottom: 5,margin:6, },
  walletInput: { flexDirection: "row", alignItems: "center" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 5 },
  addButton: { marginLeft: 10, padding: 10, backgroundColor: "#f60138", borderRadius: 5 },
  addButtonText: { color: "#fff" },
  couponSection: { padding: 10, backgroundColor: "#f8f8f8", marginVertical: 10 },
  couponText: { fontSize: 16, fontWeight: "bold",marginLeft:6, },
  couponCode: { fontSize: 14, color: "#f60138",marginLeft:6, },
  deliverySection: { padding: 10, backgroundColor: "#f8f8f8" },
  deliveryAddress: { fontSize: 16 },
  changeButton: { marginTop: 5 },
  changeButtonText: { color: "#f60138" },
  selfPickup: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10, backgroundColor: "#f60138",width:420, },
  itemCount: { color: "#fff", fontSize: 18,fontWeight:'bold',marginLeft:10, },
  payButton: { backgroundColor: "#fff", padding: 10, borderRadius: 5 },
  payButtonText: { fontSize: 18, color: "#f60138" },
cardContainer: {
  backgroundColor: 'white',
  borderRadius: 12,
    margin:10,
    marginLeft:20,
    elevation: 9,
    padding: 10,
    width:380,
    height: 300,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
},
cardContainer1: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin:10,
    elevation: 5, // Shadow for Android
    padding: 10,
    width:380, // Adjust width as needed
    height: 90, // Adjust height as needed
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5, // Improves shadow effect on iOS
},
container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
},
openModalButton: {
    backgroundColor: '#e53935',
    padding: 15,
    borderRadius: 8,
},
openModalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    maxHeight: '80%',
},
header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
},
headerText: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
},
logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
},
closeButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
},
content: {
    paddingVertical: 10,
},
title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
},
description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
},
detailsContainer: {
    marginTop: 10,
},
detailsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
},
detailsItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
},
buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
},
getCodeButton: {
    backgroundColor: '#f60138',
    paddingVertical: 10,
    paddingHorizontal: 20,
    width:100,
    height:38,
    borderRadius: 25,
    marginLeft:270,
    marginTop:10,
},
getCodeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
},
redeemButton: {
    backgroundColor: '#f60138',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
},
redeemButtonText: {
    color: '#fff',
    fontWeight: 'bold',
},
card: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 15,
    width:380,
    marginLeft:20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
},
sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
},
deliveryOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
},
option: {
    alignItems: 'center',
    width: '30%',
},
icon: {
    width: 40,
    height: 40,
    marginBottom: 5,
},
optionText: {
    fontSize: 12,
    textAlign: 'center',
},
billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
},
billLabel: {
    fontSize: 14,
    color: '#333',
},
billValue: {
    fontSize: 14,
    fontWeight: 'bold',
},
transportFee: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
    marginLeft: 10,
},
paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
},
paymentIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
},
cancellationNote: {
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
},
link: {
    color: '#e53935',
    textDecorationLine: 'underline',
},
walletcard:{
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
},
wallettext:{
    fontWeight:'bold',
},
walletamount:{
    fontSize:15,
    marginTop:5,
},
walletConfirmButton:{
    backgroundColor: '#f60138',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,},

    walletCancelButton:{
        backgroundColor:'#f60138',
        paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    },
    walletButtonText:{
        color:'#ffff',
        fontWeight:'bold',
    },
    emptyCartText:{
      fontSize:20,
      fontWeight:'bold',
    },
    animation: {
      width: 180,
      height: 180,
      marginTop: 20,
    },
    spacer:{
      height:50,
    },
    spacer1:{
      width:180,
    },
    toggleText: {
      textAlign: 'center',
      color: '#007BFF',
      fontWeight: 'bold',
      fontSize: 16,
      marginTop: 8,
    },
    
    




    couponCard: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 10,
      margin: 18,
      elevation: 5, 
    width:380,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    },
    
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    
    viewAllRow: {
      borderTopWidth: 1,
      borderTopColor: '#eee',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    
    viewAllText: {
      fontWeight: '600',
      color: '#222',
    },
    
    arrow: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#444',
    },
    
    couponLeft: {
      flex: 1,
      padding: 12,
    },
    couponRight: {
      width: 140,
      padding: 12,
      borderLeftWidth: 1,
      borderLeftColor: '#eee',
      justifyContent: 'center',
    },
      
      leftSection: {
        width: '30%',
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: 10,
      },
      couponImage: {
        marginTop:20,
        width: 100,
        height: 100,
      },
      badge: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#ff5555',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
      },
      badgeText: {
        color: '#fff',
        fontSize: 10,
      },
      middleSection: {
        width: '40%',
        padding: 10,
        borderRightWidth: 1,
        borderRightColor: '#d3d3d3',
        justifyContent: 'center',
      },
      companyLogo: {
        width: 100,
        height: 40,
        marginBottom: 8,
      },
      offerText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
      },
      validityText: {
        fontSize: 12,
        color: 'gray',
      },
      rightSection: {
        width: '30%',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      offerType: {
        fontSize: 12,
        color: '#007bff',
        fontWeight: 'bold',
        marginBottom: 4,
      },
      discount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 4,
      },
      code: {
        fontSize: 12,
        color: '#555',
        marginBottom: 8,
      },
      getCodeButton: {
        backgroundColor: '#ff4444',
        paddingHorizontal: 15,
        paddingVertical: 6,
        borderRadius: 20,
      },
      getCodeButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
      },
      addressItem: {
        padding: 12,
        backgroundColor: '#f2b1b1',
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      modalContent1: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f60138',
        borderRadius: 5,
      },
      closeButtonText: {
        color: 'white',
        textAlign: 'center',
      },
      cardContainer3: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        margin: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#ddd',
      },
      deliveryAddress: {
        fontSize: 14,
        color: '#333',
        flex: 1,
        paddingRight: 10,
        lineHeight: 20,
      },      
      changeButton: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#ff4444', 
        borderRadius: 15,
      },
      changeButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
      },
      addressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      },
      boldText: {
        fontWeight: 'bold',
      },      
    });
    

export default CartPage;
