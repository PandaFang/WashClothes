import React, {Component} from "react";
import { View, Text, StatusBar, TouchableOpacity } from "react-native";
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons'
class TitleBar extends Component {
    render() {
        return(
            <View>
                <StatusBar
                  backgroundColor="blue"
                  barStyle="light-content" />
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingLeft:10, paddingRight:10}}>
                    <TouchableOpacity onPress={this.props.goBack.bind(this)}>
                        <Icon name="ios-arrow-back" size={30} />
                    </TouchableOpacity>
                    <Text>{this.props.title}</Text>
                    <Icon name={'ios-help-circle'} size={30} />
                </View>
            </View>
        )
    }
}

TitleBar.propTypes = {
    title:PropTypes.string,
    goBack: PropTypes.func.isRequired,
};


export default TitleBar;