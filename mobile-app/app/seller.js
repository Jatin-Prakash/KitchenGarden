import { View, Text } from "react-native";
export default function Seller() {
  return (
    <View style={{flex:1, padding:16}}>
      <Text style={{fontSize:22, fontWeight:"700"}}>Seller</Text>
      <Text style={{marginTop:8, opacity:.75}}>
        Add OTP login and product upload (image/price/quantity).
      </Text>
    </View>
  );
}
