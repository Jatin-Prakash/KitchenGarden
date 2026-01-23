import { View, Text, Pressable, ImageBackground } from "react-native";
import { router } from "expo-router";

export default function Home() {
  return (
    <ImageBackground source={require("../assets/splash.jpg")} style={{flex:1}} resizeMode="cover">
      <View style={{flex:1, backgroundColor:"rgba(0,60,0,0.55)", padding:20, justifyContent:"center"}}>
        <Text style={{color:"#fff", fontSize:40, fontWeight:"800"}}>Kitchen Garden</Text>
        <Text style={{color:"#fff", marginTop:10, fontSize:16, maxWidth:320}}>
          Fresh from local sellers to your home.
        </Text>

        <View style={{flexDirection:"row", gap:12, marginTop:18, flexWrap:"wrap"}}>
          <Pressable onPress={() => router.push("/buyer")} style={{backgroundColor:"#fff", paddingVertical:10, paddingHorizontal:14, borderRadius:14}}>
            <Text style={{color:"#0f3d1e", fontWeight:"700"}}>Buyer</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/seller")} style={{backgroundColor:"#1B5E20", paddingVertical:10, paddingHorizontal:14, borderRadius:14}}>
            <Text style={{color:"#fff", fontWeight:"700"}}>Seller</Text>
          </Pressable>
        </View>

        <Text style={{color:"rgba(255,255,255,.85)", marginTop:14, fontSize:12}}>
          Starter UI. Add Supabase OTP + GraphQL + Stripe checkout.
        </Text>
      </View>
    </ImageBackground>
  );
}
