import React, { useState,useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch, FlatList, StyleSheet, Image,Modal,ImageBackground, } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
const CartPage = ({ route,navigation}) => {
    const [modalVisible, setModalVisible] = useState(false);
  const [walletmodalVisible, setwalletModalVisible] = useState(false);
  const [selfPickup, setSelfPickup] = useState(false);
  const [cartItems, setCartItems] = useState([]);

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
  
  
  const handleOpenModal = () => {
    setModalVisible(true);
  };


  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const handlewalletOpenModal = () => {
    setwalletModalVisible(true);
  };


  const handlewalletCloseModal = () => {
    setwalletModalVisible(false);
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
    <TouchableOpacity style={styles.actionButton}>
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
     
     
      <View style={styles.couponSection}>
      <TouchableOpacity onPress={handleOpenModal}>
      <View style={styles.cardContainer1}>
        <Text style={styles.couponText}>Coupon</Text>
        <Text>Gift card valued at 500 or 10% off at McDonald's</Text>
        <Text style={styles.couponCode}>XXRVT678</Text>
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
         <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.headerText}>McDonald's</Text>
                            <Image
                                source={{
                                    uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/McDonald%27s_Golden_Arches.svg/512px-McDonald%27s_Golden_Arches.svg.png',
                                }}
                                style={styles.logo}
                            />
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeButton}>X</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Content */}
                        <ScrollView contentContainerStyle={styles.content}>
                        <TouchableOpacity style={styles.getCodeButton}>
                                <Text style={styles.getCodeButtonText}>Get Code</Text>
                            </TouchableOpacity>
                            <Text style={styles.title}>Free McDonald’s</Text>
                            <Text style={styles.description}>
                                Gift card valued at 500 or 10% off at McDonald’s
                            </Text>

                            <View style={styles.detailsContainer}>
                                <Text style={styles.detailsHeader}>Details</Text>
                                <Text style={styles.detailsItem}>
                                    • Expires on December 3, 2024.
                                </Text>
                                <Text style={styles.detailsItem}>
                                    • Convenience Charges of Rs 45 applicable at the time of Checkout.
                                </Text>
                                <Text style={styles.detailsItem}>
                                    • Buy one get one can be availed on Burger + Softdrinks.
                                </Text>
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
        </View>
         </TouchableOpacity>
      </View>

      
      <View style={styles.deliverySection}>
      <View style={styles.cardContainer1}>
        <Text style={styles.deliveryAddress}>Delivery Address: NO:X ABC Street,Kodambakkam</Text>
        <TouchableOpacity style={styles.changeButton}>
          <Text style={styles.changeButtonText}>+ Add Change</Text>
        </TouchableOpacity>
        </View>
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

     
      <View style={styles.footer}>
        <Text style={styles.itemCount}>{getTotalQuantity()} item Selected</Text>
        <TouchableOpacity style={styles.payButton}>
          <Text style={styles.payButtonText}>Pay ₹{getTotalPrice()}</Text>
        </TouchableOpacity>
      </View>
      
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
    borderRadius: 25,
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
    borderRadius: 25,
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
    
});

export default CartPage;




