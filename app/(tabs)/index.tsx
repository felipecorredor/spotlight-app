import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "../../styles/auth.styles";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>HEllo World</Text>
      <Link href="/profile">Profile</Link>
    </View>
  );
}
