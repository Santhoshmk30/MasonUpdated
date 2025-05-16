import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Share,
  ActivityIndicator,
  ToastAndroid,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import RNFetchBlob from 'rn-fetch-blob';

const ReferralScreen = () => {
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const referralCode = 'M805440';
  const appLink = `https://malgopay.app/download?ref=${referralCode}`;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const id = await AsyncStorage.getItem('user_id');
        console.log('Fetched user_id:', id);
        setUserId(id);

        if (!id) {
          console.warn('No user_id found in AsyncStorage');
          setLoading(false);
          return;
        }

        const response = await fetch(`https://masonshop.in/api/user_ref_qrcode?user_id=${id}`);
        const json = await response.json();
        console.log('API JSON response:', json);

        if (json.status && json.qr_code_url) {
          setQrImage(json.qr_code_url);
          console.log('QR image URL:', json.qr_code_url);
        } else {
          console.warn('Invalid response or QR code URL missing');
          setQrImage(null);
        }
      } catch (error) {
        console.error('Error fetching QR code:', error);
        setQrImage(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const inviteLink = `https://masonshop.in/${userId}`;

  const handleCopy = () => {
    if (!userId) return;
    Clipboard.setString(inviteLink);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Link copied to clipboard', ToastAndroid.SHORT);
    } else {
      Alert.alert('Copied', 'Link copied to clipboard');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: inviteLink });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') return true;
    if (Platform.Version >= 29) return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'App needs access to your storage to download the QR code',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handleDownload = async () => {
    if (!qrImage) {
      Alert.alert('No QR code to download');
      return;
    }
  
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Storage permission denied');
      return;
    }
  
    const { config, fs } = RNFetchBlob;
    const PictureDir = fs.dirs.DownloadDir;
    const fileName = `mason_qr_${Date.now()}.png`;
    const filePath = `${PictureDir}/${fileName}`;
  
    config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: filePath,
        description: 'QR code image',
        mime: 'image/png',
      },
    })
      .fetch('GET', qrImage)
      .then(res => {
        console.log('Download success, file saved to:', res.path());
        Alert.alert('Download Success', 'File saved to Downloads folder.');
      })
      .catch(error => {
        console.log('Download error:', error.message);
        Alert.alert('Download Failed', error.message || 'Something went wrong');
      });
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.downloadText}>Download & Install Mason App</Text>

      <View style={styles.qrContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : qrImage ? (
          <Image
            source={{ uri: qrImage }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Text>QR Code not available</Text>
        )}
        <Text style={styles.scanText}>Scan me</Text>
      </View>

      <Text style={styles.referralCode}>Referral Code: {referralCode}</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={handleShare}>
          <Icon name="share-variant-outline" size={24} color="#000" style={styles.copyIcon} />
          <Text> Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleCopy}>
          <Icon name="content-copy" size={24} color="#000" style={styles.copyIcon} />
          <Text> Copy Link</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleDownload}>
          <Icon name="download" size={24} color="#000" style={styles.copyIcon} />
          <Text> Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  downloadText: {
    fontSize: 16,
    marginBottom: 20,
  },
  qrContainer: {
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  image: {
    width: 270,
    height: 280,
  },
  scanText: {
    marginTop: 10,
    fontSize: 16,
  },
  referralCode: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyIcon: {
    marginRight: 6,
  },
});

export default ReferralScreen;
