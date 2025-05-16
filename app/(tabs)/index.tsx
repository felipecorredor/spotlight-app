import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View>
      <Text>HEllo World</Text>
      <Link href="/profile">Profile</Link>
    </View>
  );
}
