import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,numColumns,ImageBackground,Dimensions,
  Alert,PixelRatio,isActiveRoute
} from 'react-native';
import axios from 'axios';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import { useRoute } from '@react-navigation/native';
const scaleFont = (size) => size * PixelRatio.getFontScale();
import Icon from "react-native-vector-icons/Ionicons";
import LottieView from 'lottie-react-native';
import { RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';




const DashboardPage = ({ navigation }) => {
  const [sliderImages, setSliderImages] = useState([]);
  const [advImages, setAdvImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeIndex1, setActiveIndex1] = useState(0);
  const flatListRef = useRef(null);
  const flatListRef2 = useRef(null);
  const [images, setImages] = useState([]);
  const scrollViewRef = useRef(null);
  const currentIndex = useRef(0);
  const [sponsors, setSponsors] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showQuantity, setShowQuantity] = useState([]); // ✅ safe default
  const itemCount = Object.values(showQuantity).reduce((sum, count) => sum + count, 0);
  const [showOthers, setShowOthers] = useState(false);

 

    const route = useRoute();
  
  const isActiveRoute = (routeName) => route.name === routeName;

  useEffect(() => {
    fetch("https://masonshop.in/api/slider_api")
      .then((response) => response.json())
      .then((data) => {
        if (data.slider) {
          const images = data.slider.map((item) => item.image);
          setSliderImages(images);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (sliderImages.length === 0 || activeIndex >= sliderImages.length) return;
  
    const interval = setInterval(() => {
      let nextIndex = (activeIndex + 1) % sliderImages.length;
      setActiveIndex(nextIndex);
  
      try {
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }
  
        if (flatListRef2.current && nextIndex < advImages.length) {
          flatListRef2.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }
      } catch (error) {
        console.warn("scrollToIndex error:", error);
      }
    }, 3000);
  
    return () => clearInterval(interval);
  }, [activeIndex, sliderImages, advImages]);
  

 const { width } = Dimensions.get("window");
  useEffect(() => {
    fetch("https://masonshop.in/api/adv_slider_api")
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response: ", data); 

        if (Array.isArray(data?.data)) {
          
    
          setImages(data?.data.map((item) => item.adv_image));
        } else if (data && data.adv_image) {
         
          setImages([data.adv_image]);
        } else {
          console.error("Invalid response structure:", data);
          setLoading(false); 
        }
        setLoading(false); 
      })
      .catch((error) => {
        console.error("Error fetching slider images:", error);
        setLoading(false); 
      });
  }, []);

  useEffect(() => {
    if (images.length === 0 || activeIndex >= images.length) return;

    const interval = setInterval(() => {
      if (scrollViewRef.current) {
        currentIndex.current = (currentIndex.current + 1) % images.length;
        setActiveIndex(currentIndex.current);
        scrollViewRef.current.scrollTo({
          x: currentIndex.current * width,
          animated: true,
        });
      }
    }, 3000); 

    return () => clearInterval(interval); 
  }, [images, activeIndex]);


  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setActiveIndex(index);
  };

  const handleScrollEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setActiveIndex(index);
  };


  useEffect(() => {
    fetch("https://masonshop.in/api/adv_brand_api")
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response: ", data);
  
        if (Array.isArray(data?.data)) {
          setSponsors(data?.data);
        } else if (data && data.advb_image) {
        
          setSponsors([{ adv_bimage: data.advb_image }]); 
        } else {
          console.error("Invalid response structure:", data);
          setLoading(false);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching slider images:", error);
        setLoading(false);
      });
  }, []);
  
  useEffect(() => {
    const fetchDataAndCart = async () => {
      try {
        const response = await fetch("https://masonshop.in/api/product_api");
        const data = await response.json();

        if (Array.isArray(data?.data)) {
          setProducts(data.data);
        } else {
          console.error("Invalid response structure:", data);
        }

        const savedCart = await AsyncStorage.getItem("cart");
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setShowQuantity(Array.isArray(parsedCart) ? parsedCart : []);
        }
      } catch (error) {
        console.error("Error fetching data or loading cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndCart();
  }, []);

  
  useEffect(() => {
    fetch("https://masonshop.in/api/category_api")
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response: ", data);
  
        if (Array.isArray(data?.data)) {
          console.log("Categories Data: ", data?.data);
          setCategories(data?.data);
        } else {
          console.error("Invalid response structure:", data);
          setLoading(false);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching slider images:", error);
        setLoading(false);
      });
  }, []);
  

  useEffect(() => {
    if (route.params?.clearCart) {
      setShowQuantity([]);
      saveCart([]);
    }
  }, [route.params?.clearCart]);

  const saveCart = async (cartData) => {
    try {
      await AsyncStorage.setItem("cart", JSON.stringify(cartData));
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

  const handleIncrease = (productId) => {
    setShowQuantity((prevCart) => {
      const updatedCart = prevCart.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveCart(updatedCart);
      return updatedCart;
    });
  };

  const handleDecrease = (productId) => {
    setShowQuantity((prevCart) => {
      const updatedCart = prevCart
        .map(item =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
        .filter(item => item.quantity > 0);

      saveCart(updatedCart);
      return updatedCart;
    });
  };

  const getQuantity = (productId) => {
    return showQuantity.find(item => item.id === productId)?.quantity || 0;
  };
 


  return (
    <ImageBackground
      source={require('./icons/masonbackground.jpeg')}  
      style={styles.container}
    >
    <ScrollView style={styles.container}>
   
      <View style={styles.header}>
      <View style={styles.imageContainer}>
      <View style={styles.imageContainer1}>
      
    <Text style={styles.officeText}>Office</Text>
    </View>
    <View style={styles.carticon}>
    <TouchableOpacity style={styles.card}>
      <Image
        source={require('../Dashboard/google-translate.png')}
        style={styles.image}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('CartPage')} style={styles.card}>
      <Image
        source={require('../Dashboard/Cart.png')}
        style={styles.image}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('ProfilePage')} style={styles.card}>
      <Image
        source={require('../Dashboard/Person.png')}
        style={styles.image}
      />
    </TouchableOpacity>
    </View>
  
    
  </View>
    <Text style={styles.addressText}> NO: X, ABC Street, Kodambakkam</Text>
  
</View>


<View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search" />
        <TouchableOpacity style={styles.searchButton}>
          <Text>🔍</Text>
        </TouchableOpacity>
      </View>


<View style={styles.carouselContainer}>
      <FlatList
        ref={flatListRef}
        data={sliderImages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image2} resizeMode="cover" />
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

    
      <View style={styles.pagination}>
        {sliderImages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>


 
      

     
    <View style={styles.section1}>
  {/* Title row with "Categories" on the left and "See All" on the right */}
  <View style={styles.headerRow1}>
    <Text style={styles.sectionTitle1}>Categories</Text>
    <TouchableOpacity onPress={() => navigation.navigate('CategoryList')}>
      <Text style={styles.seeAllText}>See All</Text>
    </TouchableOpacity>
  </View>

  {/* Horizontal scroll view for categories */}
  <ScrollView 
    horizontal 
    showsHorizontalScrollIndicator={false} 
    contentContainerStyle={styles.imageRow}
  >
    {categories.map((category) => (
      <View key={category.id} style={styles.cardContainer1}>
        <TouchableOpacity 
          onPress={() => {
            navigation.navigate('ProductsPage', { categoryId: category.id });
          }}
        >
          <Image source={{ uri: category.image }} style={styles.image1} resizeMode="cover" />
          <Text style={styles.imageText}>{category.name}</Text>
        </TouchableOpacity>
      </View>
    ))}
  </ScrollView>
</View>


      {/* Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Service</Text>
        <View style={styles.imageRow2}>
                <View style={styles.cardContainer2}>
                    <TouchableOpacity onPress={() => navigation.navigate('CouponPage')}>
                        <Image
                            source={require('../Dashboard/icons/promo-code.png')}
                            style={styles.image1}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageText}>Coupon</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContainer2}>
                    <TouchableOpacity onPress={() => navigation.navigate('CallDuty')}>
                        <Image
                            source={require('../Dashboard/icons/lorry.png')}
                            style={styles.image1}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageText}>Rent Vehicles</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContainer2}>
                    <TouchableOpacity onPress={() => navigation.navigate('RentMaterial')}>
                        <Image
                            source={require('../Dashboard/icons/raw-materials.png')}
                            style={styles.image1}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageText}>Rent Materials</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContainer2}>
                    <TouchableOpacity onPress={() => navigation.navigate('Dairy')}>
                        <Image
                            source={require('../Dashboard/icons/book.png')}
                            style={styles.image1}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageText}>Dairy</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.imageRow2}>
                <View style={styles.cardContainer2}>
                    <TouchableOpacity onPress={() => navigation.navigate('RealEstate')}>
                        <Image
                            source={require('../Dashboard/icons/property.png')}
                            style={styles.image1}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageText}>Real Estate</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContainer2}>
                    <TouchableOpacity onPress={() => navigation.navigate('PropertyDetailPage')}>
                        <Image
                            source={require('../Dashboard/icons/product.png')}
                            style={styles.image1}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageText}>Resale</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContainer2}>
                    <TouchableOpacity onPress={() => navigation.navigate('MyClient')}>
                        <Image
                            source={require('../Dashboard/icons/raw-materials.png')}
                            style={styles.image1}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageText}>Insurance</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContainer2}>
                    <TouchableOpacity onPress={() => navigation.navigate('DigitalVisitingCard')}>
                        <Image
                            source={require('../Dashboard/icons/book.png')}
                            style={styles.image1}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageText}>Visting Card</Text>
                    </TouchableOpacity>
                </View>
            </View>
      </View>
   
      <View style={styles.section}>
      <Text style={styles.sectionTitle}>Products</Text>
      <View style={styles.imageRow3}>
      {products.map((product) => (
        <View key={product.id} style={styles.productCard}>
          <TouchableOpacity onPress={() => console.log("Open modal", product)}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
          </TouchableOpacity>

          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{product.selling}</Text>
            <Text style={styles.oldPrice}>₹{product.market}</Text>
          </View>

          <Text style={styles.rating}>⭐⭐⭐⭐⭐</Text>

          {!showQuantity.some(item => item.id === product.id) ? (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addToCart(product)}
            >
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.quantityControl}>
              <TouchableOpacity onPress={() => handleDecrease(product.id)} style={styles.quantityButton}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{getQuantity(product.id)}</Text>
              <TouchableOpacity onPress={() => handleIncrease(product.id)} style={styles.quantityButton}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
      </View>
    </View>
    <View>

  
      {/* ScrollView for Images */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ width }}
        contentContainerStyle={{ alignItems: "center" }}
        onMomentumScrollEnd={handleScrollEnd} // Updates activeIndex
        scrollEventThrottle={16}
      >
        {images.map((image, index) => (
          <View key={index} style={{ width, justifyContent: "center", alignItems: "center" }}>
            <Image
              source={{ uri: image }}
              style={{
                width: width * 0.9,
                height: 200,
                borderRadius: 15,
              }}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>

      {/* Pagination */}
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>


    <View style={styles.container1}>
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {sponsors.map((item, index) => (
      <View key={index} style={styles.sponsorCard}>
        {item.adv_bimage ? (
          <Image source={{ uri: item.adv_bimage }} style={styles.sponsorImage} />
        ) : (
          <Text>No Image Available</Text>
        )}
      </View>
    ))}



  </ScrollView>


    
</View>


    </ScrollView>
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
                source={require('./icons/Animation - 1744287970490.json')} 
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
    padding: screenWidth * 0.04,
  },
  section1: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  headerRow1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle1: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    color: '#d91f48', 
  },
  carouselContainer: {
    height: screenHeight * 0.25, 
    marginBottom: 10,
    marginTop: 5,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  carouselImage: {
    width: screenWidth * 0.9, 
    height: '100%',
  },
  card: {
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    borderRadius: screenWidth * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d91f48',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  carticon: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 10,
    gap:5,
  },  
  card1: {
    width: screenWidth * 0.09,
    height: screenWidth * 0.09,
    borderRadius: screenWidth * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d91f48',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardContainer1: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d91f48',
    borderRadius: screenWidth * 0.12,
    elevation: 5,
    marginBottom: screenHeight * 0.015,
    padding: screenWidth * 0.02,
    width: screenWidth * 0.23,
    height: screenWidth * 0.24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    justifyContent: 'space-evenly',
    marginRight: screenWidth * 0.02,
  },
  cardContainer2: {
    backgroundColor: '#fff',
    borderRadius: screenWidth * 0.05,
    elevation: 5,
    marginBottom: screenHeight * 0.015,
    padding: screenWidth * 0.02,
    width: screenWidth * 0.22,
    height: screenWidth * 0.22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    marginRight: screenWidth * 0.02,
  },
  cardContainer3: {
    backgroundColor: '#fff',
    borderRadius: screenWidth * 0.04,
    elevation: 5,
    marginBottom: screenHeight * 0.015,
    padding: screenWidth * 0.03,
    width: screenWidth * 0.5,
    height: screenHeight * 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: screenWidth * 0.025,
  },
  imageRow2: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  image1: {
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    alignSelf: 'center',
  },
  imageTextmain: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: RFValue(16, screenHeight),
    marginBottom: '10%',
    color: '#fff',
  },
  imageText: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: RFValue(10, screenHeight),
    marginBottom: '10%',
    fontWeight: 'bold',
    color: '#000',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center', 
  },
  imageContainer1: {
    flexDirection: 'row',
    marginRight:160,
    alignItems: 'center', 
  },
  image: {
    width: '70%',
    height: '70%',
  },
  officeText: {
    fontSize: RFValue(18, screenHeight),
    fontWeight: 'bold',
  },
  
  addressText: {
    fontSize: RFValue(14, screenHeight),
    color: '#555',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: screenWidth * 0.04,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: screenWidth * 0.02,
    paddingHorizontal: screenWidth * 0.02,
  },
  searchButton: {
    marginLeft: screenWidth * 0.02,
    backgroundColor: '#d91f48',
    padding: screenWidth * 0.02,
    borderRadius: screenWidth * 0.02,
  },
  section: {
    marginVertical: 16,
    marginHorizontal:10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
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
  serviceItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  serviceIcon: {
    fontSize: 24,
  },
  serviceText: {
    marginTop: 4,
    fontSize: 14,
  },
  productCard: {
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: (screenWidth - 40) / 2,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    elevation: 2,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 18,
    marginBottom: 15,
    elevation: 2,
  },
  
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
    borderRadius: 8, 
  },
  
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  
  productPrice: {
    color: '#ff5252',
    marginBottom: 8,
  },
  
  addToCartButton: {
    backgroundColor: '#d91f48',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  
  addToCartText: {
    color: '#fff',
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  paymentLogo: {
    width: 50,
    height: 50,
    marginHorizontal: 8,
  },
  ProductCard: {
    backgroundColor: '#fff',
    borderRadius: screenWidth * 0.03, 
    padding: screenWidth * 0.04, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    margin: screenWidth * 0.03,
    width: screenWidth * 0.45, 
  },
  imageRow3: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  
  productImage: {
    width: screenWidth * 0.25, 
    height: screenWidth * 0.25, 
    marginBottom: screenHeight * 0.015, 
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },
  oldPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#999',
  },
  rating: {
    fontSize: 16,
    color: '#FFD700',
    marginVertical: 5,
  },
  addButton: {
    backgroundColor: '#f60138',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  addButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  carouselContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  image2: {
    width: screenWidth * 0.9,
    height: 200,
    borderRadius: 15,
    marginHorizontal: screenWidth * 0.05,
  },
  pagination: {
    flexDirection: "row",
    top:5,
    alignSelf: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "red",
  },
  inactiveDot: {
    backgroundColor: "gray",
    opacity: 0.4,
  },
  container1: {
    paddingVertical: 10,
  },
  sponsorCard: {
    marginHorizontal: 5,
    backgroundColor: '#D3D3D3',
    borderRadius: 10,
    padding: 6,
    alignItems: 'center',
  },
  sponsorImage: {
    width: 80,
    height: 50,
    resizeMode: 'contain',
    borderRadius:10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    position: 'relative',
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

});

export default DashboardPage;
