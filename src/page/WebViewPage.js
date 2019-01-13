import React, { Component } from "react";
import {
    Dimensions,
    StyleSheet,
    View,
    Text,
    WebView
} from "react-native";

export default class WebViewPage extends Component {

    render() {
        return(
            <WebView
                source={{uri: 'https://github.com/facebook/react-native'}}
                style={{marginTop: 1}}
            />
        )
    }
}