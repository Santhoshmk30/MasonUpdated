import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Avatar,Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const MyAccountKYC = () => {
  const [email, setEmail] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [ifsc, setIFSC] = useState('');
  const [branch, setBranch] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorId, setSponsorId] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null)
  const navigation = useNavigation();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const values = await AsyncStorage.multiGet([
          'email',
          'accountName',
          'accountNumber',
          'bankName',
          'ifsc',
          'branch',
          'panNumber',
          'sponsorName',
          'sponsorId',
        ]);
        const data = Object.fromEntries(values);

        setEmail(data.email || '');
        setAccountName(data.accountName || '');
        setAccountNumber(data.accountNumber || '');
        setBankName(data.bankName || '');
        setIFSC(data.ifsc || '');
        setBranch(data.branch || '');
        setPanNumber(data.panNumber || '');
        setSponsorName(data.sponsorName || '');
        setSponsorId(data.sponsorId || '');
      } catch (error) {
        console.log('Failed to load user data from storage', error);
      }
    };

    loadUserData();
  }, []);

  const handleUpdate = async () => {
    const userId = (await AsyncStorage.getItem('user_id'))?.trim();
    console.log('Raw user_id:', userId);

    if (!userId) {
      Alert.alert('Error', 'User ID not found or invalid');
      return;
    }

    if (
      !email
    ) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    const payload = {
      user_id: userId,
      email: email,
      account_holder_name: accountName,
      account_no: accountNumber,
      bank_name: bankName,
      ifsc_code: ifsc,
      branch: branch,
      pan_number: panNumber,
      sponsor_name: sponsorName,
      sponsor_id: sponsorId,
    };

    setLoading(true);

    try {
      const response = await fetch('https://masonshop.in/api/user-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('API Response:', data);
      console.log(payload);

      if (
        data.success === true ||
        data.status === true ||
        data.success === 1
      ) {
        await AsyncStorage.multiSet([
          ['email', email],
          ['accountName', accountName],
          ['accountNumber', accountNumber],
          ['bankName', bankName],
          ['ifsc', ifsc],
          ['branch', branch],
          ['panNumber', panNumber],
          ['sponsorName', sponsorName],
          ['sponsorId', sponsorId],
        ]);

        Alert.alert('Success', 'Details updated successfully');
      } else {
        Alert.alert('Error', data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Update Error:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };



  const fetchUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) return;
  
      const response = await axios.get(`https://masonshop.in/api/userslist?user_id=${userId}`);
      console.log('API Response:', response.data);
  
      if (response.data && Array.isArray(response.data.data)) {
        setUserData(response.data.data[0]);
        console.log(response.data.data[0])
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  
  const uploadImage = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    if (!userId) {
      Alert.alert('User ID missing');
      return;
    }
  
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });
  
    if (result.didCancel || !result.assets || result.assets.length === 0) {
      return;
    }
  
    const image = result.assets[0];
  
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('profile', {
      uri: image.uri,
      name: image.fileName || 'upload.jpg',
      type: image.type || 'image/jpeg',
    });
  
    try {
      const response = await fetch('https://masonshop.in/api/profile_image', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      const json = await response.json();
      console.log('Upload response:', json);
  
      if (json.status === true) {
        Alert.alert('Success', 'Image uploaded successfully!');
        navigation.replace('MyAccountKYC');
      } else {
        Alert.alert('Error', json.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', error.message);
    }
  };
  

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Get user ID from AsyncStorage
        const userId = await AsyncStorage.getItem('user_id'); // replace 'user_id' with your actual key

        if (!userId) {
          console.log('User ID not found in AsyncStorage');
          setLoading(false);
          return;
        }


        const response = await fetch(`https://masonshop.in/api/user_accoount_details?user_id=${userId}`);
      const json = await response.json();

      if (json.status && json.data) {
        const data = json.data;
        const sponsor = json.sponser_name;
      
        setEmail(data.email || '');
        setAccountName(data.name || '');
        setAccountNumber(data.account_no || '');
        setBankName(data.bank_name || '');
        setIFSC(data.ifsc_code || '');
        setBranch(data.branch || '');
        setPanNumber(data.pan_number || '');
      
        setSponsorId(data.sponsor_id || '');
      
        // Only set sponsor name if sponsor id is valid (not empty or null)
        if (data.sponsor_id && data.sponsor_id.trim() !== '') {
          setSponsorName(sponsor?.name || '');
        } else {
          setSponsorName(''); 
        }
      }      
      } catch (error) {
        console.error('Error fetching user account details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);


  return (
    <ImageBackground
      source={require('../icons/masonbackground.jpeg')}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>

        {userData ? (
  <View style={styles.header}>
    
    <View style={styles.userDetails}>
      <Text style={styles.userName}>{userData.username}</Text>
      <Text style={styles.userInfo}>+91 {userData.phone}</Text>
      <Text style={styles.userInfo}>ID-{userData.user_id}</Text>
    </View>

<Image
      source={{ uri: userData.profile }}
      style={{ width: 80, height: 80, borderRadius: 40 }} // or use a style from styles.image
    />
    
    <Button
        icon="plus-circle"
        color="#fff"
        style={styles.editButton}
        onPress={uploadImage}
      />
  </View>
) : (
  <Text>Loading user data...</Text>
)}

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Bank Details */}
        <Text style={styles.sectionTitle}>Bank Details</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Account Holder Name"
            value={accountName}
            onChangeText={setAccountName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Account Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Account Number"
            keyboardType="numeric"
            value={accountNumber}
            onChangeText={setAccountNumber}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bank Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Bank Name"
            value={bankName}
            onChangeText={setBankName}
          />
        </View>

        <View style={styles.rowContainer}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>IFSC</Text>
            <TextInput
              style={styles.input}
              placeholder="IFSC Code"
              value={ifsc}
              onChangeText={setIFSC}
            />
          </View>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>Branch</Text>
            <TextInput
              style={styles.input}
              placeholder="Branch"
              value={branch}
              onChangeText={setBranch}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>PAN Number</Text>
          <TextInput
            style={styles.input}
            placeholder="PAN Number"
            value={panNumber}
            onChangeText={setPanNumber}
          />
        </View>

        <View style={styles.rowContainer}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>Sponsor Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Sponsor Name"
              value={sponsorName}
              onChangeText={setSponsorName}
            />
          </View>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>Referral ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Sponsor ID"
              value={sponsorId}
              onChangeText={setSponsorId}
            />
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>
              {loading ? 'Updating...' : 'Update'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    backgroundColor: '#d32f2f',
    borderRadius: 10,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginLeft: 10,
  },
  editButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(3),
  },
  button: {
    backgroundColor: '#f60138',
    borderRadius: 10,
    paddingHorizontal: responsiveWidth(8),
    paddingVertical: responsiveHeight(1.5),
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
export default MyAccountKYC;
