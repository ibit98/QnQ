import React from "react";

import { NavigationContainer } from "@react-navigation/native";

import QnQDrawer from "./app/config/navigation";

export default function App() {
  return (
    <NavigationContainer>
      <QnQDrawer />
    </NavigationContainer>
  );
}
