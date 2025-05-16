import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,Dimensions,ImageBackground,Image,ActivityIndicator
} from 'react-native';
import { useNavigation,useRoute } from '@react-navigation/native';
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import { SelectList } from 'react-native-dropdown-select-list';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from "react-native-vector-icons/Ionicons";
import {launchImageLibrary} from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const UploadDetailsScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('images');
  const [memberId, setMemberId] = useState(null);
  const [propertyId, setPropertyId] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
  const [type, setType] = useState(' ');
  const [furnishing, setFurnishing] = useState('');
  const [constructionStatus, setConstructionStatus] = useState('');
  const [listedBy, setListedBy] = useState('');
  const [rentSell, setRentSell] = useState('');
  const [bhk, setBhk] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [carParking, setCarParking] = useState('');
  const [superBuiltup, setSuperBuiltup] = useState('');
  const [carpetArea, setCarpetArea] = useState('');
  const [maintenance, setMaintenance] = useState('');
  const [totalFloors, setTotalFloors] = useState('');
  const [floorNo, setFloorNo] = useState('');
  const [facing, setFacing] = useState('');
  const [projectName, setProjectName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [plotType, setPlotType] = useState('');
  const [landArea, setLandArea] = useState('');
const [length, setLength] = useState('');
const [breadth, setBreadth] = useState('');
const [mealsincluded, setMealsIncluded] = useState('');
const [doorNo, setDoorNo] = useState('');
const [streetName, setStreetName] = useState('');
const [area, setArea] = useState('');
const [landmark, setLandmark] = useState('');
const [pincode, setPincode] = useState('');
const [city, setCity] = useState('');
const [stateName, setStateName] = useState('');
const [selectedImage, setSelectedMedia] = useState(null);
const [galleryImages, setGalleryImages] = useState('');
const [galleryVideos, setGalleryVideos] = useState('');


  const propertyTypes = ['Individual Villa', 'Plots','Office','PG & Guest House','Lands', 'House', 'Apartment','Shop',];

  const rentSellOptions = [
    { key: '1', value: 'Rent' },
    { key: '2', value: 'Sale' },
    { key: '3', value: 'Lease' },
  ];

  const bhkOptions = [
    { key: '1', value: '1 BHK' },
    { key: '2', value: '2 BHK' },
    { key: '3', value: '3 BHK' },
    { key: '4', value: '4 BHK' },
    { key: '4', value: '4+ BHK' },
  ];

  const bathroomOptions = [
    { key: '1', value: '1' },
    { key: '2', value: '2' },
    { key: '3', value: '3' },
    { key: '4', value: '4' },
    { key: '5', value: '4+' },
  ];

  const carParkingOptions = [
    { key: '1', value: '0' },
    { key: '2', value: '1' },
    { key: '3', value: '2' },
    { key: '4', value: '3' },
    { key: '5', value: '4' },
    { key: '6', value: '4+' },
  ];

  const facingOptions = [
    { key: '1', value: 'East' },
    { key: '2', value: 'North' },
    { key: '3', value: 'North-East' },
    { key: '4', value: 'North-West' },
    { key: '5', value: 'South' },
    { key: '6', value: 'South-East' },
    { key: '7', value: 'South-West' },
    { key: '8', value: 'West' },
  ];
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedId = await AsyncStorage.getItem('user_id');
        if (storedId) {
          console.log('Member ID from AsyncStorage:', storedId);
          setMemberId(storedId); 
        } else {
          console.log('Member ID not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  const postPropertyData = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }

    
  
    try {
      const response = await fetch('https://masonshop.in/api/uploadsAds_1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: type,
          sale_or_rent: rentSell,
          bedrooms: bhk,
          bathrooms: bathrooms,
          carparking: carParking,
          furnishing: furnishing,
          construction_status: constructionStatus,
          listed_by: listedBy,
          super_builtup_area: superBuiltup,
          carpet_area: carpetArea,
          maintenance: maintenance,
          total_floors: totalFloors,
          floor_no: floorNo,
          facing: facing,
          project_name: projectName,
          add_title: title,
          description: description,
          plot_type: plotType,
          plot_area: landArea,
          length: length,
          breadth: breadth,
          meals: mealsincluded,
          price: price,
          user_id: memberId,
        }),
      });
  
      const data = await response.json();
      console.log('Upload response:', data);
  
      if (response.ok) {
        alert('Property posted successfully!');

        const propertyId = data.property_id || data.id;
        if (propertyId) {
          await AsyncStorage.setItem('propertyId', propertyId.toString());
          console.log('Product ID saved to AsyncStorage:', propertyId);
        }
      } else {
        alert(`Upload failed: ${data?.message || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error');
    }
  };

  const PropertyAddressData = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
    try {
      const storedId = await AsyncStorage.getItem('propertyId');
  
      if (!storedId) {
        alert('Property ID not found. Please upload property details first.');
        return;
      }
  
      const response = await fetch('https://masonshop.in/api/uploadsAds_2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          door_no: doorNo,
          street_name: streetName,
          area: area,
          city: selectedCity,
          district:selectedDistrict,
          state: stateName,
          pincode: pincode,
          landmark: landmark,
          user_id: memberId,
          property_id: storedId,
        }),
      });
  
      const data = await response.json();
      console.log('Upload response:', data);
  
      if (response.ok) {
        alert('Property address posted successfully!');
      } else {
        alert(`Upload failed: ${data?.message || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error');
    }
  };

  const handleMediaPick = () => {
    launchImageLibrary({ mediaType: 'mixed', selectionLimit: 0 }, (response) => {
      if (response.didCancel || response.errorCode) return;
  
      const files = response.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.fileName || `${asset.type?.startsWith('video') ? 'video' : 'image'}_${Date.now()}`,
        type: asset.type,
      }));
  
      setSelectedMedia(files); // rename state if needed
    });
  };


  const GalleryhandleMediaPick = () => {
    launchImageLibrary({ mediaType: 'mixed', selectionLimit: 0 }, (response) => {
      if (response.didCancel || response.errorCode) return;
  
      const files = response.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.fileName || `${asset.type?.startsWith('video') ? 'video' : 'image'}_${Date.now()}`,
        type: asset.type,
      }));
  
      setGalleryImages(files);
     
    });
  };

  const VideohandleMediaPick = () => {
    launchImageLibrary({ mediaType: 'mixed', selectionLimit: 0 }, (response) => {
      if (response.didCancel || response.errorCode) return;
  
      const files = response.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.fileName || `${asset.type?.startsWith('video') ? 'video' : 'image'}_${Date.now()}`,
        type: asset.type,
      }));
  
      setGalleryVideos(files);
     
    });
  };
  
  
  const handleSubmit = async () => {
    if (selectedImage.length === 0) {
      alert('Please select images');
      return;
    }
  
    try {
      const user_id = await AsyncStorage.getItem('user_id');
      const property_id = await AsyncStorage.getItem('propertyId');
  
      if (!user_id || !property_id) {
        alert('User ID or Property ID missing');
        return;
      }
  
      const formData = new FormData();
      console.log('FormData:', formData);
      selectedImage.forEach(img => console.log('Image:', img));
      selectedImage.forEach((img, index) => {
        formData.append('images[]', {
          uri: img.uri,
          name: img.name,
          type: img.type,
        });
      });
  
      formData.append('user_id', user_id);
      formData.append('property_id', property_id);
  
      const res = await axios.post(
        'https://masonshop.in/api/uploadsAds_3',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      console.log('Uploaded:', res.data);
      alert('Images uploaded successfully!');
      navigation.navigate('PropertyDetailPage');
    } catch (err) {
      console.log('Error:', err.response?.data || err.message);
      alert('Upload failed');
    }
  };
  const route = useRoute();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.editMode) {
        setCurrentStep(3);
      }
    });
  
    return unsubscribe;
  }, [navigation, route.params]);

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

  
  return (
    <ImageBackground
    source={require('../icons/masonbackground.jpeg')}  
    style={styles.container}
  >
    <ScrollView contentContainerStyle={styles.container}>

    <View style={styles.tabContainer}>

  <View style={styles.tabItem}>
    <View style={currentStep > 1 ? styles.completedCircle1 : currentStep === 1 ? styles.activeCircle1 : styles.circle1}>
      <Text style={styles.circleText}>
      {currentStep > 1 ? (
      <Image
        source={require('../icons/checkmark.png')} 
        style={styles.tickImage}
      />
    ) : (
      <Text style={styles.circleText}>1</Text>
    )}
      </Text>
    </View>
    <Text style={styles.tabLabel}>Upload Details</Text>
  </View>

 
  <View style={[styles.line, currentStep >= 2 && { backgroundColor: 'red' }]} />

  {/* Step 2 */}
  <View style={styles.tabItem}>
    <View style={currentStep > 2 ? styles.completedCircle : currentStep === 2 ? styles.activeCircle : styles.circle}>
      <Text style={styles.circleText}>
        {currentStep > 2 ? (
      <Image
        source={require('../icons/checkmark.png')} 
        style={styles.tickImage}
      />
    ) : (
      <Text style={styles.circleText}>2</Text>
    )}
      </Text>
    </View>
    <Text style={styles.tabLabel}>Address</Text>
  </View>

  {/* Line after Step 2 */}
  <View style={[styles.line, currentStep === 3 && { backgroundColor: 'red' }]} />

  {/* Step 3 */}
  <View style={styles.tabItem}>
    <View style={currentStep === 3 ? styles.activeCircle : styles.circle}>
      <Text style={styles.circleText}>3</Text>
    </View>
    <Text style={styles.tabLabel}>Gallery</Text>
  </View>
</View>


{currentStep === 1 && (
  <View>
        <View style={styles.uploadcontainer}>
      
      <Text style={styles.heading}>Select Property Type</Text>

      <View style={styles.buttonGroup}>
        
      {propertyTypes.map((item) => (
          <TouchableOpacity

            key={item}
            style={[styles.button, type === item && styles.selectedButton]}
            onPress={() => setType(item)}
          >
            <Text style={type === item ? styles.selectedButtonText : styles.buttonText}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      </View>
      
      {['Apartment', 'Individual Villa', 'House'].includes(type) &&(
  <>
   {/* Dropdowns */}
   <View style={styles.card}>
   <Text style={styles.heading}>Upload Property Details</Text>
   <View style={styles.row}>
        <View style={styles.dropdownWrapper}>
          
          <SelectList
            arrowicon={<Text style={{ fontSize: 12, color: '#aaa',backgroundColor: '#F8F8F8',
                borderRadius: 10,
                height:20,
                marginLeft:15,
                paddingHorizontal: 6,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.2, 
                shadowRadius: 8,
                elevation: 10, 
                borderWidth: 0, }}>▼</Text>}
            setSelected={setRentSell}
            data={rentSellOptions}
            save="value"
            search={false}
            placeholder="Rent / Sale "
            placeholderTextColor="#888" // light gray or any color you want
  style={{ borderWidth: 1, padding: 10 }}
            boxStyles={styles.selectBox}
            inputStyles={styles.selectInput}
            dropdownStyles={styles.dropdown}
            dropdownTextStyles={styles.dropdownText}
          />
        </View>
        <View style={styles.dropdownWrapper}>
          <SelectList
          arrowicon={<Text style={{ fontSize: 12, color: '#aaa',backgroundColor: '#F8F8F8',
            borderRadius: 10,
            height:20,
            left:10,
            paddingHorizontal: 6,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.2, 
            shadowRadius: 8,
            elevation: 10, 
            borderWidth: 0, }}>▼</Text>}
            setSelected={setBhk}
            data={bhkOptions}
            save="value"
            search={false}
            placeholder="BHK "
            placeholderTextColor="#888" // light gray or any color you want
  style={{ borderWidth: 1, padding: 10 }}
            boxStyles={styles.selectBox}
            inputStyles={styles.selectInput}
            dropdownStyles={styles.dropdown}
            dropdownTextStyles={styles.dropdownText}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.dropdownWrapper}>
          <SelectList
            arrowicon={<Text style={{ fontSize: 12, color: '#aaa',backgroundColor: '#F8F8F8',
                borderRadius: 10,
                height:20,
                marginLeft:15,
                paddingHorizontal: 6,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.2, 
                shadowRadius: 8,
                elevation: 10, 
                borderWidth: 0, }}>▼</Text>}
            setSelected={setBathrooms}
            data={bathroomOptions}
            save="value"
            search={false}
            placeholder="Bathrooms"
            boxStyles={styles.selectBox}
            inputStyles={styles.selectInput}
            dropdownStyles={styles.dropdown}
            dropdownTextStyles={styles.dropdownText}
          />
        </View>
        <View style={styles.dropdownWrapper}>
          <SelectList
          arrowicon={<Text style={{ fontSize: 12, color: '#aaa',backgroundColor: '#F8F8F8',
            borderRadius: 10,
            height:20,
            marginLeft:15,
            paddingHorizontal: 6,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.2, 
            shadowRadius: 8,
            elevation: 10, 
            borderWidth: 0, }}>▼</Text>}
            setSelected={setCarParking}
            data={carParkingOptions}
            save="value"
            search={false}
            placeholder="Car Parking"
            boxStyles={styles.selectBox}
            inputStyles={styles.selectInput}
            dropdownStyles={styles.dropdown}
            dropdownTextStyles={styles.dropdownText}
          />
        </View>
      </View>

      {/* Furnishing */}
      <Text style={styles.label}>Furnishing <Text style={styles.required}>*</Text></Text>
      <View style={styles.buttonGroup}>
        {['Furnished', 'Semi-Furnished', 'Un-Furnished'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.button, furnishing === item && styles.selectedButton]}
            onPress={() => setFurnishing(item)}
          >
            <Text style={furnishing === item ? styles.selectedButtonText : styles.buttonText}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Construction Status */}
      <Text style={styles.label}>Construction Status <Text style={styles.required}>*</Text></Text>
      <View style={styles.buttonGroup}>
        {['New Launch', 'Ready To Move', 'Under Construction'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.button, constructionStatus === item && styles.selectedButton]}
            onPress={() => setConstructionStatus(item)}
          >
            <Text style={constructionStatus === item ? styles.selectedButtonText : styles.buttonText}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Listed By */}
      <Text style={styles.label}>Listed by <Text style={styles.required}>*</Text></Text>
      <View style={styles.buttonGroup}>
        {['Builder', 'Dealer', 'Owner'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.button, listedBy === item && styles.selectedButton]}
            onPress={() => setListedBy(item)}
          >
            <Text style={listedBy === item ? styles.selectedButtonText : styles.buttonText}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Text Inputs */}
      <Text style={styles.label}>Super Buildup area sq ft <Text style={styles.required}>*</Text></Text>
      <TextInput
        placeholder=" "
        value={superBuiltup}
        onChangeText={setSuperBuiltup}
        style={styles.input}
      />
       <Text style={styles.label}>Carpet Area sqft <Text style={styles.required}>*</Text></Text>
      <TextInput
        placeholder=" "
        value={carpetArea}
        onChangeText={setCarpetArea}
        style={styles.input}
      />
       <Text style={styles.label}>Maintenance (Monthly) </Text>
      <TextInput
        placeholder=" "
        value={maintenance}
        onChangeText={setMaintenance}
        style={styles.input}
      />
      <View style={styles.row}>
        <TextInput
          placeholder="Total Floors"
          placeholderTextColor="#888" 
          value={totalFloors}
          onChangeText={setTotalFloors}
          style={styles.input}
        />
        <TextInput
          placeholder="Floor No "
          placeholderTextColor="#888"
          value={floorNo}
          onChangeText={setFloorNo}
          style={styles.input}
        />
      </View>
      <View style={styles.dropdownWrapper1}>
          <SelectList
          arrowicon={<Text style={{ fontSize: 12, color: '#aaa',backgroundColor: '#F8F8F8',
            borderRadius: 10,
            height:20,
            marginLeft:15,
            paddingHorizontal: 6,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.2, 
            shadowRadius: 8,
            elevation: 10, 
            borderWidth: 0, }}>▼</Text>}
            setSelected={setFacing}
            data={facingOptions}
            save="value"
            search={false}
            placeholder="Facing"
            placeholderTextColor="#888"
            boxStyles={styles.selectBox}
            inputStyles={styles.selectInput}
            dropdownStyles={styles.dropdown}
            dropdownTextStyles={styles.dropdownText}
          />
        </View>
      <Text style={styles.label}>Project Name </Text>
      <TextInput
        placeholder=" "
        value={projectName}
        onChangeText={setProjectName}
        style={styles.input}
      />

      <Text style={styles.label}>Add title <Text style={styles.required}>*</Text></Text>
      <Text style={styles.labelText}>Mention the key festures of your item (eg, brand, model, age,type)</Text>
      <TextInput
        placeholder=" "
        value={title}
        onChangeText={setTitle}
        style={styles.input1}
        maxLength={70}
      />
      <Text style={styles.label}>Description <Text style={styles.required}>*</Text> </Text>
      <TextInput
        placeholder=" "
        value={description}
        onChangeText={setDescription}
        style={styles.textArea}
        multiline
        numberOfLines={4}
        maxLength={100}
      />

<Text style={styles.label}>Set A Price <Text style={styles.required}>*</Text></Text>
      <TextInput
        placeholder="₹"
        placeholderTextColor="#888"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        keyboardType="numeric"
      />
      </View>
  </>

)}



{['Lands', 'Plots'].includes(type) && (
  <>
    <View style={styles.card}>
    <Text style={styles.heading}>Upload Property Details</Text>
 <View style={styles.dropdownWrapper}>
          <SelectList
            arrowicon={<Text style={{ fontSize: 12, color: '#aaa',backgroundColor: '#F8F8F8',
                borderRadius: 10,
                height:20,
                marginLeft:15,
                paddingHorizontal: 6,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.2, 
                shadowRadius: 8,
                elevation: 10, 
                borderWidth: 0, }}>▼</Text>}
            setSelected={setRentSell}
            data={rentSellOptions}
            save="value"
            search={false}
            placeholder="Rent / Sale "
            boxStyles={styles.selectBox}
            inputStyles={styles.selectInput}
            dropdownStyles={styles.dropdown}
            dropdownTextStyles={styles.dropdownText}
          />
        </View>


    {/* Plot Type */}
    <Text style={styles.label}>Plot Type <Text style={styles.required}>*</Text></Text>
    <View style={styles.buttonGroup}>
      {['Residential', 'Commercial', 'Agricultural', 'Industrial'].map((item) => (
        <TouchableOpacity
          key={item}
          style={[styles.button, plotType === item && styles.selectedButton]}
          onPress={() => setPlotType(item)}
        >
          <Text style={plotType === item ? styles.selectedButtonText : styles.buttonText}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    {/* Listed by */}
    <Text style={styles.label}>Listed by <Text style={styles.required}>*</Text></Text>
    <View style={styles.buttonGroup}>
      {['Builder', 'Dealer', 'Owner'].map((item) => (
        <TouchableOpacity
          key={item}
          style={[styles.button, listedBy === item && styles.selectedButton]}
          onPress={() => setListedBy(item)}
        >
          <Text style={listedBy === item ? styles.selectedButtonText : styles.buttonText}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    {/* Inputs */}
    <Text style={styles.label}>Land Area (In Sq.Ft)</Text>
    <TextInput
      value={landArea}
      onChangeText={setLandArea}
      style={styles.input}
    />

    <Text style={styles.label}>Length <Text style={styles.required}>*</Text></Text>
    <TextInput
      value={length}
      onChangeText={setLength}
      style={styles.input}
    />

    <Text style={styles.label}>Breadth <Text style={styles.required}>*</Text></Text>
    <TextInput
      value={breadth}
      onChangeText={setBreadth}
      style={styles.input}
    />

    <Text style={styles.label}>Project Name <Text style={styles.required}>*</Text></Text>
    <TextInput
      value={projectName}
      onChangeText={setProjectName}
      style={styles.input}
    />

    <Text style={styles.label}>Add title <Text style={styles.required}>*</Text></Text>
    <TextInput
      placeholder="Add Title"
      value={title}
      onChangeText={setTitle}
      style={styles.input1}
      maxLength={70}
    />

    <Text style={styles.label}>Description <Text style={styles.required}>*</Text></Text>
    <TextInput
      placeholder="Description"
      value={description}
      onChangeText={setDescription}
      style={styles.textArea}
      multiline
      numberOfLines={4}
      maxLength={100}
    />

<Text style={styles.label}>Set A Price <Text style={styles.required}>*</Text></Text>
      <TextInput
        placeholder="₹"
        placeholderTextColor="#888"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        keyboardType="numeric"
      />
    </View>
  </>
)}


{['Office', 'Shop'].includes(type) &&(
  <>
   <View style={styles.card}>
   <Text style={styles.heading}>Upload Property Details</Text>
   {/* Dropdowns */}
   <View style={styles.row}>
        <View style={styles.dropdownWrapper}>
          <SelectList
            arrowicon={<Text style={{ fontSize: 12, color: '#aaa',backgroundColor: '#F8F8F8',
                borderRadius: 10,
                height:20,
                marginLeft:15,
                paddingHorizontal: 6,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.2, 
                shadowRadius: 8,
                elevation: 10, 
                borderWidth: 0, }}>▼</Text>}
            setSelected={setRentSell}
            data={rentSellOptions}
            save="value"
            search={false}
            placeholder="Rent / Sale "
            boxStyles={styles.selectBox}
            inputStyles={styles.selectInput}
            dropdownStyles={styles.dropdown}
            dropdownTextStyles={styles.dropdownText}
          />
        </View>
        
     

      
        <View style={styles.dropdownWrapper}>
          <SelectList
            arrowicon={<Text style={{ fontSize: 12, color: '#aaa',backgroundColor: '#F8F8F8',
                borderRadius: 10,
                height:20,
                marginLeft:15,
                paddingHorizontal: 6,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.2, 
                shadowRadius: 8,
                elevation: 10, 
                borderWidth: 0, }}>▼</Text>}
            setSelected={setBathrooms}
            data={bathroomOptions}
            save="value"
            search={false}
            placeholder="Bathrooms"
            boxStyles={styles.selectBox}
            inputStyles={styles.selectInput}
            dropdownStyles={styles.dropdown}
            dropdownTextStyles={styles.dropdownText}
          />
        </View>
        </View>

      
        <View style={styles.dropdownWrapper}>
          <SelectList
          arrowicon={<Text style={{ fontSize: 12, color: '#aaa',backgroundColor: '#F8F8F8',
            borderRadius: 10,
            height:20,
            marginLeft:15,
            paddingHorizontal: 6,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.2, 
            shadowRadius: 8,
            elevation: 10, 
            borderWidth: 0, }}>▼</Text>}
            setSelected={setCarParking}
            data={carParkingOptions}
            save="value"
            search={false}
            placeholder="Car Parking"
            boxStyles={styles.selectBox}
            inputStyles={styles.selectInput}
            dropdownStyles={styles.dropdown}
            dropdownTextStyles={styles.dropdownText}
          />
        </View>
     

      {/* Furnishing */}
      <Text style={styles.label}>Furnishing <Text style={styles.required}>*</Text></Text>
      <View style={styles.buttonGroup}>
        {['Furnished', 'Semi-Furnished', 'Un-Furnished'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.button, furnishing === item && styles.selectedButton]}
            onPress={() => setFurnishing(item)}
          >
            <Text style={furnishing === item ? styles.selectedButtonText : styles.buttonText}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Listed By */}
      <Text style={styles.label}>Listed by <Text style={styles.required}>*</Text></Text>
      <View style={styles.buttonGroup}>
        {['Builder', 'Dealer', 'Owner'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.button, listedBy === item && styles.selectedButton]}
            onPress={() => setListedBy(item)}
          >
            <Text style={listedBy === item ? styles.selectedButtonText : styles.buttonText}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Text Inputs */}
      <Text style={styles.label}>Super Buildup area sq ft <Text style={styles.required}>*</Text></Text>
      <TextInput
        placeholder=" "
        value={superBuiltup}
        onChangeText={setSuperBuiltup}
        style={styles.input}
      />
       <Text style={styles.label}>Carpet Area sqft <Text style={styles.required}>*</Text></Text>
      <TextInput
        placeholder=" "
        value={carpetArea}
        onChangeText={setCarpetArea}
        style={styles.input}
      />
       <Text style={styles.label}>Maintenance (Monthly) </Text>
      <TextInput
        placeholder=" "
        value={maintenance}
        onChangeText={setMaintenance}
        style={styles.input}
      />
      
      <Text style={styles.label}>Project Name <Text style={styles.required}>*</Text></Text>
      <TextInput
        placeholder=" "
        value={projectName}
        onChangeText={setProjectName}
        style={styles.input}
      />

      <Text style={styles.label}>Add title <Text style={styles.required}>*</Text> </Text>
      <Text style={styles.labelText}>Mention the key festures of your item (eg, brand, model, age,type)</Text>
      <TextInput
        placeholder=" "
        value={title}
        onChangeText={setTitle}
        style={styles.input1}
        maxLength={70}
      />
      <Text style={styles.label}>Description <Text style={styles.required}>*</Text> </Text>
      <TextInput
        placeholder=" "
        value={description}
        onChangeText={setDescription}
        style={styles.textArea}
        multiline
        numberOfLines={4}
        maxLength={100}
      />

<Text style={styles.label}>Set A Price <Text style={styles.required}>*</Text></Text>
      <TextInput
        placeholder="₹"
        placeholderTextColor="#888"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        keyboardType="numeric"
      />
      </View>
  </>
)}


{['PG & Guest House'].includes(type) &&(
  <>
  <View style={styles.card}>
  <Text style={styles.heading}>Upload Property Details</Text>
      {/* Furnishing */}
      <Text style={styles.label}>Furnishing <Text style={styles.required}>*</Text></Text>
      <View style={styles.buttonGroup}>
        {['Furnished', 'Semi-Furnished', 'Un-Furnished'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.button, furnishing === item && styles.selectedButton]}
            onPress={() => setFurnishing(item)}
          >
            <Text style={furnishing === item ? styles.selectedButtonText : styles.buttonText}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

    
      {/* Listed By */}
      <Text style={styles.label}>Listed by <Text style={styles.required}>*</Text></Text>
      <View style={styles.buttonGroup}>
        {['Builder', 'Dealer', 'Owner'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.button, listedBy === item && styles.selectedButton]}
            onPress={() => setListedBy(item)}
          >
            <Text style={listedBy === item ? styles.selectedButtonText : styles.buttonText}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.dropdownWrapper}>
          <SelectList
          arrowicon={<Text style={{ fontSize: 12, color: '#aaa',backgroundColor: '#F8F8F8',
            borderRadius: 10,
            height:20,
            marginLeft:15,
            paddingHorizontal: 6,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.2, 
            shadowRadius: 8,
            elevation: 10, 
            borderWidth: 0, }}>▼</Text>}
            setSelected={setCarParking}
            data={carParkingOptions}
            save="value"
            search={false}
            placeholder="Car Parking"
            boxStyles={styles.selectBox}
            inputStyles={styles.selectInput}
            dropdownStyles={styles.dropdown}
            dropdownTextStyles={styles.dropdownText}
          />
        </View>
     
        <Text style={styles.label}>Meals Included <Text style={styles.required}>*</Text></Text>
      <View style={styles.buttonGroup}>
        {['Yes', 'No',].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.button, listedBy === item && styles.selectedButton]}
            onPress={() => setMealsIncluded(item)}
          >
            <Text style={mealsincluded === item ? styles.selectedButtonText : styles.buttonText}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      
      <Text style={styles.label}>Project Name <Text style={styles.required}>*</Text> </Text>
      <TextInput
        placeholder=" "
        value={projectName}
        onChangeText={setProjectName}
        style={styles.input}
      />

      <Text style={styles.label}>Add title <Text style={styles.required}>*</Text> </Text>
      <Text style={styles.labelText}>Mention the key festures of your item (eg, brand, model, age,type)</Text>
      <TextInput
        placeholder=" "
        value={title}
        onChangeText={setTitle}
        style={styles.input1}
        maxLength={70}
      />
      <Text style={styles.label}>Description <Text style={styles.required}>*</Text> </Text>
      <TextInput
        placeholder=" "
        value={description}
        onChangeText={setDescription}
        style={styles.textArea}
        multiline
        numberOfLines={4}
        maxLength={100}
      />
      
      <Text style={styles.label}>Set A Price <Text style={styles.required}>*</Text></Text>
      <TextInput
        placeholder="₹"
        placeholderTextColor="#888"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        keyboardType="numeric"
      />
      </View>
  </>
)}



      <TouchableOpacity style={styles.nextButton} onPress={postPropertyData}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
      </View>)}

      {currentStep === 2 && (
  <ScrollView contentContainerStyle={styles.uploadcontainer}>
  <Text style={styles.heading}>Property location</Text>

  <View style={styles.row}>
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Door No <Text style={styles.required}>*</Text></Text>
      <TextInput 
  style={styles.input} 
  placeholder="Enter Door No" 
  placeholderTextColor="#888"
  value={doorNo}
  onChangeText={setDoorNo}
/>

    </View>
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Street Name <Text style={styles.required}>*</Text></Text>
      <TextInput 
  style={styles.input} 
  placeholder="Enter Street Name"
  placeholderTextColor="#888"
  value={streetName}
  onChangeText={setStreetName}
/>
    </View>
  </View>

  <View style={styles.inputContainer}>
    <Text style={styles.label}>Area <Text style={styles.required}>*</Text></Text>
    <TextInput 
  style={styles.input} 
  placeholder="Enter Area"
  placeholderTextColor="#888"
  value={area}
  onChangeText={setArea}
/>
  </View>

  <View style={styles.inputContainer}>
    <Text style={styles.label}>Near by Landmark</Text>
    <TextInput 
  style={styles.input} 
  placeholder="Enter Landmark"
  placeholderTextColor="#888"
  value={landmark}
  onChangeText={setLandmark}
/>
  </View>

  <View style={styles.inputContainer}>
    <Text style={styles.label}>Pincode <Text style={styles.required}>*</Text></Text>
    <TextInput 
  style={styles.input} 
  placeholder="Enter Pincode"
  placeholderTextColor="#888"
  keyboardType="numeric"
  value={pincode}
  onChangeText={setPincode}
/>
  </View>

  <View style={styles.row}>
    <View style={styles.inputContainer}>
      <Text style={styles.label}>City <Text style={styles.required}>*</Text></Text>
      <TextInput 
  style={styles.input} 
  placeholder="Enter City"
  placeholderTextColor="#888"
  value={city}
  onChangeText={setCity}
/>
    </View>
    <View style={styles.inputContainer}>
      <Text style={styles.label}>State <Text style={styles.required}>*</Text></Text>
      <TextInput 
  style={styles.input} 
  placeholder="Enter State"
  placeholderTextColor="#888"
  value={stateName}
  onChangeText={setStateName}
/>
    </View>
  </View>
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
  <View style={styles.buttonRow}>
  <TouchableOpacity style={styles.backButton} onPress={() => setCurrentStep(1)}>
  <Text style={styles.backButtonText}>Back</Text>
</TouchableOpacity>

    <TouchableOpacity style={styles.nextButton} onPress={PropertyAddressData}>
      <Text style={styles.nextButtonText}>Next</Text>
    </TouchableOpacity>
  </View>
  
</ScrollView>


)}

{currentStep === 3 && (
  <View style={styles.uploadcontainer}>
  <Text style={styles.heading}>Gallery</Text>

  {/* Tabs */}
  <View style={styles.tabRow}>
    <TouchableOpacity onPress={() => setActiveTab('images')} style={styles.tab}>
      <Icon name="images" size={28} color={activeTab === 'images' ? 'black' : 'gray'} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setActiveTab('videos')} style={styles.tab}>
      <Icon name="videocam" size={28} color={activeTab === 'videos' ? 'black' : 'gray'} />
    </TouchableOpacity>
  </View>
  <View style={styles.tabIndicator}>
    <View style={[styles.indicator, activeTab === 'images' && styles.active]} />
    <View style={[styles.indicator, activeTab === 'videos' && styles.active]} />
  </View>

  {/* Upload Buttons */}
  <View style={styles.uploadRow}>
  <TouchableOpacity
 style={styles.uploadBox}
 onPress={activeTab === 'images' ? GalleryhandleMediaPick : VideohandleMediaPick}
>
 <Icon name="add-sharp" size={30} color="#888" />
</TouchableOpacity>
  </View>

  {/* Image Preview */}
  {activeTab === 'images' && galleryImages.length > 0 && (
    <ScrollView horizontal style={{ marginTop: 10 }}>
      {galleryImages.map((img, index) => (
        <Image
          key={index}
          source={{ uri: img.uri }}
          style={{ width: 100, height: 100, marginRight: 10, borderRadius: 8 }}
        />
      ))}
    </ScrollView>
  )}

  {/* Video Preview */}
  {activeTab === 'videos' && galleryVideos.length > 0 && (
    <ScrollView horizontal style={{ marginTop: 10 }}>
      {galleryVideos.map((vid, index) => (
        <Video
          key={index}
          source={{ uri: vid.uri }}
          style={{ width: 100, height: 100, marginRight: 10, borderRadius: 8 }}
          resizeMode="cover"
          muted
          repeat
        />
      ))}
    </ScrollView>
  )}

  {/* Navigation Buttons */}
  <View style={styles.footer}>
    <TouchableOpacity style={styles.backButton1} onPress={() => setCurrentStep(4)}>
      <Text style={styles.backButtonText}>Back</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
      <Text style={styles.submitText}>Next</Text>
    </TouchableOpacity>
  </View>
</View>
)}


    </ScrollView>
    </ImageBackground>
  );
};

