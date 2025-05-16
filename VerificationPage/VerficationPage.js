import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  ImageBackground,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width, height } = Dimensions.get('window');

const VerificationPage = () => {
  const navigation = useNavigation();
  const [otpArray, setOtpArray] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputs = useRef([]);

  useEffect(() => {
    console.log("Error updated:", error);  
  }, [error]);

  const handleInputChange = (text, index) => {
    const newOtpArray = [...otpArray];

    if (text === '' && index > 0) {
      inputs.current[index - 1].focus();
    }

    newOtpArray[index] = text;
    setOtpArray(newOtpArray);

    if (text !== '' && index < otpArray.length - 1) {
      inputs.current[index + 1].focus();
    }

    if (newOtpArray.every((digit) => digit !== '')) {
      verifyOtp(newOtpArray.join(''));
    }
  };

  const verifyOtp = async (enteredOtp) => {
    setError(null);
    setLoading(true);
  
    if (enteredOtp.length !== 4) {
      setError('Please enter a valid 4-digit OTP.');
      Alert.alert("Error", "Please enter a valid 4-digit OTP.");
      setLoading(false);
      return;
    }
  
    try {
      const phone = await AsyncStorage.getItem('phone');
      console.log("Verifying OTP:", enteredOtp, "for phone:", phone);
  
      const response = await fetch('https://masonshop.in/api/verify_OTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: phone, otp: enteredOtp }),
      });
  
      const result = await response.json();
      console.log('API Response:', result);
  
      if (result.status === 'error') {
        const errorMessage = result.message || "Invalid OTP. Please try again.";
        setError(errorMessage);
        Alert.alert("Error", errorMessage);
      } else {
        await AsyncStorage.setItem('isLoggedIn', 'true');
  
        const userId = result?.user_id; 
        console.log("User ID from response:", userId);
        if (userId) {
          await AsyncStorage.setItem('user_id', userId);
        }
  
        Alert.alert("Success", "OTP Verified Successfully!", [
          {
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: userId ? 'DashboardPage' : 'ProfileDetails',
                  },
                ],
              });
            },
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setError('OTP verification failed. Please try again later.');
      Alert.alert("Error", "OTP verification failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    startSmsListener();
  }, []);
  
  const startSmsListener = async () => {
    try {
      await SmsRetriever.startSmsRetriever();
      const message = await SmsRetriever.startSmsRetriever();
      console.log("Received SMS:", message);
  
      const otp = message.match(/\d{4,6}/)[0]; 
      if (otp) {
        fillOtpFields(otp);
      }
    } catch (error) {
      console.log("SMS Retriever Error:", error);
    }
  };
  
  const fillOtpFields = (otp) => {
    const otpDigits = otp.split('');
    setOtpArray(otpDigits);
  };
  

  return (
    <ImageBackground source={require('../RegisterPage/masonbackground.jpeg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.backgroundContainer}>
          <View style={styles.backgroundRed} />
          <View style={styles.backgroundGradient} />
        </View>

        <View style={styles.logoContainer}>
          <Image source={require('../RegisterPage/masonlogo.png')} style={styles.logo} />
          <Text style={styles.logoText}>MASON</Text>
        </View>

        <Text style={styles.title}>Enter Verification Code</Text>

        <View style={styles.verificationContainer}>
          {otpArray.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.circleInput}
              value={digit}
              maxLength={1}
              keyboardType="number-pad"
              onChangeText={(text) => handleInputChange(text, index)}
              ref={(input) => (inputs.current[index] = input)}
            />
          ))}
        </View>

        {loading && <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  circleInput: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
    marginHorizontal: 5,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundRed: {
    position: 'absolute',
    top: height * 0.2,
    width: width,
    height: height * 0.8,
    backgroundColor: '#d91f48',
    borderRadius: 30,
    transform: [{ rotate: '180deg' }],
  },
  backgroundGradient: {
    position: 'absolute',
    top: height * 0.2,
    width: width,
    height: height * 0.8,
    borderRadius: 30,
    backgroundColor: 'rgba(251, 33, 33, 0.8)',
    transform: [{ rotate: '180deg' }],
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 55,
    height: 40,
  },
  logoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ee0338',
    marginTop: 5,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 100,
    marginLeft: 25,
  },
  verificationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  errorContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default VerificationPage;
