import React from "react";

import { NavigationContainer } from "@react-navigation/native";

import QnQDrawer from "./app/config/navigation";

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

export default function App() {
  return (
    <NavigationContainer>
      <QnQDrawer />
    </NavigationContainer>
  );
}
