'use strict';

// import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView,
    TouchableHighlight,
    Image,
    Platform,
    Dimensions,
    ImageBackground,
    Linking,
    BackHandler,
    DeviceEventEmitter
} from 'react-native';
import { connect } from 'react-redux';
import TStatusBar from './../../components/public/TStatusBar';
import ListItem from './../../components/ListItem';
// import Color from './../../constants/Color';
import Constants from './../../constants/Constant';
// import Swiper from 'react-native-swiper';
import { refreshUserData } from './../../redux/actions/LoginAction'
import { getBannerData, getOrderInfoNum } from './../../redux/actions/MineAction'

import { clickEvent } from '../../redux/actions/GaAction';

const { ScreenWidth, ScreenHeight, width, height } = Dimensions.get('window');
const qrcodeImg = require('./../../assets/mine/qrcode.png');
const settingImg = require('./../../assets/mine/setting.png');
const userLogo = require('./../../assets/mine/today_logo.png');
const personBg = require('./../../assets/mine/person_bg.png');
// const personBanner = require('./../../assets/mine/person_banner.png');
const orderIcon = require('./../../assets/mine/order_icon.png');
const orderSale = require('./../../assets/mine/order_sale.png');
const orderSending = require('./../../assets/mine/order_sending.png');
const orderWaitPay = require('./../../assets/mine/order_waitpay.png');
const orderWaitsend = require('./../../assets/mine/order_waitsend.png');
const orderReady = require('./../../assets/mine/order_ready.png');

const problemIcon = require('./../../assets/mine/problem_icon.png');

const addressShipping = require('./../../assets/mine/address_shipping.png');
// const buyCard = require('./../../assets/mine/buy_card.png');
const telUsIcon = require('./../../assets/mine/tel_us.png');


const barBg = require('./../../assets/nav_bg.png');

let topHeight = 0;
if (Platform.OS == 'android') {
    topHeight = 44
} else if (Platform.OS == 'ios') {
    topHeight = 64
}


