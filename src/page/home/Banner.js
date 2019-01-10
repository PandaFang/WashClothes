import React, {Component} from "react";
import { StyleSheet, 
  View, 
  Text, 
  Image,
  Dimensions,
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width, height} = Dimensions.get('window')

class Banner extends Component {
    render() {
        return(
            <View style={styles.bannerBox}>
            <Image style={styles.banner} source={require('../../assets/banner1.jpg')}/>
            <View style={styles.city}>
              <Icon name="place" size={20} />
              <Text>武汉</Text>
            </View>
          </View>
        );
    }
}

const styles = StyleSheet.create( {
    bannerBox:{
      width:width,
      height: width / 2,
      backgroundColor:'red',
      position:'relative'
    },
    banner:{
      width:width,
      height: width / 2,
    },
    city:{
      position:'absolute',
      backgroundColor:'#ffffff66',
      top:10,
      alignSelf:'center',
      borderRadius:10,
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
    },
})

export default Banner;