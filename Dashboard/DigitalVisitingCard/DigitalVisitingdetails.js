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
import Video from 'react-native-video';
import DocumentPicker from 'react-native-document-picker';
import { Picker } from '@react-native-picker/picker';




const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const UploadDetailsScreen = () => {
  const navigation = useNavigation();
  const [memberId, setMemberId] = useState(null);
  const [propertyId, setPropertyId] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
  const [type, setType] = useState(' ');
  const [furnishing, setFurnishing] = useState('');
  const [constructionStatus, setConstructionStatus] = useState('');
  const [listedBy, setListedBy] = useState('');
  const [rentSell, setRentSell] = useState([]);
  const [selectedServiceCategory, setSelectedServiceCategory] = useState('');
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
const [backgroundImage, setBackgroundImage] = useState([]);
const [generalImage, setGeneralImage] = useState([]);


const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [whatsappNo, setWhatsappNo] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [websiteName, setWebsiteName] = useState('');
  const [gmail, setGmail] = useState('');
  const [address, setAddress] = useState('');

  const [district, setDistrict] = useState('');
  
  const [state, setState] = useState('');
  const [location, setLocation] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [x, setX] = useState('');
  const [youtube, setYoutube] = useState('');
  const [youtubelink, setYoutubeLink] = useState('');
  const [pinterest, setPinterest] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaType, setMetaType] = useState('');
  const [metaSiteName, setMetaSiteName] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  const [companyname, setCompanyName] = useState('');
  const [year, setYear] = useState('');
  const [nature, setNature] = useState('');
  const [aboutdescription, setAboutDescription] = useState('');
  const propertyTypes = ['Individual Villa', 'Plots','Office','PG & Guest House','Lands', 'House', 'Apartment','Shop',];

  const [servicename, setServiceName] = useState('');
  const [serviceImage, setServiceImage] = useState('');
  const [fix, setFix] = useState('');
  const [content, setContent] = useState('');
  const [paytm, setPaytm] = useState('');
  const [paytmqr, setPaytmQr] = useState('');
  const [gpay, setGpay] = useState('');
  const [gpayqr, setGpayqr] = useState('');
  const [phonepe, setPhonepe] = useState('');
  const [phonepeqr, setPhonepeQr] = useState('');
  const [bankname, setBankName] = useState('');
  const [accountholdername, setAccountHolderName] = useState('');
  const [accountnumber, setAccountNumber] = useState('');
  const [accounttype, setAccountType] = useState('');
  const [upi, setUpi] = useState('');
  const [ifsccode, setIfscCode] = useState('');
  const [galleryImage, setGalleryImage] = useState('');
  const [activeTab, setActiveTab] = useState('images');
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryVideos, setGalleryVideos] = useState([]);
  const [serviceDocuments, setServiceDocuments] = useState([]);

  const steps = [
    { label: 'Upload Details' },
    { label: 'About' },
    { label: 'Service' },
    { label: 'Payment' },
    { label: 'Gallery' },
    { label: 'Documents' },
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
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  
   
    const formData = new FormData();
  
    
    formData.append('person_name', name);
    formData.append('mobilenum', mobileNo);
    formData.append('whatsapp_num', whatsappNo);
    formData.append('jobroll', jobRole);
    formData.append('category', selectedServiceCategory);
    formData.append('website_name', websiteName);
    formData.append('gmail', gmail);
    formData.append('address', address);
    formData.append('city', selectedCity);
    formData.append('district', selectedDistrict);
    formData.append('description', description);
    formData.append('state', itemValue);
    formData.append('location', location);
    formData.append('facebook', facebook);
    formData.append('instagram', instagram);
    formData.append('twitter', x);
    formData.append('youtube', youtube);
    formData.append('pintrest', pinterest);
    formData.append('linkedin', linkedin);
    formData.append('keyword', keywords);
    formData.append('otherlinks', otherLinks);
    formData.append('title', metaTitle);
    formData.append('type', metaType);
    formData.append('site_name', metaSiteName);
    formData.append('description', metaDescription);
    formData.append('user_id', memberId);
  
   
    if (selectedImage?.[0]?.uri) {
      formData.append('logo', {
        uri: selectedImage[0].uri,
        name: selectedImage[0].name,
        type: selectedImage[0].type,
      });
    }
  
    if (backgroundImage?.[0]?.uri) {
      formData.append('image', {
        uri: backgroundImage[0].uri,
        name: backgroundImage[0].name,
        type: backgroundImage[0].type,
      });
    }
  
    if (generalImage?.[0]?.uri) {
      formData.append('site_image', {
        uri: generalImage[0].uri,
        name: generalImage[0].name,
        type: generalImage[0].type,
      });
    }
  
    try {
      const response = await fetch('https://masonshop.in/api/dvc_basic_info', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData, 
      });
  
      const data = await response.json();
      console.log('Upload response:', data);
  
      if (response.ok) {
        alert('Basic Information inserted successfully');
  
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
  

  const PropertyAboutData = async () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
    try {
      

  
      const response = await fetch('https://masonshop.in/api/dvc_about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_name: companyname,
          year_of_est: year,
          nature_of_bussiness: nature,
          about: aboutdescription,
          user_id: memberId,
        }),
      });
  
      const data = await response.json();
      console.log('Upload response:', data);
  
      if (response.ok) {
        alert('About posted successfully!');
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
      console.log('Selected media:', files);
      setSelectedMedia(files); 
      
    });
  };

  const backgroundhandleMediaPick = () => {
    launchImageLibrary({ mediaType: 'mixed', selectionLimit: 0 }, (response) => {
      if (response.didCancel || response.errorCode) return;
  
      const files = response.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.fileName || `${asset.type?.startsWith('video') ? 'video' : 'image'}_${Date.now()}`,
        type: asset.type,
      }));
  
      setBackgroundImage(files);
     
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

  const imagehandleMediaPick = () => {
    launchImageLibrary({ mediaType: 'mixed', selectionLimit: 0 }, (response) => {
      if (response.didCancel || response.errorCode) return;
  
      const files = response.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.fileName || `${asset.type?.startsWith('video') ? 'video' : 'image'}_${Date.now()}`,
        type: asset.type,
      }));
  
  
      setGeneralImage(files);
    });
  };
  
  const servicehandleMediaPick = () => {
    launchImageLibrary({ mediaType: 'mixed', selectionLimit: 0 }, (response) => {
      if (response.didCancel || response.errorCode) return;
  
      const files = response.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.fileName || `${asset.type?.startsWith('video') ? 'video' : 'image'}_${Date.now()}`,
        type: asset.type,
      }));
  
  
      setServiceImage(files);
    });
  };

  const paymentpaytmhandleMediaPick = () => {
    launchImageLibrary({ mediaType: 'mixed', selectionLimit: 0 }, (response) => {
      if (response.didCancel || response.errorCode) return;
  
      const files = response.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.fileName || `${asset.type?.startsWith('video') ? 'video' : 'image'}_${Date.now()}`,
        type: asset.type,
      }));
  
  
      setPaytmQr(files);
    });
  };

  const paymentgpayhandleMediaPick = () => {
    launchImageLibrary({ mediaType: 'mixed', selectionLimit: 0 }, (response) => {
      if (response.didCancel || response.errorCode) return;
  
      const files = response.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.fileName || `${asset.type?.startsWith('video') ? 'video' : 'image'}_${Date.now()}`,
        type: asset.type,
      }));
  
  
      setGpayqr(files);
    });
  };

  const paymentphonepehandleMediaPick = () => {
    launchImageLibrary({ mediaType: 'mixed', selectionLimit: 0 }, (response) => {
      if (response.didCancel || response.errorCode) return;
  
      const files = response.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.fileName || `${asset.type?.startsWith('video') ? 'video' : 'image'}_${Date.now()}`,
        type: asset.type,
      }));
  
  
      setPhonepeQr(files);
    });
  };

  
  
  
  const handleSubmit = async () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  
    try {
      const user_id = await AsyncStorage.getItem('user_id');
      const formData = new FormData();

      formData.append('service_name', servicename);
      formData.append('content', content);
      formData.append('price_plan', fix);
      console.log('FormData:', formData);
      if (serviceImage?.[0]?.uri) {
        formData.append('image', {
          uri: serviceImage[0].uri,
          name: serviceImage[0].name,
          type: serviceImage[0].type,
        });
      }
     
  
      formData.append('user_id', user_id);
  
      const res = await axios.post(
        'https://masonshop.in/api/dvc_service',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      console.log('Uploaded:', res.data);
      alert('Service uploaded successfully!');
    } catch (err) {
      console.log('Error:', err.response?.data || err.message);
      alert('Upload failed');
    }
  };

  

  const handlePayment = async () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  
    try {
      const user_id = await AsyncStorage.getItem('user_id');
      const formData = new FormData();

      formData.append('bank_name', bankname);
      formData.append('account_holder_name', accountholdername);
      formData.append('account_number', accountnumber);
      formData.append('account_type', accounttype);
      formData.append('ifsc_code', ifsccode);
      formData.append('upi', upi);
      formData.append('paytm_number', paytm);
      formData.append('gpay_number', gpay);
      formData.append('phonepe_number', phonepe);
      console.log('FormData:', formData);
      if (paytmqr?.[0]?.uri) {
        formData.append('paytm_qr', {
          uri: paytmqr[0].uri,
          name: paytmqr[0].name,
          type: paytmqr[0].type,
        });
      }
      if (gpayqr?.[0]?.uri) {
        formData.append('gpay_qr', {
          uri: gpayqr[0].uri,
          name: gpayqr[0].name,
          type: gpayqr[0].type,
        });
      }
      if (phonepeqr?.[0]?.uri) {
        formData.append('phonepay_qr', {
          uri: phonepeqr[0].uri,
          name: phonepeqr[0].name,
          type: phonepeqr[0].type,
        });
      }
     
  
      formData.append('user_id', user_id);
  
      const res = await axios.post(
        'https://masonshop.in/api/dvc_payment',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      console.log('Uploaded:', res.data);
      alert('Service uploaded successfully!');
    } catch (err) {
      console.log('Error:', err.response?.data || err.message);
      alert('Upload failed');
    }
  };

  const handleGallery = async () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  
    try {
      const user_id = await AsyncStorage.getItem('user_id');
      const formData = new FormData();

      console.log('FormData:', formData);
      if (galleryImage?.[0]?.uri) {
        formData.append('logo', {
          uri: galleryImage[0].uri,
          name: galleryImage[0].name,
          type: galleryImage[0].type,
        });
      }
     
  
      formData.append('user_id', user_id);
  
      const res = await axios.post(
        'https://masonshop.in/api/dvc_gallery',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      console.log('Uploaded:', res.data);
      alert('Service uploaded successfully!');
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

  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [otherLinks, setOtherLinks] = useState([]);
  const [newLink, setNewLink] = useState('');


  const addKeyword = () => {
    if (keywordInput.trim()) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (index) => {
    const updated = [...keywords];
    updated.splice(index, 1);
    setKeywords(updated);
  };

  const addOtherLink = () => {
    if (newLink.trim()) {
      setOtherLinks([...otherLinks, newLink.trim()]);
      setNewLink('');
    }
  };

  const selectMetaImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets?.length > 0) {
        setMetaImage(response.assets[0].uri);
      }
    });
  };

  useEffect(() => {
    fetchServiceCategories();
  }, []);

  const fetchServiceCategories = async () => {
    try {
      const response = await fetch('https://masonshop.in/api/service_category');
      const data = await response.json();


      console.log('Fetched categories:', data);

    
      if (Array.isArray(data)) {
        setRentSell(data);
      } else if (Array.isArray(data.data)) {
        setRentSell(data.data);
      } else {
        console.warn('Unexpected data format:', data);
        setRentSell([]);
      }
    } catch (error) {
      console.error('Error fetching service categories:', error);
    } finally {
      setLoading(false);
    }
  };

  
  const handleDocumentPick = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.doc, DocumentPicker.types.docx],
      });

      setServiceDocuments(prev => [...prev, res[0]]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled document picker');
      } else {
        console.error('Document pick error:', err);
      }
    }
  };

  const handleDocumentSubmit = async () => {
    if (serviceDocuments.length === 0) {
      alert('Please upload at least one document.');
      return;
    }
  
    const formData = new FormData();
    formData.append('user_id', memberId);
    serviceDocuments.forEach((doc, index) => {
      formData.append('documents[]', {
        uri: doc.uri,
        name: doc.name,
        type: doc.type || 'application/octet-stream', // fallback if type missing
      });
    });
  
    try {
      const response = await fetch('https://masonshop.in/api/dvc_documents', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Documents uploaded successfully!');
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (error) {
      console.error('Upload error', error);
      alert('Something went wrong!');
    }
  };
  


  const handleGallerySubmit = async () => {
    try {
      for (let img of galleryImages) {
        const formData = new FormData();
        formData.append('user_id', memberId);
        formData.append('youtube_link', youtubelink);
        formData.append('images[]', {
          uri: img.uri,
          name: img.fileName || 'image.jpg',
          type: img.type || 'image/jpeg',
        });
  
        console.log('Uploading image:', img);
  
        const res = await fetch('https://masonshop.in/api/dvc_gallery', {
          method: 'POST',
          body: formData, 
        });
  
        const text = await res.text();
        console.log('Image upload raw response:', text);
  
        if (!res.ok) {
          throw new Error(`Image upload failed: ${res.status} ${res.statusText}`);
        }
  
        const data = JSON.parse(text);
        console.log('Image upload response:', data);
      }
      // Upload videos
      for (let vid of galleryVideos) {
        const formData = new FormData();
        formData.append('user_id', memberId);
        formData.append('youtube_link', youtubelink);
        formData.append('videos', {
          uri: vid.uri,
          name: vid.fileName || 'video.mp4',
          type: vid.type || 'video/mp4',
        });
      
        console.log('Uploading video:', vid);
      
        const res = await fetch('https://masonshop.in/api/dvc_videos', {
          method: 'POST',
          body: formData, 
        });
      
        const text = await res.text();
        console.log('Video upload raw response:', text);
      
        if (!res.ok) {
          throw new Error(`Video upload failed: ${res.status} ${res.statusText}`);
        }
      
        const data = JSON.parse(text);
        console.log('Video upload response:', data);
      }
      
      setCurrentStep(6);
    } catch (error) {
      console.error('Upload error:', error.message);
    }
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


  return (
    <ImageBackground
    source={require('../icons/masonbackground.jpeg')}  
    style={styles.container}
  >
    <ScrollView contentContainerStyle={styles.container}>

    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    <View style={styles.tabContainer}>
  {steps.map((step, index) => {
    const stepNumber = index + 1;
    const isCompleted = currentStep > stepNumber;
    const isActive = currentStep === stepNumber;

    return (
      <React.Fragment key={stepNumber}>
        {index !== 0 && (
          <View style={[styles.line, currentStep >= stepNumber && { backgroundColor: 'red' }]} />
        )}
        <View style={styles.tabItem}>
          <View style={
            stepNumber === 1
              ? isCompleted ? styles.completedCircle1 : isActive ? styles.activeCircle1 : styles.circle1
              : isCompleted ? styles.completedCircle : isActive ? styles.activeCircle : styles.circle
          }>
            {isCompleted ? (
              <Image source={require('../icons/checkmark.png')} style={styles.tickImage} />
            ) : (
              <Text style={styles.circleText}>{stepNumber}</Text>
            )}
          </View>
          <Text style={styles.tabLabel}>{step.label}</Text>
        </View>
      </React.Fragment>
    );
  })}
</View>

    </ScrollView>


{currentStep === 1 && (
  <View>
       {/* Personal Information */}
      <View style={styles.uploadcontainer}>
        <Text style={styles.heading}>Personal Information</Text>

        <Text style={styles.label}>Name <Text style={styles.required}>*</Text></Text>
        <TextInput
          placeholder=" "
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>Mobile No <Text style={styles.required}>*</Text></Text>
        <TextInput
          placeholder=" "
          value={mobileNo}
          onChangeText={setMobileNo}
          style={styles.input}
        />

        <Text style={styles.label}>Whatsapp No <Text style={styles.required}>*</Text></Text>
        <TextInput
          placeholder=" "
          value={whatsappNo}
          onChangeText={setWhatsappNo}
          style={styles.input}
        />

        <Text style={styles.label}>Job Role <Text style={styles.required}>*</Text></Text>
        <TextInput
          placeholder=" "
          value={jobRole}
          onChangeText={setJobRole}
          style={styles.input}
        />

        <View style={styles.dropdownWrapper}>  
          <Text style={styles.label}>Service Category <Text style={styles.required}>*</Text></Text>
          <SelectList
          arrowicon={<Text style={styles.dropdownIcon}>▼</Text>}
          setSelected={setSelectedServiceCategory}
          data={
            Array.isArray(rentSell)
              ? rentSell.map((item) => ({ value: item.category_name }))
              : []
          }
          save="value"
          search={false}
          placeholder="Select a service category"
          boxStyles={styles.selectBox}
          inputStyles={styles.selectInput}
          dropdownStyles={styles.dropdown}
          dropdownTextStyles={styles.dropdownText}
        />
        </View>

        <Text style={styles.label}>Website Name <Text style={styles.required}>*</Text></Text>
        <TextInput
          placeholder=" "
          value={websiteName}
          onChangeText={setWebsiteName}
          style={styles.input}
        />

        <Text style={styles.label}>Gmail <Text style={styles.required}>*</Text></Text>
        <TextInput
          placeholder=" "
          value={gmail}
          onChangeText={setGmail}
          style={styles.input}
        />

        <Text style={styles.label}>Address </Text>
        <TextInput
          placeholder=" "
          value={address}
          onChangeText={setAddress}
          style={styles.input}
        />

       
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

   

        <Text style={styles.label}>Description <Text style={styles.required}>*</Text></Text>
        <TextInput
          placeholder=" "
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />

        {/* <Text style={styles.label}>State <Text style={styles.required}>*</Text></Text>
        <TextInput
          placeholder=" "
          value={state}
          onChangeText={setState}
          style={styles.input}
        /> */}
    

        <Text style={styles.label}>Location <Text style={styles.required}>*</Text></Text>
        <TextInput
          placeholder=" "
          value={location}
          onChangeText={setLocation}
          style={styles.input}
        />

        <Text style={styles.label}>Logo <Text style={styles.required}>*</Text></Text>
        <View style={styles.uploadRow}>
          <TouchableOpacity style={styles.uploadBox} onPress={handleMediaPick}>
            <Icon name="folder" size={30} color="gold" />
            <Text style={styles.uploadText}>Upload</Text>
          </TouchableOpacity>
        </View>

       
{Array.isArray(selectedImage) && selectedImage.length > 0 && (
  <ScrollView horizontal style={{ marginTop: 10 }}>
    {selectedImage.map((img, index) => (
      <Image
        key={index}
        source={{ uri: img.uri }}
        style={{
          width: 100,
          height: 100,
          marginRight: 10,
          borderRadius: 8,
        }}
      />
    ))}
  </ScrollView>
)}

        {/* Background Image */}
        <Text style={styles.label}>Background Image <Text style={styles.required}>*</Text></Text>
        <View style={styles.uploadRow}>
          <TouchableOpacity style={styles.uploadBox} onPress={backgroundhandleMediaPick}>
            <Icon name="folder" size={30} color="gold" />
            <Text style={styles.uploadText}>Upload</Text>
          </TouchableOpacity>
        </View>

       
{Array.isArray(backgroundImage) && backgroundImage.length > 0 && (
  <ScrollView horizontal style={{ marginTop: 10 }}>
    {backgroundImage.map((img, index) => (
      <Image
        key={index}
        source={{ uri: img.uri }}
        style={{
          width: 100,
          height: 100,
          marginRight: 10,
          borderRadius: 8,
        }}
      />
    ))}
  </ScrollView>
)}
      </View>

      {/* Social Media Links */}
      <Text style={styles.heading2}>Social Media Links</Text>
      <View style={styles.uploadcontainer}>
        <Text style={styles.label}>Facebook <Text style={styles.required}>*</Text></Text>
        <TextInput
          placeholder=" "
          value={facebook}
          onChangeText={setFacebook}
          style={styles.input}
        />

        <Text style={styles.label}>Instagram <Text style={styles.required}>*</Text></Text>
        <TextInput
          placeholder=" "
          value={instagram}
          onChangeText={setInstagram}
          style={styles.input}
        />

        <Text style={styles.label}>X <Text style={styles.required}>*</Text></Text>
        <TextInput
          placeholder=" "
          value={x}
          onChangeText={setX}
          style={styles.input}
        />

        <Text style={styles.label}>Youtube <Text style={styles.required}>*</Text></Text>
        <TextInput
          placeholder=" "
          value={youtube}
          onChangeText={setYoutube}
          style={styles.input}
        />

        <Text style={styles.label}>Pinterest <Text style={styles.required}>*</Text></Text>
        <TextInput
          placeholder=" "
          value={pinterest}
          onChangeText={setPinterest}
          style={styles.input}
        />

        <Text style={styles.label}>LinkedIn <Text style={styles.required}>*</Text></Text>
        <TextInput
          placeholder=" "
          value={linkedin}
          onChangeText={setLinkedin}
          style={styles.input}
        />
      </View>


      <View style={styles.uploadcontainer}>
      {/* Searching Keywords */}
      <Text style={styles.sectionTitle}>Searching Keywords</Text>
      <View style={styles.chipContainer}>
        {keywords.map((item, idx) => (
          <View key={idx} style={styles.chip}>
            <Text style={styles.chipText}>{item}</Text>
            <TouchableOpacity onPress={() => removeKeyword(idx)}>
              <Text style={styles.remove}> × </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <TextInput
        style={styles.input}
        value={keywordInput}
        onChangeText={setKeywordInput}
        placeholder="Add keyword"
        onSubmitEditing={addKeyword}
      />

      {/* Other Links */}
      <Text style={styles.sectionTitle}>Other Links</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={newLink}
          onChangeText={setNewLink}
          placeholder="Enter link"
        />
        <TouchableOpacity style={styles.addButton} onPress={addOtherLink}>
          <Text style={{ fontSize: 18, color: '#fff' }}>+</Text>
        </TouchableOpacity>
      </View>
      {otherLinks.map((link, idx) => (
        <Text key={idx} style={{ marginLeft: 10 }}>{link}</Text>
      ))}
 </View>

 <View style={styles.uploadcontainer}>
      {/* Meta Tags Section */}
      <Text style={styles.sectionTitle}>Meta Tags</Text>

      <Text style={styles.label}>Title <Text style={styles.required}>*</Text></Text>
      <TextInput
        placeholder=" "
        value={metaTitle}
        onChangeText={setMetaTitle}
        style={styles.input}
      />

      <Text style={styles.label}>Type <Text style={styles.required}>*</Text></Text>
      <TextInput
        placeholder=" "
        value={metaType}
        onChangeText={setMetaType}
        style={styles.input}
      />

      <Text style={styles.label}>Site Name <Text style={styles.required}>*</Text></Text>
      <TextInput
        placeholder=" "
        value={metaSiteName}
        onChangeText={setMetaSiteName}
        style={styles.input}
      />

      <Text style={styles.label}>Image <Text style={styles.required}>*</Text></Text>
      <View style={styles.uploadRow}>
        <TouchableOpacity style={styles.uploadBox} onPress={imagehandleMediaPick}>
          <Icon name="folder" size={30} color="gold" />
          <Text style={styles.uploadText}>Upload</Text>
        </TouchableOpacity>
      </View>

      
{Array.isArray(generalImage) && generalImage.length > 0 && (
  <ScrollView horizontal style={{ marginTop: 10 }}>
    {generalImage.map((img, index) => (
      <Image
        key={index}
        source={{ uri: img.uri }}
        style={{
          width: 100,
          height: 100,
          marginRight: 10,
          borderRadius: 8,
        }}
      />
    ))}
  </ScrollView>
)}

      <Text style={styles.label}>Description About The Business<Text style={styles.required}>*</Text></Text>
      <TextInput
        placeholder=" "
        value={metaDescription}
        onChangeText={setMetaDescription}
        style={styles.input}
        multiline
        numberOfLines={4}
        maxLength={100}
      />
</View>
   

      
      <TouchableOpacity style={styles.nextButton} onPress={postPropertyData}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
      </View>
      )}

      {currentStep === 2 && (
  <View style={styles.uploadcontainer}>
      
      <Text style={styles.heading2}>About Business</Text>

      <Text style={styles.label}>Company Name / Freelancer Name <Text style={styles.required}>*</Text></Text>
      <TextInput
        placeholder=" "
        value={companyname}
        onChangeText={setCompanyName}
        style={styles.input}
      />

      <Text style={styles.label}>Year of Establishment  <Text style={styles.required}>*</Text></Text>
      <TextInput
        placeholder=" "
        value={year}
        onChangeText={setYear}
        style={styles.input}
      />

      <Text style={styles.label}>Nature of Business  <Text style={styles.required}>*</Text></Text>
      <TextInput
        placeholder=" "
        value={nature}
        onChangeText={setNature}
        style={styles.input}
      />

     

      <Text style={styles.label}>Description About The Business<Text style={styles.required}>*</Text></Text>
      <TextInput
        placeholder=" "
        value={aboutdescription}
        onChangeText={setAboutDescription}
        style={styles.input}
        multiline
        numberOfLines={4}
        maxLength={100}
      />

   
  <View style={styles.buttonRow}>
  <TouchableOpacity style={styles.backButton} onPress={() => setCurrentStep(1)}>
  <Text style={styles.backButtonText}>Back</Text>
</TouchableOpacity>

    <TouchableOpacity style={styles.nextButton} onPress={PropertyAboutData}>
      <Text style={styles.nextButtonText}>Next</Text>
    </TouchableOpacity>
  </View>
  </View>
)}

{currentStep === 3 && (
 <View style={styles.uploadcontainer}>
 {/* Meta Tags Section */}
 <Text style={styles.heading2}>Services</Text>

 <Text style={styles.label}>Service Name <Text style={styles.required}>*</Text></Text>
 <TextInput
   placeholder=" "
   value={servicename}
   onChangeText={setServiceName}
   style={styles.input}
 />

 
<Text style={styles.label}>Image <Text style={styles.required}>*</Text></Text>
 <View style={styles.uploadRow}>
   <TouchableOpacity style={styles.uploadBox} onPress={servicehandleMediaPick}>
     <Icon name="folder" size={30} color="gold" />
     <Text style={styles.uploadText}>Upload</Text>
   </TouchableOpacity>
 </View>

 
{Array.isArray(serviceImage) && serviceImage.length > 0 && (
<ScrollView horizontal style={{ marginTop: 10 }}>
{serviceImage.map((img, index) => (
 <Image
   key={index}
   source={{ uri: img.uri }}
   style={{
     width: 100,
     height: 100,
     marginRight: 10,
     borderRadius: 8,
   }}
 />
))}
</ScrollView>
)}

 <Text style={styles.label}>Fix a Price <Text style={styles.required}>*</Text></Text>
 <TextInput
   placeholder=" "
   value={fix}
   onChangeText={setFix}
   style={styles.input}
 />


 <Text style={styles.label}>Content of your business <Text style={styles.required}>*</Text></Text>
 <TextInput
   placeholder=" "
   value={content}
   onChangeText={setContent}
   style={styles.input}
   multiline
   numberOfLines={4}
   maxLength={100}
 />

  
  <View style={styles.footer}>
  <TouchableOpacity style={styles.backButton1} onPress={() => setCurrentStep(2)}>
  <Text style={styles.backButtonText}>Back</Text>
</TouchableOpacity>

    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
      <Text style={styles.submitText}>Next</Text>
    </TouchableOpacity>
  </View>
</View>
)}


{currentStep === 4 && (
  <View>
       {/* Personal Information */}
      <View style={styles.uploadcontainer}>
       {/* Meta Tags Section */}
 <Text style={styles.heading2}>Payment</Text>

<Text style={styles.label}>Paytm - Number <Text style={styles.required}>*</Text></Text>
<TextInput
  placeholder=" "
  value={paytm}
  onChangeText={setPaytm}
  style={styles.input}
/>


<Text style={styles.label}>Paytm QR Code <Text style={styles.required}>*</Text></Text>
<View style={styles.uploadRow}>
  <TouchableOpacity style={styles.uploadBox} onPress={paymentpaytmhandleMediaPick}>
    <Icon name="folder" size={30} color="gold" />
    <Text style={styles.uploadText}>Upload</Text>
  </TouchableOpacity>
</View>


{Array.isArray(paytmqr) && paytmqr.length > 0 && (
<ScrollView horizontal style={{ marginTop: 10 }}>
{paytmqr.map((img, index) => (
<Image
  key={index}
  source={{ uri: img.uri }}
  style={{
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  }}
/>
))}
</ScrollView>
)}

<Text style={styles.label}>Gpay - Number <Text style={styles.required}>*</Text></Text>
<TextInput
  placeholder=" "
  value={gpay}
  onChangeText={setGpay}
  style={styles.input}
/>


<Text style={styles.label}>Gpay QR Code <Text style={styles.required}>*</Text></Text>
<View style={styles.uploadRow}>
  <TouchableOpacity style={styles.uploadBox} onPress={paymentgpayhandleMediaPick}>
    <Icon name="folder" size={30} color="gold" />
    <Text style={styles.uploadText}>Upload</Text>
  </TouchableOpacity>
</View>


{Array.isArray(gpayqr) && gpayqr.length > 0 && (
<ScrollView horizontal style={{ marginTop: 10 }}>
{gpayqr.map((img, index) => (
<Image
  key={index}
  source={{ uri: img.uri }}
  style={{
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  }}
/>
))}
</ScrollView>
)}

<Text style={styles.label}>Phonepe - Number <Text style={styles.required}>*</Text></Text>
<TextInput
  placeholder=" "
  value={phonepe}
  onChangeText={setPhonepe}
  style={styles.input}
/>


<Text style={styles.label}>Phonepe QR Code <Text style={styles.required}>*</Text></Text>
<View style={styles.uploadRow}>
  <TouchableOpacity style={styles.uploadBox} onPress={paymentphonepehandleMediaPick}>
    <Icon name="folder" size={30} color="gold" />
    <Text style={styles.uploadText}>Upload</Text>
  </TouchableOpacity>
</View>


{Array.isArray(phonepeqr) && phonepeqr.length > 0 && (
<ScrollView horizontal style={{ marginTop: 10 }}>
{phonepeqr.map((img, index) => (
<Image
  key={index}
  source={{ uri: img.uri }}
  style={{
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  }}
/>
))}
</ScrollView>
)}

 
 
      </View>

      <Text style={styles.heading2}>Account Details</Text>
      <View style={styles.uploadcontainer}>
        <Text style={styles.label}>Bank Name <Text style={styles.required}>*</Text></Text>
        <TextInput
          placeholder=" "
          value={bankname}
          onChangeText={setBankName}
          style={styles.input}
        />

        <Text style={styles.label}>Account Holder Name <Text style={styles.required}>*</Text></Text>
        <TextInput
          placeholder=" "
          value={accountholdername}
          onChangeText={setAccountHolderName}
          style={styles.input}
        />

        <Text style={styles.label}>Account Number <Text style={styles.required}>*</Text></Text>
        <TextInput
          placeholder=" "
          value={accountnumber}
          onChangeText={setAccountNumber}
          style={styles.input}
        />

        <Text style={styles.label}>Account Type <Text style={styles.required}>*</Text></Text>
        <TextInput
          placeholder=" "
          value={accounttype}
          onChangeText={setAccountType}
          style={styles.input}
        />

        <Text style={styles.label}>UPI <Text style={styles.required}>*</Text></Text>
        <TextInput
          placeholder=" "
          value={upi}
          onChangeText={setUpi}
          style={styles.input}
        />

        <Text style={styles.label}>IFSC Code <Text style={styles.required}>*</Text></Text>
        <TextInput
          placeholder=" "
          value={ifsccode}
          onChangeText={setIfscCode}
          style={styles.input}
        />
      </View>

      <View style={styles.footer}>
 <TouchableOpacity style={styles.backButton1} onPress={() => setCurrentStep(3)}>
 <Text style={styles.backButtonText}>Back</Text>
</TouchableOpacity>

   <TouchableOpacity style={styles.submitButton} onPress={handlePayment}>
     <Text style={styles.submitText}>Next</Text>
   </TouchableOpacity>
 </View>
      </View>
      
      )}


{currentStep === 5 && (
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
 <Text style={styles.label}>Youtube Link <Text style={styles.required}>*</Text></Text>
        <TextInput
          placeholder=" "
          value={youtubelink}
          onChangeText={setYoutubeLink}
          style={styles.input}
        />
   {/* Navigation Buttons */}
   <View style={styles.footer}>
     <TouchableOpacity style={styles.backButton1} onPress={() => setCurrentStep(4)}>
       <Text style={styles.backButtonText}>Back</Text>
     </TouchableOpacity>
     <TouchableOpacity style={styles.submitButton} onPress={handleGallerySubmit}>
       <Text style={styles.submitText}>Next</Text>
     </TouchableOpacity>
   </View>
 </View>

)}


{currentStep === 6 && (
 <View style={styles.uploadcontainer}>
 {/* Meta Tags Section */}
 <Text style={styles.heading2}>Services</Text>

 
 <Text style={styles.label}>Documents <Text style={styles.required}>*</Text></Text>
      <View style={styles.uploadRow}>
        <TouchableOpacity style={styles.uploadBox} onPress={handleDocumentPick}>
          <Icon name="document" size={30} color="skyblue" />
          <Text style={styles.uploadText}>Upload</Text>
        </TouchableOpacity>
      </View>

      {serviceDocuments.length > 0 && (
        <View style={{ marginTop: 10 }}>
          {serviceDocuments.map((doc, index) => (
            <Text key={index} style={{ marginBottom: 5 }}>
              📄 {doc.name}
            </Text>
          ))}
        </View>
      )}
  <View style={styles.footer}>
  <TouchableOpacity style={styles.backButton1} onPress={() => setCurrentStep(5)}>
  <Text style={styles.backButtonText}>Back</Text>
</TouchableOpacity>

    <TouchableOpacity style={styles.submitButton} onPress={handleDocumentSubmit}>
      <Text style={styles.submitText}>Sumbit</Text>
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
    paddingTop: 10,
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
    width: screenWidth * 0.91,
    alignSelf: 'center', 
  },  
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
  },
  heading2: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
    marginTop:20,
  },
  label: {
    fontWeight: '600',
    marginTop: 6,
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
  dropdownWrapper2: {
    width: '98%',
  },
  selectBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    width:330,
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
    width:330,
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
  dropdownIcon: {
    fontSize: 18,
    color: '#000',
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
    justifyContent: 'space-around',
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
    width: 40,
    backgroundColor: '#ccc',
    flex: 1,
    marginHorizontal:9,
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
    width: 50,
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
    height: 40,
    flexDirection: 'row',
    marginHorizontal: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText:{
    marginLeft:10,
    fontSize:14,
    color:'red',
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
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  chip: {
    flexDirection: 'row',
    backgroundColor: '#222',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 4,
    alignItems: 'center',
  },
  chipText: {
    color: '#fff',
    marginRight: 5,
  },
  remove: {
    color: 'red',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#e53935',
    padding: 10,
    borderRadius: 6,
    marginLeft: 8,
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
