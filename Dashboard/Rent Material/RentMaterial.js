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
import DateTimePicker from '@react-native-community/datetimepicker';



const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CementPage =({ navigation,item, increaseQuantity, decreaseQuantity  }) => {
  const route = useRoute();
  const { categoryId } = route.params || {};

  const [userId, setUserId] = useState(null);
  const [AddressmodalVisible, setAddressModalVisible] = useState(false);
  
  const isActiveRoute = (routeName) => route.name === routeName;

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rentTypeModalVisible, setRentTypeModalVisible] = useState(false);
  const [rentalType, setRentalType] = useState('Days'); // default to 'Days'
  const [liked, setLiked] = useState(false);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [fromTime, setFromTime] = useState(null);
const [toTime, setToTime] = useState(null);
const [showFromTimePicker, setShowFromTimePicker] = useState(false);
const [showToTimePicker, setShowToTimePicker] = useState(false);
const [confirmModalVisible, setConfirmModalVisible] = useState(false);
const [selectedAmount, setSelectedAmount] = useState(null);
const [customAmount, setCustomAmount] = useState('');
const [paymentModalVisible, setPaymentModalVisible] = useState(false);


  const [modalVisible, setModalVisible] = useState(false);
  const [ProductmodalVisible, setProductModalVisible] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [showQuantity, setShowQuantity] = useState([]); 
  const itemCount = Array.isArray(showQuantity)
  ? showQuantity.reduce((sum, item) => sum + (item.quantity || 0), 0)
  : 0;

  const totalPrice = products?.reduce((total, product) => {
    const qty = showQuantity[product.id] || 0;
    return total + qty * product.selling;
  }, 0) || 0;
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
 
  
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
  
 

  const [products, setProducts] = useState([]);
  const [rentalmaterial, setRentalMaterial] = useState([]);
  const [cart, setCart] = useState([]);


  const fetchData = async () => {
    try {
      const response = await fetch('https://masonshop.in/api/rental-material-categories');
      const data = await response.json();
  
      console.log('API Response:', data);
  
      if (data.Rental_Material_categories && Array.isArray(data.Rental_Material_categories)) {
        setRentalMaterial(data.Rental_Material_categories);
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


  const fetchProductData = async () => {
    try {
      const response = await fetch('https://masonshop.in/api/rent_mat_product_api');
      const data = await response.json();
  
      console.log('API Response:', data);
  
      if (data.Rental_Material_products && Array.isArray(data.Rental_Material_products)) {
        setProducts(data.Rental_Material_products);
      } else {
        throw new Error('Invalid product response format');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProductData();
  }, []);
  
  useFocusEffect(
    React.useCallback(() => {
      loadCart(); // Reload cart from AsyncStorage
    }, [])
  );

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

  const handleIncrease = (productId) => {
    setShowQuantity((prevCart) => {
      const updatedCart = prevCart.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveCart(updatedCart);
      return updatedCart;
    });
  };


  useEffect(() => {
    if (route.params?.clearCart) {
      setShowQuantity([]);
      saveCart([]); 
    }
  }, [route.params?.clearCart]);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem("cartData");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setShowQuantity(parsedCart);
          console.log("cat",parsedCart)
        } else {
          setShowQuantity([]); 
        }
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      setShowQuantity([]); 
    }
  };
  
  

  const saveCart = async (cartData) => {
    try {
      await AsyncStorage.setItem("cartdata", JSON.stringify(cartData));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };


  const addToCart = (product) => {
    setShowQuantity((prevCart) => {
      const updatedCart = [...prevCart];
      const index = updatedCart.findIndex(item => item.id === product.id);
  
      if (index !== -1) {
        updatedCart[index].quantity += 1;
      } else {
        updatedCart.push({ ...product, quantity: 1 });
      }
  
      saveCart(updatedCart);
      return updatedCart;
    });
  };
  
  

  const handleDecrease = (productId) => {
    setShowQuantity((prevCart) => {
      const updatedCart = prevCart
        .map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter(item => item.quantity > 0);
      saveCart(updatedCart);
      return updatedCart;
    });
  };

  useEffect(() => {
    fetchData(); 
    loadCart(); 
  }, []);

 

  const handleRentNow = (product) => {
    setSelectedProduct(product);
    setRentTypeModalVisible(true);
    if (!selectedProduct) return;
  
    setShowQuantity((prevCart) => {
      const updatedCart = [...prevCart];
      const index = updatedCart.findIndex(item => item.id === selectedProduct.id);
  
      if (index !== -1) {
        updatedCart[index].quantity += 1;
      } else {
        updatedCart.push({ ...selectedProduct, quantity: 1, });
      }
  
      saveCart(updatedCart);
      return updatedCart;
    });
  
    setRentTypeModalVisible(false);     
    setSelectedProduct(null);            
    ProducthandleCloseModal(); 
  };
  
  const handleRentTypeSelection = (type) => {
    if (!selectedProduct) return;
  
    setShowQuantity((prevCart) => {
      const updatedCart = [...prevCart];
      const index = updatedCart.findIndex(item => item.id === selectedProduct.id);
  
      if (index !== -1) {
        updatedCart[index].quantity += 1;
      } else {
        updatedCart.push({ ...selectedProduct, quantity: 1, rentType: type });
      }
  
      saveCart(updatedCart); // Store in AsyncStorage
      return updatedCart;
    });
  
    setRentTypeModalVisible(false);     
    setSelectedProduct(null);            
    ProducthandleCloseModal();           
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
  
  
  
  
  


  
  return (
    <ImageBackground
      source={require('../icons/masonbackground.jpeg')} 
      style={styles.container}
    >
    <View style={styles.container}>

      
    <ScrollView>

    <View style={styles.section}>
      {rentalmaterial.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {rentalmaterial.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
              style={styles.item}
            >
              <Image
                source={{ uri: item.rmc_image }}
                style={styles.image1}
                resizeMode="cover"
              />
              <Text style={styles.imageText}>{item.rmc_name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <Text>No products found</Text>
      )}
    </View>



      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Products</Text>

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
              <Image source={{ uri: product.rmp_image }} style={styles.productImage} />
            </TouchableOpacity>

           
            <Text style={styles.productName}>{product.rmp_name}</Text>

          
            <View style={styles.priceContainer}>
                <Text style={styles.price}>₹{product.rmp_price_hour}/hr</Text>
                <Text style={styles.oldPrice}>₹{product.rmp_price_day}/day</Text>
              </View>

           
            <Text style={styles.rating}>⭐⭐⭐⭐⭐</Text>

          
            {!showQuantity.some(item => item.id === product.id) ? (
  <TouchableOpacity
    style={styles.addButton}
    onPress={() => ProducthandleOpenModal(product)}
  >
    <Text style={styles.addButtonText}>Rent Now</Text>
  </TouchableOpacity>
) : (
  <View style={styles.quantityControl}>
    <TouchableOpacity onPress={() => handleDecrease(product.id)} style={styles.quantityButton}>
      <Text style={styles.buttonText}>-</Text>
    </TouchableOpacity>
    <Text style={styles.quantityText}>
      {showQuantity.find(item => item.id === product.id)?.quantity}
    </Text>
    <TouchableOpacity onPress={() => handleIncrease(product.id)} style={styles.quantityButton}>
      <Text style={styles.buttonText}>+</Text>
    </TouchableOpacity>
  </View>
)}
{/* 
<Modal visible={rentTypeModalVisible} transparent animationType="slide">
  <View style={styles.modalrentContainer}>
    <View style={styles.modalrentContent}>
      <Text style={styles.modalrentContent1}>Select Rent Type</Text>

      <TouchableOpacity style={styles.modalrentbutton} onPress={() => handleRentTypeSelection('perHour')}>
        <Text style={styles.modaladdButtonText}>Per Hour</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.modalrentbutton} onPress={() => handleRentTypeSelection('perDay')}>
        <Text style={styles.modaladdButtonText}>Per Day</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal> */}
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
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>

      {/* Back Button and Icons */}
      <View style={styles.headerRow}>
  <TouchableOpacity onPress={ProducthandleCloseModal}>
    <Icon name="arrow-back" size={24} color="#000" />
  </TouchableOpacity>

  <View style={styles.iconGroup}>
  <TouchableOpacity onPress={() => setLiked(!liked)}>
  <Icon name={liked ? "heart" : "heart-outline"} size={22} color={liked ? "red" : "#000"} />
</TouchableOpacity>

    <TouchableOpacity>
      <Icon name="share-social-outline" size={22} color="#000" />
    </TouchableOpacity>
  </View>
</View>



      {/* Product Image */}
      <Image source={{ uri: selectedProduct?.rmp_image }} style={styles.productImage} />

      {/* Product Info */}
      <Text style={styles.productName}>{selectedProduct?.rmp_name}</Text>
      <Text style={styles.productLocation}>Chennai</Text>

      <View style={styles.priceContainer}>
                <Text style={styles.price}>₹{selectedProduct?.rmp_price_hour}/hr</Text>
                <Text style={styles.oldPrice}>₹{selectedProduct?.rmp_price_day}/day</Text>
              </View>

      {/* Toggle (Days / Hours) */}
<View style={styles.toggleContainer}>
  <TouchableOpacity
    style={rentalType === 'Days' ? styles.toggleActive : styles.toggleInactive}
    onPress={() => setRentalType('Days')}
  >
    <Text style={[
      styles.toggleText,
      rentalType === 'Days' && styles.toggleTextActive
    ]}>
      Days
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={rentalType === 'Hours' ? styles.toggleActive : styles.toggleInactive}
    onPress={() => setRentalType('Hours')}
  >
    <Text style={[
      styles.toggleText,
      rentalType === 'Hours' && styles.toggleTextActive
    ]}>
      Hours
    </Text>
  </TouchableOpacity>
</View>

{/* --- Show Date Pickers if "Days" is selected --- */}
{rentalType === 'Days' && (
  <>
    <View style={styles.dateRow}>
      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setShowFromPicker(true)}
      >
        <Text style={styles.dateText}>
          {fromDate ? fromDate.toLocaleDateString() : 'From Date'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setShowToPicker(true)}
      >
        <Text style={styles.dateText}>
          {toDate ? toDate.toLocaleDateString() : 'To Date'}
        </Text>
      </TouchableOpacity>
    </View>

    {showFromPicker && (
      <DateTimePicker
        value={fromDate || new Date()}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => {
          setShowFromPicker(false);
          if (selectedDate) setFromDate(selectedDate);
        }}
      />
    )}

    {showToPicker && (
      <DateTimePicker
        value={toDate || new Date()}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => {
          setShowToPicker(false);
          if (selectedDate) setToDate(selectedDate);
        }}
      />
    )}
  </>
)}

{/* --- Show Time Pickers if "Hours" is selected --- */}
{rentalType === 'Hours' && (
  <>
    <View style={styles.dateRow}>
      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setShowFromTimePicker(true)}
      >
        <Text style={styles.dateText}>
          {fromTime ? fromTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'From Time'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setShowToTimePicker(true)}
      >
        <Text style={styles.dateText}>
          {toTime ? toTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'To Time'}
        </Text>
      </TouchableOpacity>
    </View>

    {showFromTimePicker && (
      <DateTimePicker
        value={fromTime || new Date()}
        mode="time"
        display="default"
        onChange={(event, selectedTime) => {
          setShowFromTimePicker(false);
          if (selectedTime) setFromTime(selectedTime);
        }}
      />
    )}

    {showToTimePicker && (
      <DateTimePicker
        value={toTime || new Date()}
        mode="time"
        display="default"
        onChange={(event, selectedTime) => {
          setShowToTimePicker(false);
          if (selectedTime) setToTime(selectedTime);
        }}
      />
    )}
  </>
)}



      {/* Address Input */}
      <View style={styles.addressInput}>
        <Text style={styles.addressPlaceholder}  onPress={() => setAddressModalVisible(true)}>{selectedAddress ? `${selectedAddress.site_name}, ${selectedAddress.full_address}, ${selectedAddress.city}, ${selectedAddress.location}, ${selectedAddress.state}, ${selectedAddress.country}, ${selectedAddress.zip_code}, ${selectedAddress.phone}` : 'Loading...'}</Text>
        <TouchableOpacity>
          <Text style={styles.plusButton} onPress={() => setAddressModalVisible(true)}>+</Text>
        </TouchableOpacity>
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

      {/* Rent Button */}
      <TouchableOpacity 
  style={styles.rentButton}
  onPress={() => setConfirmModalVisible(true)}
>
  <Text style={styles.rentButtonText}>Rent Now</Text>
</TouchableOpacity>
<Modal
  animationType="slide"
  transparent={true}
  visible={confirmModalVisible}
  onRequestClose={() => setConfirmModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>
      <Text style={styles.modalTitle}>Verification</Text>
      <Text style={styles.modalMessage}>
        Your Vehicle Rental Is Confirmed. Please Review All Details Carefully And Let Us Know Before Proceeding.
      </Text>

      <TouchableOpacity
  style={styles.modalContinueButton}
  onPress={() => {
    setConfirmModalVisible(false);
    setTimeout(() => handleRentNow(selectedProduct), 200);
  }}
  
>
  <Text style={styles.modalContinueText}>Continue</Text>
</TouchableOpacity>


      <TouchableOpacity
        style={styles.modalCancelButton}
        onPress={() => setConfirmModalVisible(false)}
      >
        <Text style={styles.modalCancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

<Modal
  animationType="slide"
  transparent={true}
  visible={paymentModalVisible}
  onRequestClose={() => setPaymentModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>
      <Text style={styles.modalTitle}>Payment</Text>

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

      {/* Pay Button */}
      <TouchableOpacity
        style={styles.payButton}
        onPress={() => {
          const finalAmount = customAmount || selectedAmount;
          if (!finalAmount) return alert("Please select or enter an amount");

          // Proceed to payment logic here
          console.log("Paying ₹" + finalAmount);
          setPaymentModalVisible(false);
        }}
      >
        <Text style={styles.payButtonText}>Pay</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


    </View>
  </View>
</Modal>

      {itemCount > 0 && (
  <View style={styles.footer}>
    <Text style={styles.itemCount}>
      {itemCount} item{itemCount > 1 ? 's' : ''} Selected
    </Text>
    <TouchableOpacity
  style={styles.payButton}
  onPress={async () => {
    const selectedItems = showQuantity.map(item => {
      const price = item.rentType === 'perHour' ? item.rmp_price_hour : item.rmp_price_day;
    
      return {
        id: item.id,
        name: item.rmp_name,
        material_id:item.rmp_materail_id,
        selling: price,            
        rentType: item.rentType,
        image: item.rmp_image,
        quantity: item.quantity,
        rentalType,
    fromDate: fromDate ? fromDate.toISOString() : null,
    toDate: toDate ? toDate.toISOString() : null,
    fromTime: fromTime ? fromTime.toISOString() : null,
    toTime: toTime ? toTime.toISOString() : null,
    selectedAddress,
      }; 
    });
    
    console.log('Saving items to AsyncStorage:', selectedItems); 

    try {
      await AsyncStorage.setItem('rentmaterialcartItems', JSON.stringify(selectedItems));
      navigation.navigate('RentMaterialCart');
    } catch (error) {
      console.error('Error saving to AsyncStorage:', error);
    }
  }}
>
  <Text style={styles.payButtonText}>
    View Cart ₹{showQuantity.reduce((sum, item) => {
      const price = item.rentType === 'perHour' ? item.rmp_price_hour : item.rmp_price_day;
      return sum + price * item.quantity;
    }, 0).toFixed(2)}
  </Text>
</TouchableOpacity>
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
  modalrentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  modalrentContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalrentContent1: {
    fontWeight:'bold',
    marginBottom:10,
  },
  modalrentbutton:{
    backgroundColor: '#f60138',
    borderRadius: 10,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.2),
    marginTop: responsiveHeight(1.5),
  },


///////////////////////
  
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  
  backButton: {
    fontSize: 24,
    color: '#333',
  },
  
  iconGroup: {
    flexDirection: 'row',
    gap: 15,
  },
  
  icon: {
    fontSize: 20,
  },
  
  productImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  
  productLocation: {
    color: '#777',
    marginBottom: 10,
  },
  
  toggleContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 30,
  },
  
  toggleActive: {
    backgroundColor: '#e53935',
    padding: 8,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  
  toggleInactive: {
    padding: 8,
    paddingHorizontal: 20,
    color:'#000',
  },
  
  toggleText: {
    fontSize: 16,
    color: '#000', // default black
    fontWeight: '500',
  },
  
  toggleTextActive: {
    color: '#fff', // white when active
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },
  
  dateInput: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  
  dateText: {
    color: '#777',
  },
  
  addressInput: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginVertical: 10,
  },
  
  addressPlaceholder: {
    color: '#777',
  },
  
  plusButton: {
    fontSize: 18,
    color: '#e53935',
  },
  
  rentButton: {
    backgroundColor: '#e53935',
    padding: 15,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  
  rentButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  addressItem: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  modalBox: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalContinueButton: {
    backgroundColor: '#E53935',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 15,
    marginBottom: 10,
  },
  modalContinueText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalCancelButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 15,
  },
  modalCancelText: {
    color: '#333',
    fontWeight: 'bold',
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
});

export default CementPage;
