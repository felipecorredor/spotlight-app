import { useAuth } from "@clerk/clerk-expo";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const { signOut } = useAuth();

  return (
    <View>
      <Text>HEllo World</Text>
      <TouchableOpacity onPress={() => signOut()}>
        <Text style={{ color: "white" }}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