class MinePage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isFromHome: false       // 是否是从首页过来的
        }

        this._handleAndroidBack = this._handleAndroidBack.bind(this)
    }
    doLogin() {
        this.props.navigation.navigate('Login')
    }

    gotoViewPath(path, type) {
        const userInfo = this.props.userData
        if (!userInfo || !userInfo.id) {
            // 如果未获取用户信息，先跳到登录页面
            this.props.navigation.navigate('Login')
            return false
        }
        if (type == 'navi') {
            this.props.navigation.navigate(path);
        } else {
            this.props.navigation.navigate("Webview", { path: path });
        }
    }

    /**
     * 进入二维码页面
     */
    gotoQrcode() {
        this.props.dispatch(clickEvent('showPayCodeDialog', 'MinePage'));
        DeviceEventEmitter.emit(Constants.Payment_Code_Listen, null);
    }

    /**
     * 进入设置页面
     */
    gotoSetting() {
        this.gotoViewPath("Setting", "navi")
    }

    /**
     * 头部右侧内容
     */
    getRight() {
        return (
            <View style={{
                flexDirection: 'row',
                height: 44,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <TouchableOpacity onPress={() => { this.gotoQrcode() }}>
                    <Image style={{
                        width: 20,
                        height: 20
                    }} source={qrcodeImg} />
                </TouchableOpacity>

                <TouchableOpacity style={{
                    marginRight: 20,
                    marginLeft: 20
                }} onPress={() => { this.gotoSetting() }}>

                    <Image style={{
                        width: 23,
                        height: 23
                    }} source={settingImg} />
                </TouchableOpacity>
            </View>
        )
    }

    //拨打电话
    linking = (url) => {
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }

    /**
     * 滚动事件
     */
    onScroll() {

    }

    /**
     * 进入管理地址
     */
    gotoAddressPage() {
        this.props.navigation.navigate('AddressManage')
    }
    /**
     * 获取bannerData
     */
    getBanner() {
        const { dispatch } = this.props;
        dispatch(getBannerData())
    }
    /**
     * 广告位点击处理
     */
    _bannerPress(obj) {
        let banner_url = obj.banner_url
        if (!banner_url) {
            return
        }
        // 若参入参数为数字，则是去领券页面
        else if (!isNaN(banner_url)) {
            this.props.navigation.navigate('GetCoupons', {
                id: banner_url
            })
        }
        //若传入参数包含http
        else if (banner_url.indexOf('http') >= 0) {
            this.props.navigation.navigate('Webview', {
                path: banner_url
            })
        }
        // 若传入参数为非空字符串，则取会员中心页面，此处要校验登录状态
        else if (banner_url != '' && banner_url.indexOf('/') >= 0) {
            if (!this.props.userData || !this.props.userData.id) {
                DeviceEventEmitter.emit(Constants.Login_Listen, null);
                return
            }
            this.props.navigation.navigate('Webview', {
                path: banner_url
            })
        }
    }
    /**
     * 广告位显示
     */
    bannerView() {
        if (this.props.banner.pic_url && this.props.banner.pic_url != '') {
            return (
                <View style={{
                    marginTop: 10
                }}>
                    <TouchableHighlight underlayColor='transparent'
                        onPress={this._bannerPress.bind(this, this.props.banner)} >
                        <Image style={{
                            width: '100%',
                            height: 100,
                            borderRadius: 3
                        }} source={{ uri: this.props.banner.pic_url }} />
                    </TouchableHighlight>
                </View>
            )
        } else {
            return null
        }
    }

    /**
     * 订单按钮点击
     * @param {} index 
     */
    _orderItemPress(index) {

        let orderStatus = Constants.Order_List_All;
        if (index == 0) {
            orderStatus = Constants.Order_List_Unpay;
        }

        this.props.navigation.navigate('MineOrderList', {
            'index': index,
            'allOrderStatus': orderStatus
        })
    }

    _handleAndroidBack() {
        console.log('--返回')
        if (Constants.isShow) {
            DeviceEventEmitter.emit(Constants.Payment_Code_Hide, null);

        } else {

            this.props.navigation.goBack(null)
        }
        return true;
    }

    componentWillMount() {
        // 判断是否来自首页
        this.setState({
            isFromHome: (this.props.navigation && this.props.navigation.state &&
                this.props.navigation.state.params &&
                this.props.navigation.state.params.isFromHome) ? true : false
        })
        // 刷新用户信息
        const { dispatch, userData } = this.props;
        this.getBanner()
        dispatch(refreshUserData())
        dispatch(getOrderInfoNum(userData.mobilePhone))
    }

    componentDidMount() {
        if (Platform.OS == 'android') {
            BackHandler.addEventListener('hardwareBackPress', this._handleAndroidBack)
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._handleAndroidBack);
    }

    render() {
        let { numList } = this.props
        let phoneNum = '' + this.props.userData.mobilePhone
        var phoneNumStr = phoneNum.substr(0, 3) + "****" + phoneNum.substr(7);
        return (
            <View style={{ flex: 1, backgroundColor: global.Color.pageBg }}>

                {/* <ImageBackground
                    style={{
                        width: '100%', height: topHeight, position: 'absolute', top: 0
                    }}
                    source={barBg}>
                    
                </ImageBackground>         */}

                <TStatusBar />

                <ImageBackground
                    style={{
                        width: '100%', height: 194
                    }}
                    imageStyle={{ resizeMode: 'stretch' }}
                    source={personBg}>

                    <View style={{ position: 'absolute', right: 0, top: Constants.navMargin }}>
                        {this.getRight()}
                    </View>

                </ImageBackground>

                <View style={{
                    height: height - 64 - (this.state.isFromHome ? 0 : Constants.tabHeight),
                    position: "absolute",
                    width: '100%',
                    marginTop: topHeight
                }}>
                    <ScrollView style={styles.main} onScroll={this.onScroll.bind(this)} bounces={false} >
                        <View style={styles.topBg}>
                            <View style={styles.userLogo}>
                                <TouchableOpacity onPress={() => { this.gotoViewPath('/personal/index') }}>
                                    <Image style={{
                                        width: 53,
                                        height: 53,
                                        borderRadius: 53 / 2
                                    }} source={userLogo} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.userName}>
                                <TouchableOpacity onPress={() => { this.gotoViewPath('/personal/index') }}>
                                    <Text style={styles.userNameText}>Hi~ {this.props.userData && this.props.userData.memberName ? this.props.userData.memberName : phoneNumStr}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.topBar}>
                            <TouchableOpacity style={styles.topBarItem} onPress={() => { this.gotoViewPath('/coupon/index/availableCoupon') }}>
                                <Text style={styles.topBarItemCount}>{this.props.userOwn && this.props.userOwn.couponAmount ? this.props.userOwn.couponAmount : 0}</Text>
                                <Text style={styles.topBarItemType}>优惠券</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.topBarItem} onPress={() => { this.gotoViewPath('/goldMall/index') }}>
                                <Text style={styles.topBarItemCount}>{this.props.userOwn && this.props.userOwn.memberScore ? this.props.userOwn.memberScore : 0}</Text>
                                <Text style={styles.topBarItemType}>今币</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.topBarItem} onPress={() => { this.gotoViewPath('/giftCard/index/getGiftCard') }}>
                                <Text style={styles.topBarItemCount}>{this.props.userOwn && this.props.userOwn.memberBalance ? this.props.userOwn.memberBalance : 0}</Text>
                                <Text style={styles.topBarItemType}>礼品卡余额</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.orderSection}>
                            <View style={{
                                paddingHorizontal: 15
                            }}>
                                <ListItem styles={styles.listNavItem}
                                    onPressItem={(e) => {
                                        this.props.navigation.navigate('MineOrderList', {
                                            'index': 0,
                                            'allOrderStatus': Constants.Order_List_All
                                        })
                                    }}
                                    icon={orderIcon}
                                    label='我的订单' remark='全部订单'></ListItem>
                            </View>
                            <View style={styles.orderUl}>
                                <TouchableOpacity
                                    style={styles.orderItem}
                                    onPress={this._orderItemPress.bind(this, 0)} >
                                    {
                                        numList && numList.pendingPayment && numList.pendingPayment > 0 ?
                                            (<View style={styles.circleView}>
                                                <Text style={styles.circle}>{numList.pendingPayment}</Text>
                                            </View>) : null
                                    }
                                    <Image style={{
                                        width: 46,
                                        height: 46,
                                        borderRadius: 23
                                    }} source={orderWaitPay} />
                                    <Text style={styles.orderItemType}>待付款</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.orderItem}
                                    onPress={this._orderItemPress.bind(this, 1)} >
                                    {
                                        numList && numList.haveReadyGood && numList.haveReadyGood > 0 ?
                                            (<View style={styles.circleView}>
                                                <Text style={styles.circle}>{numList.haveReadyGood}</Text>
                                            </View>) : null
                                    }
                                    <Image style={{
                                        width: 46,
                                        height: 46,
                                        borderRadius: 23
                                    }} source={orderReady} />
                                    <Text style={styles.orderItemType}>备货中</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.orderItem}
                                    onPress={this._orderItemPress.bind(this, 2)}>
                                    {
                                        numList && numList.sendingGood && numList.sendingGood > 0 ?
                                            (<View style={styles.circleView}>
                                                <Text style={styles.circle}>{numList.sendingGood}</Text>
                                            </View>) : null
                                    }
                                    <Image style={{
                                        width: 46,
                                        height: 46,
                                        borderRadius: 23
                                    }} source={orderSending} />
                                    <Text style={styles.orderItemType}>配送中</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.orderItem}
                                    onPress={this._orderItemPress.bind(this, 3)}>
                                    {
                                        numList && numList.pendingTakeByMyself && numList.pendingTakeByMyself > 0 ?
                                            (<View style={styles.circleView}>
                                                <Text style={styles.circle}>{numList.pendingTakeByMyself}</Text>
                                            </View>
                                            ) : null
                                    }
                                    <Image style={{
                                        width: 46,
                                        height: 46,
                                        borderRadius: 23
                                    }} source={orderWaitsend} />
                                    <Text style={styles.orderItemType}>待自提</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.orderItem}
                                    onPress={this._orderItemPress.bind(this, 4)}>
                                    {
                                        numList && numList.salfAfter && numList.salfAfter > 0 ?
                                            (<View style={styles.circleView}>
                                                <Text style={styles.circle}>{numList.salfAfter}</Text>
                                            </View>
                                            ) : null
                                    }
                                    <Image style={{
                                        width: 46,
                                        height: 46,
                                        borderRadius: 23
                                    }} source={orderSale} />
                                    <Text style={styles.orderItemType}>售后</Text>
                                </TouchableOpacity>
                            </View>
                        </View>


                        {this.bannerView()}


                        {/* <View style={{
                            marginTop: 10,
                            borderRadius: 3,
                            backgroundColor: '#fff'
                        }}>
                            <ListItem styles={styles.listNavItem} icon={orderIcon} label='购买礼品卡'></ListItem>
                            
                        </View> */}



                        <View style={{
                            marginTop: 10,
                            borderRadius: 3,
                            backgroundColor: '#fff',
                            marginBottom: 10,
                            paddingHorizontal: 15
                        }}>
                            <ListItem styles={styles.listNavItem} onPressItem={(e) => { this.gotoAddressPage() }} icon={addressShipping} label='收货地址'></ListItem>
                            <ListItem styles={styles.listNavItem} onPressItem={(e) => { this.gotoViewPath('/qa/index') }} icon={problemIcon} label='常见问题'></ListItem>
                            {/* <ListItem styles={styles.listNavItem} icon={versionUp} label='版本更新'></ListItem> */}
                            <ListItem styles={styles.listNavItemWithNoBorder} onPressItem={(e) => { this.linking('tel:' + Constants.SerPhone) }} icon={telUsIcon} label='联系我们' ></ListItem>
                        </View>

                    </ScrollView>
                </View>
            </View>
        )
    }
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    navigationView: {
        top: 0
    },
    topBg: {
        height: 100,
        width: '100%',
        position: 'relative'
    },
    userInfo: {
        height: 120,
        width: '100%'
    },
    userLogo: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        width: '100%'
    },
    userName: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        width: '100%',
        marginTop: 10
    },
    userNameText: {
        color: '#fff'
    },
    main: {
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1
    },
    topBar: {
        borderRadius: 3,
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#fff'
    },
    topBarItem: {
        width: '33%',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center'
    },
    topBarItemCount: {
        fontSize: 24,
        height: 50,
        lineHeight: 60,
        color: '#333333'
    },
    topBarItemType: {
        fontSize: 12,
        height: 35,
        lineHeight: 20,
        color: '#666666'
    },
    orderSection: {
        borderRadius: 3,
        width: '100%',
        backgroundColor: '#fff',
        marginTop: 10
    },
    orderUl: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        alignContent: 'center',
        paddingBottom: 10,
        paddingTop: 10
    },
    orderItem: {
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        color: '#333333',
        position: 'relative'
    },
    orderItemType: {
        color: '#999999',
        paddingTop: 8,
        paddingBottom: 8
    },
    doc: {
        width: 6,
        height: 6,
        marginLeft: 5,
        borderRadius: 3,
        opacity: 0.3,
        backgroundColor: "#fffcf7"
    },

    activeDot: {
        width: 6,
        height: 6,
        marginLeft: 5,
        borderRadius: 3,
        backgroundColor: "#fffcf7"
    },
    listNavItem: {
        flex: 1,
        lineHeight: 45,
        height: 45,
        width: '100%',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#f6f6f6',
    },

    listNavItemWithNoBorder: {
        flex: 1,
        lineHeight: 45,
        height: 45,
        width: '100%'
    },
    circleView: {
        position: 'absolute',
        backgroundColor: '#fd6847',
        width: 14,
        height: 14,
        borderRadius: 7,
        top: 0,
        right: 14,
        zIndex: 1,
    },
    circle: {
        width: 14,
        height: 14,
        lineHeight: 14,
        fontSize: 10,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#ffffff'
    }
})

function getStore(store) {
    let data = store.get('loginReducer');
    let mine = store.get('mineReducer');
    let publicData = store.get('publicReducer');
    return {
        userData: data.get('userData'),
        userOwn: data.get('userOwn'),
        numList: mine.get('numList'),
        banner: mine.get('banner'),
        locationInfo: publicData.get('locationInfo'),
        locationStatus: publicData.get('locationStatus'),
        cityInfo: publicData.get('cityInfo'),
        cityStatus: publicData.get('cityStatus'),
    }
}

export default connect(getStore)(MinePage);