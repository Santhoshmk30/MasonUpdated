import React, { useState,useRef,useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,Dimensions,PixelRatio,ActivityIndicator
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const scaleFont = (size) => size * PixelRatio.getFontScale();
const ProfileDetails = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Tamil Nadu');
  const [pincode, setPincode] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const navigation = useNavigation();
  const inputRef = useRef(null);
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const inputRef4 = useRef(null);
  const inputRef5 = useRef(null);

  

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const validatePhone = () => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };



  const handleSubmit = async () => {
    if (!name) {
      Alert.alert("Invalid Input", "Please fill all the fields with valid data.");
      return;
    }
  
    try {
   
      const phone = await AsyncStorage.getItem('phone');
  
      if (!phone) {
        Alert.alert("Error", "Phone number not found. Please try again.");
        return;
      }

      if (!email.includes('@')) {
        Alert.alert("Invalid Email", "Please enter a valid email address.");
       
        return;
      }
  
      const payload = {
        name: name.trim(),
        email: email.trim(),
        referralCode: referralCode.trim(),
        address: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
        password: '0000',
        phone: phone.trim(),  
      };
  
      console.log("Sending payload:", payload);
  
      const response = await fetch("https://masonshop.in/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const text = await response.text();
      console.log("Raw Response regi:", text);
  
      const data = JSON.parse(text);
  
      if (response.ok) {
        await AsyncStorage.setItem('isLoggedIn', 'true');
        navigation.replace('DashboardPage');
        console.log("Raw Response regi:", data);
      } else {
        Alert.alert("Error", data.message || "Failed to save Profile.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", error.message || "Something went wrong. Please try again later.");
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
  
  
  const [referralName, setReferralName] = useState('');

  const handleReferralCodeChange = (text) => {
    setReferralCode(text);
  };
  
  const handleReferralEndEditing = async () => {
    if (referralCode.trim().length === 0) return;
  
    try {
      const response = await fetch(`https://masonshop.in/api/check_referral?id=${referralCode}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
  
      const contentType = response.headers.get('content-type');
  
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
  
        if (response.ok && data?.name) {
          setReferralName(data.name); // Set the referral name from the API response
        } else {
          setReferralName('');
          
        }
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        Alert.alert('Error', 'Server did not return valid JSON.');
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };
  
  return (
    <ImageBackground
      source={require('../ProfileDetails/masonbackground.jpeg')}
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.container}>
          
              <LinearGradient
                colors={['#FC2121', '#982B2B']}
                style={styles.gradientBox}
              />
            
              <View style={styles.content}>
                <Text style={styles.title}>Enter Your Personal Details</Text>

                <View style={styles.content6}>
    <View style={styles.inputBox1}>
      <TextInput
        style={styles.textInput}
        placeholder="Referral Code (Optional)"
        placeholderTextColor="rgba(247, 247, 247, 0.9)"
        keyboardType="default"
        maxLength={7}
        value={referralCode}
        onChangeText={handleReferralCodeChange} 
        onEndEditing={handleReferralEndEditing} 
        returnKeyType="done"
      />
    </View>
  </View>

  {referralCode.trim().length > 0 && (
  <View style={styles.content9}>
    <View style={styles.inputBox3}>
      <Text style={styles.textInput}>
        <Text style={styles.label}>Referral Name: </Text>
        {referralName ? referralName : 'Invalid Referral ID'}
      </Text>
    </View>
  </View>
)}


                <TouchableWithoutFeedback
      onPress={() => {
        inputRef5.current?.focus(); // screen tap panna TextInput focus
      }}
    >
      <View style={styles.content12}>
        <View style={styles.inputBox}>
          <TextInput
            ref={inputRef5}
            onChangeText={setName}
            value={name}
            placeholder="Full Name *"
            placeholderTextColor="white"
            style={styles.textInput}
            keyboardType="default" 
            autoCapitalize="none"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
                 </View>

                 <TouchableWithoutFeedback
        onPress={() => {
          inputRef1.current?.focus(); 
        }}
      >
                 <View style={styles.content2}>
                <View style={styles.inputBox}>
                  <TextInput
                    ref={inputRef1}
                    onChangeText={setEmail}
                    value={email}
                    placeholder="Email Id *"
                    placeholderTextColor="white"
                    style={styles.textInput}
                    keyboardType='email-address'
                    autoCapitalize="none"
                  />
                </View>
                 </View>
                 </TouchableWithoutFeedback>

                 
                 <TouchableWithoutFeedback
        onPress={() => {
          inputRef2.current?.focus(); 
        }}
      >
                 <View style={styles.content3}>
                <View style={styles.inputBox}>
                  <TextInput
                    ref={inputRef2}
                    onChangeText={setAddress}
                    value={address}
                    placeholder="Address *"
                    placeholderTextColor="white"
                    style={styles.textInput}
                    keyboardType='email-address'
                    autoCapitalize="none"
                  />
                </View>
                 </View>
                 </TouchableWithoutFeedback>

                 <TouchableWithoutFeedback
        onPress={() => {
          inputRef3.current?.focus(); 
        }}
      >

        
                

                 <View style={styles.content4}>
                <View style={styles.inputBox4}>
                  <TextInput
                    ref={inputRef3}
                    onChangeText={setCity}
                    value={city}
                    placeholder="State"
                    placeholderTextColor="white"
                    style={styles.textInput}
                    keyboardType='text'
                    autoCapitalize="none"
                  />
                </View>
                 </View>


                 
                  </TouchableWithoutFeedback>


           


<View style={styles.content7}>               
<View style={styles.inputBox}> 
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
      <Picker.Item label="-- Select District -- *" value="" />
      {districts.map((district, index) => (
        <Picker.Item key={index} label={district.district} value={district.district} />
      ))}
    </Picker>
  </View>
)}


{selectedDistrict !== '' && (
    <View style={styles.content8}> 
      <View style={styles.inputBox2}> 
        {loadingCities ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCity}
              onValueChange={(itemValue) => setSelectedCity(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="-- Select City/Area/Village *--" value="" />
              {cities.map((city, index) => (
                <Picker.Item key={index} label={city.city} value={city.city} />
              ))}
            </Picker>
          </View>
        )}
      </View>
    </View>
  )}
    </View>
    </View>
              


             

              <View style={styles.bottomSection}>
    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
              </View>

              <View style={styles.logoContainer}>
                <Image
                  source={require('../ProfileDetails/masonlogo.png')}
                  style={styles.logo}
                />
                <Text style={styles.logoText}>MASON</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  gradientBox: {
    position: 'absolute',
    top: screenHeight * 0.13, 
    left: 0,
    width: '100%',
    height: screenHeight * 0.85, 
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: screenHeight * 0.5,
  },
  textInput:{
    color:'white',
  },
  content: {
    position: 'absolute',
    top: screenHeight * 0.16,
    left: '5%',
    width: '90%',
  },
  content12: {
    position: 'absolute',
    top: screenHeight * 0.151,
    left: '1%',
    width: '98%',
  },
  content2: {
    position: 'absolute',
    top: screenHeight * 0.40,
    left: '5%',
    width: '90%',
  },
  content3: {
    position: 'absolute',
    top: screenHeight * 0.482,
    left: '5%',
    width: '90%',
  },
  content4: {
    position: 'absolute',
    top: screenHeight * 0.565,
    left: '5%',
    width: '40%',
  },
  content5: {
    position: 'absolute',
    top: screenHeight * 0.76,
    left: '52%',
    width: '40%',
  },
  content6: {
    position: 'absolute',
    top: screenHeight * (-0.15),
    left: '1%',
    width: '98%',
  },
  content7: {
    position: 'absolute',
    top: screenHeight * 0.65,
    left: '5%',
    width: '90%',
  },
  content8: {
    position: 'absolute',
    top: screenHeight * 0.06,
    width: '90%',
  },
  content9: {
    position: 'absolute',
    top: screenHeight * -0.072,
    width: '90%',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: screenWidth * 0.045,
    marginBottom: 15,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: screenHeight * 0.02,
    height: 60, 
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    width:'95%',
  },
  inputBox1: {
    padding: 10,
    marginTop: screenHeight * 0.19, 
    height: 60,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    width:'97%',
  },
  inputBox2: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: screenHeight * 0.02,
    height: 60, 
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    width:'117%',
  },
  inputBox3: {
    padding: 10,
    marginTop: screenHeight * 0.19, 
    width:'105%',
  },
  inputBox4: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: screenHeight * 0.02,
    height: 60, 
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    width:'213%',
  },
  textInput:{
    color:'white',
  },
  
  button: {
    marginTop: screenHeight * 0.85,
    width: screenWidth * 0.9,
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 10,
    alignItems: 'center',
    alignSelf: 'center',  
  },

  buttonText: {
    color: '#f60138',
    fontWeight: 'bold',
    fontSize: screenWidth * 0.05, 
  },
  logoContainer: {
    position: 'absolute',
    top: screenHeight * 0.02, 
    alignSelf: 'center',
  },
  logo: {
    width: screenWidth * 0.20, 
    height: screenHeight * 0.07,
    marginBottom: 5,
  },
  logoText: {
    width: screenWidth * 0.20, 
    height: screenHeight * 0.07,
    fontSize:screenWidth * 0.048,
  },
  loginLink: {
    color: 'white',
    textAlign: 'center', 
    marginTop: screenHeight * 0.03,
    textDecorationLine: 'underline',
  },
  pickerContainer: {
   
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: 330,
    margin: 6,
    
  },
  
  picker: {
    width: '100%',
    color: 'white', 
  },
});

export default ProfileDetails;
