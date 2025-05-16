import React, { useState,useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,Linking,
  TextInput,Modal,ImageBackground,Dimensions,ActivityIndicator
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';




const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const Dairy =({ navigation,item, increaseQuantity, decreaseQuantity  }) => {
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
  const [selectedCategoryname, setSelectedCategoryname] = useState(null);
 
  
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
  const [dairy, setDairy] = useState([]);
  const [cart, setCart] = useState([]);
  const [allProducts, setAllProducts] = useState([]);



  const fetchData = async () => {
    try {
      const response = await fetch('https://masonshop.in/api/Category_dairy');
      const data = await response.json();
      if (data.Diary_category && Array.isArray(data.Diary_category)) {
        setDairy(data.Diary_category);
      }
    } catch (err) {
      console.error('Error fetching category data:', err);
    }
  };

  const fetchProductData = async (category_name = null, selectedDistrict = null, selectedCity = null) => {
    try {
      let response;

      if (selectedCity) {
        response = await fetch(`https://masonshop.in/api/fetch_diary_city?city=${selectedCity}`);
      } else if (selectedDistrict) {
        response = await fetch(`https://masonshop.in/api/fetch_diary_district?district=${selectedDistrict}`);
      } else if (category_name) {
        response = await fetch(`https://masonshop.in/api/fetchDiarycat_name?cat_name=${category_name}`);
      } else {
        response = await fetch('https://masonshop.in/api/fetch_diary');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.Diary && Array.isArray(data.Diary)) {
        setProducts(data.Diary);
      } else {
        console.warn('Invalid response format:', data);
      }
    } catch (err) {
      console.error('Error fetching product data:', err);
    }
  };
  
  
  
  useEffect(() => {
    fetchData();
    fetchProductData(); 
  }, []);




 
  const handleOpenModal = () => {
    setModalVisible(true);
  };


  const handleCloseModal = () => {
    setModalVisible(false);
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
    if (!selectedDistrict ) {
      alert("Please select both district and city.");
      return;
    }
  
    setModalVisible(false);
    console.log("Selected District:", selectedDistrict);
    console.log("Selected City:", selectedCity);
  
    fetchProductData(null, selectedDistrict, selectedCity);
  };
  
  useEffect(() => {
    fetchData(); 
  
  }, []);

 
  
  const makeCall = (number) => {
    if (number) {
      Linking.openURL(`tel:${number}`);
    } else {
      console.warn('Phone number is missing');
    }
  };
  
  const openWhatsApp = (number) => {
    if (number) {
      const url = `https://wa.me/${number.replace('+', '')}`;
      Linking.openURL(url);
    } else {
      console.warn('WhatsApp number is missing');
    }
  };
  
  const openLocation = (location) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${location}`;
    Linking.openURL(url);
  };

  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [loadingDistricts, setLoadingDistricts] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);

  const fetchDistricts = async () => {
    try {
      const res = await fetch('https://masonshop.in/api/district_db_api');
      const json = await res.json();
      setDistricts(json.district || []);

     
    } catch (err) {
      console.error('Failed to fetch districts:', err);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const fetchCities = async (districtId) => {
    console.log('District ID for city fetch:', districtId);
    setLoadingCities(true);
    try {
      const res = await fetch(`https://masonshop.in/api/city_db_api?district=${districtId}`);
      const json = await res.json();

  
   
      const citiesList = json.cities || [];
      setCities(citiesList);

      console.log(citiesList)
    } catch (err) {
      console.error('Failed to fetch cities:', err);
    } finally {
      setLoadingCities(false);
    }
  };
  

  useEffect(() => {
    fetchDistricts();
  }, []);

  const clearFilter = () => {
    setSelectedDistrict('');
    setSelectedCity('');
    setCities([]);
    fetchProductData(); // fetch default unfiltered data
    setModalVisible(false); // optional: close the modal if needed
  };
  
  
  return (
    <ImageBackground
      source={require('../icons/masonbackground.jpeg')} 
      style={styles.container}
    >
    <View style={styles.container}>

      
    <ScrollView>

    <View style={styles.section}>
          {dairy.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
              <TouchableOpacity onPress={() => {
                fetchProductData(); 
              }} style={styles.item}>
              </TouchableOpacity>

              {dairy.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    fetchProductData(item.category_name);
                  }}
                  style={styles.item}
                >
                  <Image source={{ uri: item.category_image }} style={styles.image1} resizeMode="cover" />
                  <Text style={styles.imageText}>{item.category_name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text>No categories found</Text>
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

            <View style={styles.dropdownWrapper2}> 
    <Text style={styles.label}>Select District:</Text>
{loadingDistricts ? (
  <ActivityIndicator size="large" color="#0000ff" />
) : (
  <View style={styles.pickerContainer}>
    <Picker
      selectedValue={selectedDistrict}
      onValueChange={(itemValue) => {
        setSelectedDistrict(itemValue);
        const district = districts.find(d => d.district === itemValue);
        if (district) {
          fetchCities(district.id);
        }
      }}
      style={styles.picker}
    >
      <Picker.Item label="-- Select District --" value="" />
      {districts.map((district, index) => (
        <Picker.Item key={index} label={district.district} value={district.district} />
      ))}
    </Picker>
  </View>
)}

{selectedDistrict !== '' && (
  <>
    <Text style={styles.label}>Select City:</Text>
    {loadingCities ? (
      <ActivityIndicator size="small" color="#0000ff" />
    ) : (
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCity}
          onValueChange={(itemValue) => setSelectedCity(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="-- Select City --" value="" />
          {cities.map((city, index) => (
            <Picker.Item key={index} label={city.city} value={city.city} />
          ))}
        </Picker>
      </View>
    )}
  </>
)}
    </View>

    <TouchableOpacity style={styles.clearButton} onPress={clearFilter}>
  <Text style={styles.clearButtonText}>Clear Filter</Text>
</TouchableOpacity>


           
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
    
    <TouchableOpacity>
              <Image source={{ uri: product.logo }} style={styles.productImage} />
            </TouchableOpacity>

           
            <Text style={styles.productName}>{product.name}</Text>

            <Text style={styles.services}>{product.cat_name}</Text>
      <Text style={styles.ratingLocation}>
      {product.avg_star}<Text style={styles.star}></Text> {product.city}
      </Text>
      <View style={styles.iconRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => openWhatsApp(product.whatsapp_num)}>
          <Icon name="logo-whatsapp" size={20} color="#25D366" />
          <Text style={styles.iconText}>Whatsapp</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => makeCall(product.mobile_num)}>
          <Icon name="call" size={20} color="#D32F2F" />
          <Text style={styles.iconText}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => openLocation(product.location)}>
          <Icon name="location" size={20} color="#F44336" />
          <Text style={styles.iconText}>Location</Text>
        </TouchableOpacity>
      </View>

           
  <TouchableOpacity
    style={styles.addButton}
  >
    <Text style={styles.addButtonText}>Digital Visiting Card</Text>
  </TouchableOpacity>
</View>
        ))}
      </View>
    </ScrollView>

   
   
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
  width: 90,                     
  height: 80,                     
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
    width: 70,
    height: 70,
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
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  iconButton: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  iconText: {
    fontSize: 12,
    marginTop: 4,
    color: '#444',
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
  clearButton: {
    backgroundColor: '#ccc',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.5),
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
    marginTop: 2,
    padding: 10,
    backgroundColor: '#f60138',
    borderRadius: 5,
    marginLeft:300,
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
  services: {
    fontSize: 16,
    color: '#666',
    marginVertical: 4,
  },
  ratingLocation: {
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
  },
  star: {
    color: '#FFD700',
  },
  dropdownWrapper2: {
    width: '98%',
  },
});

export default Dairy;
