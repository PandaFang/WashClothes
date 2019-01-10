import React, {Component} from "react";
import { View, Text, StatusBar } from "react-native";

class TitleBar extends Component {
    render() {
        return(
            <StatusBar
              backgroundColor="blue"
              barStyle="light-content" />
        )
    }
}  

export default TitleBar;