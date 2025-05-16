import React, { useState, useRef } from 'react';
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

  const handleInputChange = (text, index) => {
    const newOtpArray = [...otpArray];
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
    try {
        setLoading(true);
        setError('');

        const phone = await AsyncStorage.getItem('phone');
        if (!phone) {
            throw new Error('Phone number not found. Please try again.');
        }

        const response = await fetch('https://annaianbalayaa.org/api/otp_verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile: phone, otp: enteredOtp }),
        });

        const result = await response.json();
        console.log('API Response:', JSON.stringify(result, null, 2)); // Debugging

        if (result.success || result.status || result.verified) { 
            console.log('Login successful. Navigating to DashboardPage');
            
            await AsyncStorage.setItem('isLoggedIn', 'true');
            navigation.reset({
                index: 0,
                routes: [{ name: 'DashboardPage' }],
            });
        } else {
            throw new Error(result.message || 'Invalid OTP. Please try again.');
        }

    } catch (error) {
        console.error('OTP Verification Error:', error);
        setError(error.message || 'OTP verification failed. Please try again.');
        Alert.alert('Error', error.message || 'OTP verification failed.');
    } finally {
        setLoading(false);
    }
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

        {error && <Text style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>{error}</Text>}
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
});

export default VerificationPage;
