import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,Modal,ImageBackground,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

const CementPage =({ navigation,item, increaseQuantity, decreaseQuantity  }) => {
  const route = useRoute();
  const { categoryId } = route.params || {};
  
  const [modalVisible, setModalVisible] = useState(false);
  const [ProductmodalVisible, setProductModalVisible] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [showQuantity, setShowQuantity] = useState(false);
  const [itemCount, setItemCount] = useState(0);


  const [products, setProducts] = useState([]);


  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    try {
      const response = await fetch(`https://masonshop.in/api/products?cid=${categoryId}`); // Correct format
      const data = await response.json();
      
      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
      } else if (Array.isArray(data)) {
        setProducts(data);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  


  const handleOpenModal = () => {
    setModalVisible(true);
  };


  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const ProducthandleOpenModal = () => {
    setProductModalVisible(true);
  };

  const ProducthandleCloseModal = () => {
    setProductModalVisible(false);
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

  const handleIncrease = () => {
    setItemCount(prev => prev + 1);
  };

  const handleDecrease = () => {
    setItemCount(prev => {
      const newCount = prev - 1;
      if (newCount === 0) {
        setShowQuantity(false); 
      }
      return Math.max(0, newCount);
    });
  };



  return (
    <ImageBackground
      source={require('../icons/masonbackground.jpeg')} 
      style={styles.container}
    >
    <View style={styles.container}>
    <ScrollView>

    <View style={styles.section}>
  {products.length > 0 ? (
    products.map((product) => (
      <TouchableOpacity 
        key={product.id} 
        onPress={() => navigation.navigate('ProductDetails', { productId: product.id })}
        style={styles.item}
      >
        <Image source={{ uri: product.image }} style={styles.image1} resizeMode="cover" />
        <Text style={styles.imageText}>{product.name}</Text>
      </TouchableOpacity>
    ))
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
  <View style={styles.productCard}>

      <TouchableOpacity onPress={ProducthandleOpenModal}>
      <Image
        source={require('../icons/Cement.jpg')}
        style={styles.productImage}
      />
      </TouchableOpacity>

      <Text style={styles.productName}>Ultratech OPC Cement</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>₹350</Text>
        <Text style={styles.oldPrice}>₹450</Text>
      </View>
      <Text style={styles.rating}>⭐⭐⭐⭐⭐</Text>

      <View>
      {!showQuantity ? (
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => {
            setShowQuantity(true);
            setItemCount(1);
          }}
        >
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.quantityControl}>
          <TouchableOpacity onPress={handleDecrease} style={styles.quantityButton}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{itemCount}</Text>
          <TouchableOpacity onPress={handleIncrease} style={styles.quantityButton}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
    </View>

    <View style={styles.productCard}>
  
      <TouchableOpacity onPress={ProducthandleOpenModal}>
      <Image
        source={require('../icons/Cement.jpg')} 
        style={styles.productImage}
      />
      </TouchableOpacity>

      
      <Text style={styles.productName}>Ultratech OPC Cement</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>₹350</Text>
        <Text style={styles.oldPrice}>₹450</Text>
      </View>
      <Text style={styles.rating}>⭐⭐⭐⭐⭐</Text>

     
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
    </View>



    <View style={styles.imageRow}>
  <View style={styles.productCard}>
      
      <TouchableOpacity onPress={ProducthandleOpenModal}>
      <Image
        source={require('../icons/Cement.jpg')} 
        style={styles.productImage}
      />
      </TouchableOpacity>

     
      <Text style={styles.productName}>Ultratech OPC Cement</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>₹350</Text>
        <Text style={styles.oldPrice}>₹450</Text>
      </View>
      <Text style={styles.rating}>⭐⭐⭐⭐⭐</Text>

   
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.productCard}>
      
      <TouchableOpacity onPress={ProducthandleOpenModal}>
      <Image
        source={require('../icons/Cement.jpg')}
        style={styles.productImage}
      />
      </TouchableOpacity>

      <Text style={styles.productName}>Ultratech OPC Cement</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>₹350</Text>
        <Text style={styles.oldPrice}>₹450</Text>
      </View>
      <Text style={styles.rating}>⭐⭐⭐⭐⭐</Text>

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
    </View>

    {/*Row 3*/}

    <View style={styles.imageRow}>
  <View style={styles.productCard}>
      {/* Product Image */}
      <TouchableOpacity onPress={ProducthandleOpenModal}>
      <Image
        source={require('../icons/Cement.jpg')} 
        style={styles.productImage}
      />
      </TouchableOpacity>

      
      <Text style={styles.productName}>Ultratech OPC Cement</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>₹350</Text>
        <Text style={styles.oldPrice}>₹450</Text>
      </View>
      <Text style={styles.rating}>⭐⭐⭐⭐⭐</Text>

    
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.productCard}>
    
      <TouchableOpacity onPress={ProducthandleOpenModal}>
      <Image
        source={require('../icons/Cement.jpg')}
        style={styles.productImage}
      />
      </TouchableOpacity>

      
      <Text style={styles.productName}>Ultratech OPC Cement</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>₹350</Text>
        <Text style={styles.oldPrice}>₹450</Text>
      </View>
      <Text style={styles.rating}>⭐⭐⭐⭐⭐</Text>

     
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
    </View>
    </ScrollView>
      

      <TouchableOpacity style={styles.qrFooter}>
      <Image
            source={require('../icons/Qr.jpg')}
            style={styles.image2}
        />
      </TouchableOpacity>
   
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
            <Image
        source={require('../icons/Cement.jpg')} 
        style={styles.modalproductImage}
      />
    
      <View style={styles.modaldetailsContainer}>
        <Text style={styles.modalbrandName}>Aditya Brila Cement</Text>
        <Text style={styles.modalproductName}>Ultratech OPC Cement</Text>


        <View style={styles.modalpriceContainer}>
          <Text style={styles.modalcurrentPrice}>₹350</Text>
          <Text style={styles.modaloldPrice}>₹450</Text>
        </View>

        <View style={styles.modalratingContainer}>
          <Text style={styles.modalratingStars}>⭐⭐⭐⭐⭐</Text>
          <Text style={styles.modalreviews}>2k reviews</Text>
        </View>

        {/* Delivery Info */}
        <Text style={styles.modaldeliveryInfo}>Free Delivery Fee | 1hr</Text>

        {/* Buttons */}
        <View style={styles.modalbuttonContainer}>
        <TouchableOpacity
      style={styles.modaldetailsButton}
      onPress={() => navigation.navigate('Product')}
    >
      <Text style={styles.modalbuttonText}>More Details</Text>
    </TouchableOpacity>
          <TouchableOpacity style={styles.modalorderButton}>
            <Text style={styles.modalbuttonText}>Bulk Order</Text>
          </TouchableOpacity>
        </View>
      </View>

     
      <TouchableOpacity style={styles.modaladdButton}>
        <Text style={styles.modaladdButtonText}>ADD</Text>
      </TouchableOpacity>
      </View>
          </View>
        </View>
      </Modal>
      {itemCount > 0 && (
        <View style={styles.footer}>
          <Text style={styles.itemCount}>{itemCount} item Selected</Text>
          <TouchableOpacity style={styles.payButton}>
            <Text style={styles.payButtonText}>View Cart ₹{itemCount * 350}.00</Text>
          </TouchableOpacity>
        </View>
      )}
      
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
  width: 60,                     
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    flex: 1,
    margin: 8,
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
    width:180,
  },
  productImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productPrice: {
    color: '#e91e63',
    fontWeight: 'bold',
    marginTop: 4,
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  addButton: {
    backgroundColor: '#f60138',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
},
  qrFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  modalproductImage: {
    width: 120,
    height: 200,
    marginBottom: 10,
    alignSelf: 'center', 
  },
  
  modaldetailsContainer: {
    flex: 3,
    paddingHorizontal: 10,
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
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom:50,
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
});

export default CementPage;
