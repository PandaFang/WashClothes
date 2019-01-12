import React, { Component } from "react";
import {
    Dimensions,
    StyleSheet,
    View,
    Text,
    ImageBackground,
    Image,
    TouchableHighlight,
    Linking,
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
const tel = 'tel:110100';
// 个人中心
class MyPage extends Component {
    _contact() {
        if (Linking.canOpenURL(tel)) {
            Linking.openURL(tel);
        } else {
            console.log('没有发现 电话应用');
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <ImageBackground style={styles.top} source={require('../../assets/my-center-bg.jpg')}>
                    <View style={styles.inTopLeft}>
                        <Image style={styles.avatar} source={require('../../assets/avatar.jpg')} />
                        <View>
                            <Text>立即登录</Text>
                            <Text>让生活更自在</Text>
                        </View>
                    </View>
                    <Text style={styles.inTopRight}>充值</Text>
                </ImageBackground>

                {/* 钱包 发票 */}
                <View style={styles.wallet}>
                    <Icon name="ios-card" size={20} style={{ color: '#e6b18f' }} />
                    <Text>我的钱包</Text>
                    <Text style={{ flex: 1, textAlign: 'right', color: '#73dee0' }} >开发票</Text>
                </View>

                {/* 余额 优惠券区域 */}
                <View style={styles.balance}>
                    <View style={styles.balanceItem}>
                        <Text>0张</Text>
                        <Text>优惠券</Text>
                    </View>
                    <View style={styles.balanceItem}>
                        <Text>￥0.00</Text>
                        <Text>余额</Text>
                    </View>
                    <View style={styles.balanceItem}>
                        <Text>0张</Text>
                        <Text>礼品卡</Text>
                    </View>
                    <View style={styles.balanceItem}>
                        <Text>0张</Text>
                        <Text>优惠券</Text>
                    </View>
                </View>
                {/* 常用地址 积分商城等区域 */}

                <View style={styles.othersBox}>
                    <View style={styles.othersItem}>
                        <Icon name="ios-pin" size={23} style={{ color: '#52b6c1' }} />
                        <Text style={{ marginLeft: 10 }}>常用地址</Text>
                        <Text style={{ position: 'absolute', top: 10, right: 0 }}>></Text>
                    </View>
                    <View style={styles.othersItem}>
                        <Icon name="ios-heart" size={20} style={{ color: '#e7b6c3' }} />
                        <Text style={{ marginLeft: 10 }}>推荐有奖</Text>
                        <Text style={{ position: 'absolute', top: 10, right: 0 }}>></Text>
                    </View>
                    <View style={[styles.othersItem, styles.bottomBorder]}>
                        <Icon name="ios-basket" size={20} style={{ color: '#4dc78c' }} />
                        <Text style={{ marginLeft: 10 }}>积分商城</Text>
                        <Text style={{ position: 'absolute', top: 10, right: 0 }}>></Text>
                    </View>
                    <View style={styles.othersItem}>
                        <Icon name="ios-chatboxes" size={20} style={{ color: '#858283' }} />
                        <Text style={{ marginLeft: 10 }}>意见反馈</Text>
                        <Text style={{ position: 'absolute', top: 10, right: 0 }}>></Text>
                    </View>
                    <View style={[styles.othersItem, styles.bottomBorder]}>
                        <Icon name="ios-more" size={20} style={{ color: '#858283' }} />
                        <Text style={{ marginLeft: 10 }}>更多</Text>
                        <Text style={{ position: 'absolute', top: 10, right: 0 }}>></Text>
                    </View>
                </View>

                {/* 客服电话 */}
                <TouchableHighlight onPress={ this._contact }>
                    <View style={styles.call}>
                        <Icon name="ios-call" size={25} style={{ color: '#7dd5d5' }} />
                        <Text>客服电话</Text>
                    </View>
                </TouchableHighlight>
                {/* 黑条 无其他作用 */}
                <View style={{height:10, backgroundColor:'#00000006'}}></View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    top: {
        width: width,
        height: width / 3,
    },

    inTopLeft: {
        position: 'absolute',
        left: 20,
        top: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    inTopRight: {
        position: 'absolute',
        top: 50,
        right: 30,
        color:'#f4aa98'
    },

    avatar: {
        width: 60,
        height: 60,
        borderRadius: 100,
        marginRight: 10
    },

    wallet: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 4,
        borderTopColor: '#00000006',
        borderBottomWidth: 4,
        borderBottomColor: '#00000006',
    },

    balance: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 4,
        borderBottomColor: '#00000006',
    },

    balanceItem: {
        alignItems: 'center',
    },

    othersBox: {
        paddingLeft: 10,
        paddingRight:10,
    },

    othersItem: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        lineHeight: 40,
    },

    bottomBorder: {
        borderBottomWidth: 4,
        borderBottomColor: '#00000006',
    },

    call: {
        flexDirection: 'row',
        height:40,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign:'center',
    }

})

export default MyPage;