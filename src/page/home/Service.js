import React, {Component} from "react";
import { StyleSheet, 
  View, 
  Text, 
  Image,
  Dimensions,
} from "react-native";

const {width, height} = Dimensions.get('window')

class Service extends Component {
    render() {
        return(
            <View>
                <Text style={styles.cleanBoxTitle}>专业清洗</Text>
                <View style={styles.cleanBox}>
                    <View style={styles.claenItem}>
                        <Text style={styles.cleanItemTitle}>洗衣</Text>
                        <Image style={styles.cleanItemImage} source={require('../../assets/chenyi.jpg')}/>
                    </View>
                    <View style={styles.claenItem}>
                        <Text style={styles.cleanItemTitle}>洗鞋</Text>
                        <Image style={styles.cleanItemImage} source={require('../../assets/xiezi.jpg')}/>
                    </View>
                    <View style={styles.claenItem}>
                        <Text style={styles.cleanItemTitle}>洗家纺</Text>
                        <Image style={styles.cleanItemImage} source={require('../../assets/jiafang.jpg')}/>
                    </View>
                    <View style={styles.claenItem}>
                        <Text style={styles.cleanItemTitle}>洗窗帘</Text>
                        <Image style={styles.cleanItemImage} source={require('../../assets/chuanglian.jpg')}/>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cleanBoxTitle:{
        backgroundColor:'white',
        textAlign:'center',
        marginTop:10,
        marginBottom:15,
      },
      cleanBox:{
        backgroundColor:'white',
        flexDirection:'row',
        justifyContent:'center',
        borderBottomWidth:10,
        borderBottomColor:'#f3f7fa'
      },
      claenItem:{
        width:'25%',
        justifyContent:'center',
        alignItems:'center',
      },
      cleanItemTitle:{
        fontSize:14,
        marginBottom:10,
      },
      cleanItemImage:{
        width:'70%',
        height: width /4 * 0.7,
      },
})
export default Service;