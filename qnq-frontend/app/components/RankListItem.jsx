import React, { PureComponent } from "react";

import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

export default class RankListItem extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      user: { name, reputationScore },
      rank,
    } = this.props;

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        margin: 6,
      },
      userCard: {
        backgroundColor:
          rank === 1
            ? "gold"
            : rank === 2
            ? "silver"
            : rank === 3
            ? "#b08d57"
            : "#fffaf0",
        borderRadius: 5,
        flex: 1,
        elevation: 2,
        padding: 10,
      },
      banner: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      },
      rank: {
        color: "black",
        fontFamily: "sans-serif-thin",
      },
      name: {
        fontFamily: "monospace",
      },
    });

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.userCard}
          onPress={() => console.log(`Should navigate to ${name}\'s page.`)}
        >
          <View style={styles.banner}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.rank}>{rank}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
