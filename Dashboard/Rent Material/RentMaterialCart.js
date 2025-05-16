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
const [selectedAmount, setSelectedAmount] = useState(null);
const [customAmount, setCustomAmount] = useState('');
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
    const savedCart = await AsyncStorage.getItem("rentmaterialcartItems");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
      console.log("rentcart",savedCart)
    }
  } catch (error) {
    console.error("Error loading cart:", error);
  }
};

const saveCart = async (cartData) => {
  try {
    await AsyncStorage.setItem("cartData", JSON.stringify(cartData));
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
  return cart.reduce((total, item) => total + item.quantity, 0);
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
  
  
  
  const handlePayment = async () => {
    try {
      const advanceAmountToSend = customAmount
        ? parseFloat(customAmount)
        : selectedAmount;
  
      const payload = {
        id: userId,
        items: JSON.stringify(cart.map(item => ({
          product_id: item.id,
          name: item.rmp_name,
          material_id: item.rmp_materail_id,
          per_price: item.selling,
          order_type: item.rentType,
          image: item.rmp_image,
          quantity: item.quantity,
          rentalType: item.rentalType,
          start_date: item.fromDate ? new Date(item.fromDate).toISOString() : null,
          end_date: item.toDate ? new Date(item.toDate).toISOString() : null,
          start_time: item.fromTime ? new Date(item.fromTime).toISOString() : null,
          end_time: item.toTime ? new Date(item.toTime).toISOString() : null,
          delivery_address: item.selectedAddress,
        }))),
        total_price: getTotalPrice(),
        final_amount: getTotalPrice(),
        advance_amount: advanceAmountToSend,  // 👈 Add this line
      };
  
      console.log("📦 Payload to be sent:", payload);
      await sendOrderToAPI(payload, navigation);
  
    } catch (error) {
      console.error('❌ Error preparing payload:', error);
    }
  };
  
  const sendOrderToAPI = async (payload, navigation) => {
    try {
      const response = await fetch('https://masonshop.in/api/ren_orders_get_cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const rawText = await response.text(); // Get raw response
      console.log('🔍 Raw API Response:', rawText);
  
      // Try to parse only if content is JSON
      const isJson = response.headers.get('content-type')?.includes('application/json');
      if (!isJson) {
        throw new Error('Response is not JSON. Check API URL or payload.');
      }
  
      const responseData = JSON.parse(rawText); // Now safely parse
      console.log('✅ Parsed Response:', responseData);
  
      // ... rest of your logic
    } catch (error) {
      console.error('❌ Error during API request:', error.message);
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
  
  
  
  
  const renderCartItem = ({ item }) => {
    const isRental = item.rmp_name !== undefined;
  
    // Set image and name based on whether it's a rental or regular product
    const image = isRental ? item.rmp_image : item.image;
    const name = isRental ? item.rmp_name : item.name;
    
    // Parse the selling price to ensure it's a number
    const price = parseFloat(item.selling);
    
    // Calculate total price for the item
    const totalPrice = price * item.quantity;

    // Log the relevant data for inspection
    console.log("Item:", item);
    console.log("Price:", price);
    console.log("Quantity:", item.quantity);
    console.log("Total Price:", totalPrice);
    console.log("Cart data from storage/API:", cart);

    const getCartItems = async () => {
      try {
        const cartItems = await AsyncStorage.getItem('cartItems');
        if (cartItems !== null) {
          // Parse the JSON string to an array or object
          const parsedCartItems = JSON.parse(cartItems);
          console.log('Retrieved cart items:', parsedCartItems);
          return parsedCartItems;
        } else {
          console.log('No cart items found in AsyncStorage');
          return [];
        }
      } catch (error) {
        console.error('Error retrieving cart items:', error);
        return [];
      }
    };

    
    
    

    return (
      <View style={styles.cartItem}>
        <Image source={{ uri: image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{name}</Text>
  
          {/* Additional info for rental items */}
          {isRental && <Text style={styles.rentalText}>Rental Item</Text>}
  
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
  
   
        <Text style={styles.itemPrice}>₹ {totalPrice}</Text>
  
      
        {isRental && (
          <Text style={styles.rentalPriceText}>₹ {price}</Text>
        )}
      </View>
    );
  };
  
  
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
<View style={styles.Overlay}>
    <View style={styles.Box}>
      <Text style={styles.Title}>Advance Payment</Text>

      {/* Amount Buttons */}
      <View style={styles.amountButtonContainer}>
        {[50, 100, 150, 200].map(amount => (
          <TouchableOpacity
            key={amount}
            style={selectedAmount === amount ? styles.amountButtonActive : styles.amountButton}
            onPress={() => {
              setSelectedAmount(amount);
              setCustomAmount('');
            }}
          >
           <Text
  style={[
    styles.amountText,
    selectedAmount === amount && styles.amountTextActive
  ]}
>
  ₹{amount}
</Text>

          </TouchableOpacity>
        ))}
      </View>

      {/* Custom Amount Input */}
      <TextInput
        style={styles.customInput}
        placeholder="Enter Custom Amount"
        keyboardType="numeric"
        value={customAmount}
        onChangeText={(text) => {
          setCustomAmount(text);
          setSelectedAmount(null);
        }}
      />
    </View>
  </View>


      </ScrollView>

     
     
      {cart.length > 0 && (
  <View style={styles.footer}>
    <Text style={styles.itemCount}>{getTotalQuantity()} item Selected</Text>
    <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
      <Text style={styles.payButtonText}>
      Pay ₹{Number(customAmount || selectedAmount || 0)}
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
    


      Overlay: {
  borderRadius: 12,
    margin:10,
    marginLeft:20,
    elevation: 9,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
      },
      Title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      amountButtonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15,
      },
      amountButton: {
        backgroundColor: '#f1f1f1',
        padding: 10,
        borderRadius: 10,
        margin: 5,
        width: '22%',
        alignItems: 'center',
      },
      amountButtonActive: {
        backgroundColor: '#E53935',
        padding: 10,
        borderRadius: 10,
        margin: 5,
        width: '22%',
        alignItems: 'center',
      },
      amountText: {
        color: '#000', 
        fontWeight: 'bold',
      },
      amountTextActive: {
        color: '#fff', 
      },  
      customInput: {
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        textAlign: 'center',
      },
      Box: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
      },     
    });
    

export default CartPage;
