import React, {Component} from "react";
import { StyleSheet, 
  View, 
  Text, 
  Image,
  Dimensions,
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width, height} = Dimensions.get('window')

class Help extends Component {
    render() {
        return(
            <View style={styles.serviceInfoBox}>
                <View style={styles.serviceInfoItem}>
                <View style={styles.serviceInfoItemIcon}><Icon name="computer" size={40}/></View>
                <Text style={styles.serviceInfoItemTitle}>服务介绍</Text>
                </View>
                <View style={styles.serviceInfoItem}>
                <View style={styles.serviceInfoItemIcon}><Icon name="explore" size={40}/></View>
                <Text style={styles.serviceInfoItemTitle}>服务范围</Text>
                </View>
                <View style={styles.serviceInfoItem}>
                <View style={styles.serviceInfoItemIcon}><Icon name="assignment" size={40}/></View>
                <Text style={styles.serviceInfoItemTitle}>价目中心</Text>
                </View>
                <View style={styles.serviceInfoItem}>
                <View style={styles.serviceInfoItemIcon}><Icon name="comment" size={40}/></View>
                <Text style={styles.serviceInfoItemTitle}>意见反馈</Text>
                </View>
                <View style={styles.serviceInfoItem}>
                <View style={styles.serviceInfoItemIcon}><Icon name="group" size={40}/></View>
                <Text style={styles.serviceInfoItemTitle}>团体洗衣</Text>
                </View>
          </View>
        )
    }
}

const styles = StyleSheet.create( {

    serviceInfoBox:{
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
    },
    serviceInfoItem:{
      width:'20%',
      justifyContent:'center',
      alignItems:'center',
    },
    serviceInfoItemTitle:{
      fontSize:14,
      textAlign:'center'
    },
    serviceInfoItemIcon:{
      width:'70%',
      height:width / 5 * 0.7,
      borderWidth:1,
      borderColor:'gray',
      borderRadius:10,
      justifyContent:'center',
      alignItems:'center',
    },
})

export default Help;