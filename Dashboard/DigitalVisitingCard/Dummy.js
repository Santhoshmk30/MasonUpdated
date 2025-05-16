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
   <TouchableOpacity style={styles.uploadBox} onPress={imagehandleMediaPick}>
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
   <TouchableOpacity style={styles.uploadBox} onPress={imagehandleMediaPick}>
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
   <TouchableOpacity style={styles.uploadBox} onPress={imagehandleMediaPick}>
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

  
  <View style={styles.footer}>
  <TouchableOpacity style={styles.backButton1} onPress={() => setCurrentStep(2)}>
  <Text style={styles.backButtonText}>Back</Text>
</TouchableOpacity>

    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
      <Text style={styles.submitText}>Submit</Text>
    </TouchableOpacity>
  </View>

  
</View>
