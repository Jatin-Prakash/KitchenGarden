import { View, Text } from "react-native";
export default function Buyer() {
  return (
    <View style={{flex:1, padding:16}}>
      <Text style={{fontSize:22, fontWeight:"700"}}>Buyer</Text>
      <Text style={{marginTop:8, opacity:.75}}>
        Add product list + cart + calories + Stripe checkout redirect (webview/deeplink).
      </Text>
    </View>
  );
}