export default UploadDetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 50,
  },
  uploadcontainer: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation:6,
    width: screenWidth * 0.93,
    alignSelf: 'center', 
  },  
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
  },
  label: {
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F8F8',
  borderRadius: 20,
  paddingVertical: 8,
  paddingHorizontal: 16,
  margin: 6,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.2, 
  shadowRadius: 8,
  elevation: 10, 
  },
  input1: {
    backgroundColor: '#F8F8F8',
  borderRadius: 20,
  paddingVertical: 8,
  paddingHorizontal: 16,
  margin: 6,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.2, 
  shadowRadius: 8,
  elevation: 10, 
  height:100,
  textAlignVertical: 'top',
  },
  
  textArea: {
    backgroundColor: '#F8F8F8',
  borderRadius: 20,
  paddingVertical: 8,
  paddingHorizontal: 16,
  margin: 6,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.2, 
  shadowRadius: 8,
  elevation: 10,
  height:100,
  textAlignVertical: 'top',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#F8F8F8',
  borderRadius: 20,
  paddingVertical: 8,
  paddingHorizontal: 16,
  margin: 6,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.2, 
  shadowRadius: 8,
  elevation: 10, 
  },
  selectedButton: {
    backgroundColor: '#d32f2f',
    borderColor: '#d32f2f',
     borderRadius: 20,
  paddingVertical: 8,
  paddingHorizontal: 16,
  margin: 6,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.2, 
  shadowRadius: 8,
  elevation: 10, 
  },
  buttonText: {
    color: '#333',
  },
  selectedButtonText: {
    color: '#fff',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#f60138',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginLeft: 10,
    elevation: 3,
    marginTop:20,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 20,
  },
  circle1: {
    width: 56,
    height: 56,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 20,
    marginLeft:20,
  },
  circleText: {
    fontWeight: 'bold',
    color: '#333',
  },
  tabLabel: {
    fontSize: 12,
    color: '#333',
  },
  tabLabel1: {
    fontSize: 12,
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  line: {
    height: 9,
    backgroundColor: '#ccc',
    width: 90,
    marginBottom:20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop:25,
  },
  dropdownWrapper: {
    width: '48%',
  },
  dropdownWrapper1: {
    width: '58%',
  },
  selectBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2, 
    shadowRadius: 8,
    elevation: 10, 
    borderWidth: 0,
  },
  selectInput: {
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    backgroundColor: '#fff',
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2, 
    shadowRadius: 8,
    elevation: 10, 
    borderWidth: 0,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  labelText:{
    fontSize:11,
    marginLeft:5,
    color:'grey',
  },
  card: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation:6,
    width: screenWidth * 0.93,
    alignSelf: 'center', 
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f44336',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginRight: 10,
    marginTop: 20,
  },
  backButtonText: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  inputContainer: {
    flex: 1,
    marginVertical: 10,
    marginRight: 10,
  },
  required: {
    color: 'red',
  },

  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight:20,
   
  },
  tabItem: {
    alignItems: 'center',
  },
  circle:{
    width: 56,
    height: 56,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 20,
  },
  circle1:{
    width: 56,
    height: 56,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 20,
    marginLeft:15,
  },
  activeCircle: {
    width: 56,
    height: 56,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 20,
  },
  activeCircle1: {
    width: 56,
    height: 56,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 20,
    marginLeft:25,
  },
  completedCircle: {
    width: 56,
    height: 56,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 20,
  },
  completedCircle1: {
    width: 56,
    height: 56,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 20,
    marginLeft:30,
  },
  circleText: {
    color: '#333',
    fontWeight: 'bold',
  },
  tabLabel: {
    marginTop: 5,
    fontSize: 12,
  },
  line: {
    height: 10,
    backgroundColor: '#ccc',
    flex: 1,
    marginHorizontal: 1,
    marginBottom:10,
  },
  tickImage: {
    width: 26,
    height:26,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tab: {
    marginHorizontal: 30,
    padding: 10,
  },
  tabIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  indicator: {
    width: 60,
    height: 3,
    backgroundColor: '#ccc',
    marginHorizontal: 25,
  },
  active: {
    backgroundColor: 'red',
  },
  uploadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  uploadBox: {
    width: 100,
    height: 100,
    marginHorizontal: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 30,
    marginLeft:60,
  },
  backButton1: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderColor: 'red',
    borderWidth: 1.5,
    marginRight: 20,
  },
  submitButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  backText1: {
    color: 'black',
    fontWeight: '600',
  },
  submitText: {
    color: 'white',
    fontWeight: '600',
  },
  pickerContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: 330,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 0,
  },
  
  picker: {
    width: '100%',
    color: '#333', // optional, to make text color look better
  },
});
