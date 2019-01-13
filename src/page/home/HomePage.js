import React, {Component} from "react";
import {
    StyleSheet,
    View,
    Image,
    Dimensions, StatusBar,
} from "react-native";
import Banner from './Banner'
import Service from './Service'
import Help from './Help'
import Constant from '../../Constant'
  
const {width, height} = Dimensions.get('window')
// 首页
class HomePage extends Component {
    render() {
      console.log('width:' , width)
      return (
        <View>
        <StatusBar
            backgroundColor={Constant.colorTheme}
            barStyle="light-content" />
          {/* 轮播图区域*/}
          <Banner />
          {/* 专业清洗区域 */}
          <Service />

          {/* 服务介绍 价格 意见反馈 团体洗衣等区域 */}
          <Help />
          {/* 用户点评轮播区域 */}
          <View>
            <Image style={styles.commentBg} source={require('../../assets/comment_bg.jpg')}/>
          </View>

        </View>
      );
    }
}

const styles = StyleSheet.create( {

  commentBg:{

  }

})

export default HomePage
