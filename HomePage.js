'use strict';

import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Platform,
    Image,
    ScrollView,
    SectionList,
    TouchableHighlight,
    DeviceEventEmitter,
    NativeModules,
    RefreshControl,
    NativeAppEventEmitter,
    Animated,
    BackHandler,
    AsyncStorage,
    ToastAndroid,
    PermissionsAndroid,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import JPushModule from 'jpush-react-native';

import Constants from './../../constants/Constant';
import TStatusBar from '../../components/public/TStatusBar'
/**
 * 组件
 */
import Swiper from 'react-native-swiper';
import HomeBanner from './components/HomeBanner';

/**
 * redux
 */
import { getHomeData, getProductByCurTime } from './../../redux/actions/HomeAction';
import { updateCartProduct, updateCartCount } from '../../redux/actions/CartAction';
import NetImage from '../../components/image/NetImage';
import { clickEvent } from '../../redux/actions/GaAction';

import { initOrderInfo } from '../../redux/actions/CheckoutAction'


import {
    updatePageData
} from './../../redux/actions/ClassifyAction'

const CartIcon = require('../../assets/order/shop_cart.png');
const MinusIcon = require('../../assets/order/minus.png');
const AddIcon = require('../../assets/order/add.png');
const LeftMenuWidth = 20;
const ImageSize = 90;
const swipeBannerImg = require('./../../assets/home/home_swipe_banner.png')
const arrowRightIcon = require('./../../assets/next_icon.png')
const scanBuyIcon = require('./../../assets/home/scan_buy.png')

const ImageResizeMode = 'stretch';


class HomePage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isRefresh: false
        }
    }

    /**
     * 初始化购物车
     */
    _initShopCart() {
        if (this.props.orderShop != null) {
            let key = this.props.orderShop.store_code + '';
            const { dispatch } = this.props;
            //购物车商品
            AsyncStorage.getItem(Constants.Key_Cart_Product + key, (error, result) => {
                dispatch(updateCartProduct(Constants.Key_Cart_Product + key, JSON.parse(result) || []))
            })
            //购物车数量
            AsyncStorage.getItem(Constants.Key_Cart_Count + key, (error, result) => {
                dispatch(updateCartCount(Constants.Key_Cart_Count + key, parseInt(result) || 0))
            })
        }
    }

    componentWillMount() {

        console.log('当前门店', this.props.orderShop)

        this._initShopCart()

        //开始定位
        NativeModules.TodayTool.startLocationInfo();

        const { dispatch } = this.props;
        //获取banner数据
        dispatch(getHomeData(this))
        //当前时间商品
        dispatch(getProductByCurTime(this.props.cartProductArray))
    }

    componentDidMount() {
        this._handleNotifications();
    }

    /**
     * 获取极光推送的id
     */
    getRegistrationID(registrationId) {
        console.log('获取registrationId', registrationId)
        global.registrationId = registrationId
        global.Tool.devicesPushServer()
    }

    /**
     * 清除推送消息
     */
    cleanNotifications() {
        if (Platform.OS == "android") {
            JPushModule.clearAllNotifications()
        } else {
            JPushModule.setBadge(0, () => { })
        }
    }

    /**
     * 通知处理
     */
    _handleNotifications() {
        if (Platform.OS === 'android') {
            JPushModule.initPush()
            JPushModule.getInfo(map => {
                this.setState({
                    appkey: map.myAppKey,
                    imei: map.myImei,
                    package: map.myPackageName,
                    deviceId: map.myDeviceId,
                    version: map.myVersion
                })
            })
            JPushModule.notifyJSDidLoad(resultCode => {
                if (resultCode === 0) {
                }
            })
            if (!NativeModules.TodayTool.checkNotificationAllowed()) {
                // NativeModules.TodayTool.openNotificationSettingPage();
            }
        } else {
            JPushModule.setupPush()
        }

        JPushModule.getRegistrationID((registrationId) => {
            console.log('获取rJPushModuleegistrationId', registrationId)
            try {
                if (registrationId) {
                    this.getRegistrationID(registrationId)
                } else if (__DEV__) {
                    const SIMULATOR_PUSH_TOKEN = (Platform.OS == 'android') ? 'ANDROID_EMULATOR_PUSH_TOKEN' : 'IOS_SIMULATOR_PUSH_TOKEN'
                    this.getRegistrationID(SIMULATOR_PUSH_TOKEN)
                } else {
                    console.log('get jpush registration id failed')
                    // tracker.captureMessage('get jpush registration id failed')
                    // reject(new Error('registrationId_empty'))
                }
            } catch (e) {
                console.log('getRegistrationID failed: ', e)
            }

        });

        JPushModule.addReceiveCustomMsgListener((message) => {
            console.log('接收通知addReceiveCustomMsgListener', message);

        });

        //点击通知
        JPushModule.addReceiveOpenNotificationListener((data) => {
            console.log('通知--->', data)
            this.cleanNotifications();
            // if (Platform.OS != 'android') {
            //     Constants.Notify_Badge = Constants.Notify_Badge - 1;
            //     JPushModule.setBadge(Constants.Notify_Badge, (result) => {
            //         console.log('点击通知后剩余未读数量result', result)
            //         console.log('点击通知后剩余未读数量', Constants.Notify_Badge)
            //         if(result){

            //         }

            //     })
            // }


            let notifyData = null;
            if (Platform.OS == 'android') {
                notifyData = JSON.parse(data.extras)
            } else {
                notifyData = data.extras
            }


            if (notifyData != null && notifyData.type != null) {
                console.log('通知--->', notifyData.type)
                if (notifyData.type == '4') {
                    //售后订单
                    if (notifyData.complaintId != null && notifyData.number != null)
                        this.props.navigation.navigate('AfterSaleDetail', {
                            'complainId': notifyData.complaintId,
                            'orderId': notifyData.number,
                            'isNotify': true
                        })

                } else {
                    //销售订单
                    if (notifyData.number != null) {

                        DeviceEventEmitter.emit(Constants.Notify_Order_Detail_Refresh, notifyData.number)

                        this.props.navigation.navigate('OrderDetail', {
                            'orderNo': notifyData.number,
                            'isNotify': true
                        })
                    }
                }
            }
        })

        //接收通知
        JPushModule.addReceiveNotificationListener((data) => {
            console.log("receive notification: ", data);
            this.cleanNotifications()


            let notifyData = null;
            if (Platform.OS == 'android') {
                notifyData = JSON.parse(data.extras)
            } else {
                notifyData = data.extras
            }

            if (notifyData != null && notifyData.type != null) {
                console.log('通知--->', notifyData.type)
                if (notifyData.type == '4') {
                    //售后订单
                    if (notifyData.complaintId != null && notifyData.number != null)
                        this.props.navigation.navigate('AfterSaleDetail', {
                            'complainId': notifyData.complaintId,
                            'orderId': notifyData.number,
                            'isNotify': true
                        })

                } else {
                    //销售订单
                    if (notifyData.number != null) {
                        DeviceEventEmitter.emit(Constants.Notify_Order_Detail_Refresh, notifyData.number)
                    }
                }
            }
        });
    }

    /**
    * 去选择城市
    */
    _toChooseCity() {
        this.props.navigation.navigate('ChooseCity')
    }

    /**
     * 去门店选择页面
     */
    goShopChoosePage() {
        this.props.navigation.navigate('BuyTypeTab', {
            getShopAddressData: (data) => {
                console.log('店铺数据', data)
                DeviceEventEmitter.emit(Constants.Notify_Update_Classify_Product, null)
            }
        });
    }

    /**
     * 去扫码购页面
     */
    goScanBuyPage() {
        if (this.props.orderShop == null) {
            //校验店铺
            this.props.navigation.navigate('BuyTypeTab', {
                getShopAddressData: (data) => {
                    console.log('店铺数据', data)
                    DeviceEventEmitter.emit(Constants.Notify_Update_Classify_Product, null)
                }
            });
        } else {
            this.props.navigation.navigate('ScanProduct')
        }
    }

    /**
     * 轮播banner点击事件
     */
    _itemPress(item) {
        console.log(item);
        this._handleBanner(item)
    }

    /**
     * icon点击
     * @param {*} item 
     */
    _onIconPressed(item) {

        console.log(item)

        if (item != null && item.accessory_type != null) {
            //验证登录
            if (!this.props.userData || !this.props.userData.id) {
                this.props.dispatch(clickEvent('showLoginDialog', 'HomePage'));
                DeviceEventEmitter.emit(Constants.Login_Listen, null);
                return
            }

            let type = parseInt(item.accessory_type);
            switch (type) {
                case 1://无跳转，纯展示

                    break;
                case 2://跳转链接
                    {
                        let banner_url = item.accessory_skip_url;
                        if (!isNaN(parseInt(banner_url))) {
                            this.props.navigation.navigate('GetCoupons', {
                                id: banner_url
                            })
                        } else if (banner_url != '' && banner_url.indexOf('/') >= 0) {
                            //跳转H5
                            this.props.navigation.navigate('Webview', {
                                path: banner_url
                            })
                        }
                    }

                    break;
                case 3://端内跳转
                    {
                        //分类菜单ID数组   
                        let classifyIdArray = [];
                        if (item.accessory_skip_url != null && item.accessory_skip_url.split(',') != null) {
                            classifyIdArray = item.accessory_skip_url.split(',');
                        }
                        if (classifyIdArray.length > 0) {
                            DeviceEventEmitter.emit(Constants.Notify_Update_Classify_SelectedId, classifyIdArray)
                            this.props.navigation.navigate('Select')
                        }
                    }
                    break;
                case 4://跳转商品详情
                    {
                        let storeId = this.props.orderShop ? this.props.orderShop.store_id : '';
                        this.props.navigation.navigate('GoodsDetail', {
                            skuNo: item.accessory_skip_url,
                            storeId: storeId,
                            item: {},
                            index: 0
                        })
                    }
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * 订单信息
     */
    orderInfo() {

    }

    /**
     * 广告点击处理
     * @param {*} obj 
     */
    _handleBanner(obj) {
        if (obj.banner_type != null) {
            let banner_url = obj.banner_url;

            //banner_type == 2
            if (obj.banner_type == Constants.Banner_Type_Url) {
                //跳转活动
                if (!isNaN(parseInt(banner_url))) {
                    this.props.navigation.navigate('GetCoupons', {
                        id: banner_url
                    })
                } else if (banner_url != '' && banner_url.indexOf('/') >= 0) {
                    //跳转H5
                    if (!this.props.userData || !this.props.userData.id) {
                        this.props.dispatch(clickEvent('showLoginDialog', 'HomePage'));
                        DeviceEventEmitter.emit(Constants.Login_Listen, null);
                        return
                    }
                    this.props.navigation.navigate('Webview', {
                        path: banner_url
                    })
                }
            }

            //banner_type == 3 跳转指定商品列表页面
            if (obj.banner_type == Constants.Banner_Type_Product_List) {

                // 首先判断是否有定位和当前城市
                if (this.props.cityStatus == Constants.Choose_City_Suc) {
                    // 判断登录状态
                    if (this.props.userData && this.props.userData.id) {

                        //分类菜单ID数组   
                        let classifyIdArray = [];
                        if (obj.cate_code != null && obj.cate_code.split(',') != null) {
                            classifyIdArray = obj.cate_code.split(',');
                        }
                        if (classifyIdArray.length > 0) {
                            DeviceEventEmitter.emit(Constants.Notify_Update_Classify_SelectedId, classifyIdArray)
                            this.props.navigation.navigate('Select')
                        }
                    } else {
                        //去登陆
                        this.props.dispatch(clickEvent('showLoginDialog', 'HomePage'));
                        DeviceEventEmitter.emit(Constants.Login_Listen, null);
                    }
                } else {
                    //选择城市
                    this._toChooseCity()
                }
            }
        }
    }

    /* ------------------------------------------------------- 商品 start--------------------------------------------------- */


    /**
     * 更新数量
     * @param {*} productInfo 
     * @param {*} index 
     * @param {*} isAdd  是否增加数量
     */
    _updateCount(productInfo, sectionIndex, index, isAdd) {

        //购物车数量
        let cartCount = _.cloneDeep(this.props.cartCount);

        //单个商品数据
        if (isAdd) {
            productInfo.addCount = productInfo.addCount + 1;
            cartCount = cartCount + 1;
        } else {
            productInfo.addCount = productInfo.addCount - 1;
            cartCount = cartCount - 1;
        }

        //页面数据
        // let pageData = _.cloneDeep(this.props.pageData);
        // console.log('  pageData[this.props.sectionIndex][this.props.rowIndex].data', pageData[this.props.sectionIndex][this.props.rowIndex].data)
        // pageData[this.props.sectionIndex][this.props.rowIndex].data[sectionIndex].data[index] = productInfo;

        //购物车商品
        let cartProductArray = _.cloneDeep(this.props.cartProductArray);
        let hasAdd = false;

        for (let i = 0; i < cartProductArray.length; i++) {

            if (productInfo.id == cartProductArray[i].id) {//商品已经存在购物车，更新数量
                hasAdd = true;
                if (isAdd) {
                    //增加数量
                    cartProductArray[i].addCount += 1;
                } else {
                    //数量减 
                    if (cartProductArray[i].addCount == 1) {
                        //数量为0 从购物车移除
                        cartProductArray.splice(i, 1);
                    } else {
                        cartProductArray[i].addCount = cartProductArray[i].addCount - 1;
                    }
                }
            }
        }

        //商品未添加到购物车
        if (!hasAdd) {
            let product = _.cloneDeep(productInfo);
            cartProductArray.push(product)
        }

        let storeCode = this.props.orderShop.store_code;

        const { dispatch } = this.props;
        // dispatch(updatePageData(pageData))//更新页面数据
        dispatch(updateCartCount(Constants.Key_Cart_Count + storeCode, cartCount))//更新购物数量
        dispatch(updateCartProduct(Constants.Key_Cart_Product + storeCode, cartProductArray)) //更新购物商品
        dispatch(initOrderInfo([], cartProductArray, this.props.orderAddress,
            this.props.orderShop));//初始化订单
    }

    /**
    * 加入购物车
    * @param {*} item 
    * @param {*} index 
    */
    _addCart(item, sectionIndex, index) {
        console.log('加入购物车', item)
        if (item && item.goodsDetail && item.goodsDetail.safeStockNum && item.addCount < item.goodsDetail.safeStockNum) {
            this.props.dispatch(clickEvent('joinCart', 'OrderingPage', item));
            this._updateCount(item, sectionIndex, index, true);
        } else {
            DeviceEventEmitter.emit(Constants.Public_Toast_Listen, '该商品库存不足')
        }
    }

    /**
     *  数量减
     * @param {*} item 
     * @param {*} index 
     */
    _minusCount(item, sectionIndex, index) {
        this._updateCount(item, sectionIndex, index, false);
    }

    /**
     * 数量加
     * @param {*} item 
     * @param {*} index 
     */
    _addCount(item, sectionIndex, index) {
        if (item && item.goodsDetail && item.goodsDetail.safeStockNum && item.addCount < item.goodsDetail.safeStockNum) {
            this._updateCount(item, sectionIndex, index, true);
        } else {
            DeviceEventEmitter.emit(Constants.Public_Toast_Listen, '该商品库存不足')
        }
    }

    /**
        * 价格视图
        * @param {*} item 
        */
    _renderPrice(item) {

        let margin = 10;

        if (item.app_price == null && item.goodsDetail != null) {
            //没有专享价,只显示售价
            return (
                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    marginVertical: margin
                }}>
                    <Text style={{ fontSize: 15, color: '#333333', fontWeight: 'bold', marginVertical: 15 }}>
                        ￥{global.Tool.toDecimal2(item.goodsDetail.skuStorePrice)}
                    </Text>
                </View>
            )
        } else if (item.goodsDetail && item.app_price >= item.goodsDetail.skuStorePrice) {
            //有专享价，专享价大于原价
            return (
                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    marginVertical: margin
                }}>
                    <Text style={{ fontSize: 15, color: '#333333', fontWeight: 'bold', marginVertical: 15 }}>
                        ￥{global.Tool.toDecimal2(item.app_price)}
                    </Text>
                </View>
            )
        } else {
            //有专享价，显示售价和原价
            if (item.goodsDetail != null) {

                return (
                    <View >
                        <View style={{
                            flexDirection: 'row', alignItems: 'center',
                            marginTop: margin, marginBottom: 12
                        }}>
                            <Text style={{ fontSize: 15, color: '#333333', fontWeight: 'bold' }}>
                                ￥{global.Tool.toDecimal2(item.app_price)}
                            </Text>

                            <View style={{
                                width: 40, height: 15, borderRadius: 3, marginLeft: 10,
                                justifyContent: 'center', alignItems: 'center',
                                borderStyle: "solid", borderWidth: global.Tool.pxToDp(1), borderColor: "#ffa10b"
                            }}>
                                <Text style={{ fontSize: 10, color: "#ffa10b" }}>专享价</Text>
                            </View>
                        </View>

                        <Text style={{
                            fontSize: 12, marginBottom: 10,
                            color: '#999999', textDecorationLine: 'line-through'
                        }}>￥{global.Tool.toDecimal2(item.goodsDetail.skuStorePrice)}</Text>
                    </View>
                )
            }
        }
    }

    /**
     * 加减按钮
     * @param {*} item 
     * @param {*} index 
     */
    _renderCompareView(item, sectionIndex, index) {

        if (item != null && item.goods_type != Constants.CombineProduct) {
            //非组合商品
            if (!item || !item.goodsDetail || !item.goodsDetail.safeStockNum || item.goodsDetail.safeStockNum < 1) {
                //没有库存
                return (
                    <Text style={{ fontSize: 14, color: '#999999' }}>库存不足</Text>
                )
            } else {
                //有库存

                if (item.addCount == 0) {
                    //数量为0，显示购物车Icon
                    return (
                        <TouchableHighlight
                            underlayColor='transparent'
                            onPress={this._addCart.bind(this, item, sectionIndex, index)}>
                            <Image style={{ width: 24, height: 24 }} source={CartIcon} />
                        </TouchableHighlight>
                    )
                } else {
                    return (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                            <TouchableHighlight
                                underlayColor='transparent'
                                onPress={this._minusCount.bind(this, item, sectionIndex, index)}>
                                <Image style={{ width: 24, height: 24 }} source={MinusIcon} />
                            </TouchableHighlight>

                            <Text style={{ fontSize: 15, color: "#333333", width: 40, textAlign: 'center' }}>
                                {item.addCount}
                            </Text>

                            <TouchableHighlight
                                underlayColor='transparent'
                                onPress={this._addCount.bind(this, item, sectionIndex, index)}>
                                <Image style={{ width: 24, height: 24 }} source={AddIcon} />
                            </TouchableHighlight>
                        </View >
                    )
                }
            }
        } else {
            //组合商品
            return (
                <TouchableHighlight
                    underlayColor='transparent'
                    onPress={() => {
                        let data = {
                            'skuNo': item.sku_no,
                            'navigation': this.props.navigation
                        }
                        DeviceEventEmitter.emit(Constants.Combine_StandInfo_Listen, data)
                    }}>
                    <Image style={{ width: 24, height: 24 }} source={CartIcon} />
                </TouchableHighlight>
            )
        }
    }

    /**
    * 去商品详情
    * @param {*} item 
    */
    _toGoodsDetail(item, sectionIndex, index) {
        let skuNo = item.sku_no
        let storeId = this.props.orderShop.store_id || '';
        let _this = this
        console.log('商品详情', {
            'skuNo': skuNo,
            'storeId': storeId,
            'item': item,
            'index': index
        })
        DeviceEventEmitter.emit(Constants.Show_GoodsDetail_Listen, {
            'skuNo': skuNo,
            'storeId': storeId,
            'item': item,
            'index': index,
            detailAddCart: (item, index) => {
                this._updateCount(item, sectionIndex, index, true)
            }
        });
    }


    /**
    * list 头部视图
    * @param {*} param0 
    */
    _renderSectionHeader({ section }) {
        return (
            <View style={{
                width: global.screenW - LeftMenuWidth, height: 40, justifyContent: 'center',
                backgroundColor: 'white', borderBottomColor: '#eeeeee',
                borderBottomWidth: global.Tool.pxToDp(1)
            }}>
                <Text style={{ fontSize: 14, color: '#333333', marginLeft: 30 }}>{section.group_name}</Text>
            </View>
        )
    }

    /**
     * 分割线
     */
    _renderSeparator() {
        return (
            <View style={{
                backgroundColor: '#e6e6e6', height: global.Tool.pxToDp(1),
                width: global.screenW - LeftMenuWidth - 20, marginLeft: 10
            }} />
        )
    }

    _renderRowItem({ item, index, section }) {
        // console.log('index', index);
        // console.log('sectionIndex', section.key);
        let url = '';

        if (item.goods_type == Constants.CombineProduct) {
            //组合商品
            if (item.goodsDetail != null && item.goodsDetail.mainImage != null &&
                item.goodsDetail.mainImage.length > 0) {
                url = item.goodsDetail.mainImage[0] + Constants.ProductList_Image_Handle;
            }
        } else {
            //非组合商品
            if (item.goodsDetail != null && item.goodsDetail.thumbnailImageUrl != null) {
                url = item.goodsDetail.thumbnailImageUrl + Constants.ProductList_Image_Handle;
            }
        }

        return (
            <TouchableHighlight
                underlayColor='transparent'
                onPress={this._toGoodsDetail.bind(this, item, section.key, index)}>
                <View style={{
                    width: global.screenW - LeftMenuWidth, paddingVertical: 10,
                    flexDirection: 'row', alignItems: 'center', backgroundColor: 'white'
                }}>
                    <NetImage style={{
                        width: ImageSize, height: ImageSize, marginLeft: 10
                    }} imageUrl={url} />

                    <View style={{
                        width: global.screenW - LeftMenuWidth - ImageSize - 40,
                        marginLeft: 10, backgroundColor: 'white',
                    }}>
                        <Text style={{ fontSize: 15, color: '#333333' }}
                            numberOfLines={2}>{item.app_goods_name}</Text>
                        {this._renderPrice(item)}
                    </View>

                    <View style={{ position: 'absolute', right: 30, bottom: 10 }}>
                        {this._renderCompareView(item, section.key, index)}
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    /* ------------------------------------------------------- 商品 end--------------------------------------------------- */


    /**
     * 轮播区域
     */
    _renderSwiperBanner() {
        if (this.props.swipeBanner && this.props.swipeBanner.length > 0) {
            let swipeItemArr = this.props.swipeBanner.map((item, index) => {
                return (
                    <TouchableHighlight underlayColor='transparent' key={index}
                        onPress={this._itemPress.bind(this, item)} >
                        <Image source={{ uri: item.pic_url }} style={{
                            width: global.screenW,
                            height: global.Tool.pxToDp(360)
                        }} defaultSource={swipeBannerImg} resizeMode={ImageResizeMode}/>
                    </TouchableHighlight>
                )
            })
            return (
                <Swiper
                    ref="test" Î
                    autoplay={true}
                    autoplayTimeout={4.0}
                    showsButtons={false}
                    dot={<View style={{ opacity: 0 }} />}
                    activeDot={<View style={{ opacity: 0 }} />} >
                    {swipeItemArr}
                </Swiper>
            )
        } else {
            return null
        }
    }

    _renderSelectedShop() {
        if (this.props.orderShop != null) {
            return (
                <TouchableHighlight style={{ flex: 1 }} underlayColor='transparent' onPress={this.goShopChoosePage.bind(this)} >
                    <View style={{ alignItems: "center", flexDirection: 'row', justifyContent: 'space-between' }} >
                        <View>
                            <Text style={{ fontSize: global.Tool.pxToDp(32), color: "#333" }} >
                                {this.props.orderShop.store_name}
                            </Text>
                            <Text style={{ fontSize: global.Tool.pxToDp(28), color: "#3e3e3e", marginTop: global.Tool.pxToDp(10) }} >
                                距离您{this.props.orderShop.distance}m
                            </Text>
                        </View>
                        <Image source={arrowRightIcon}
                            style={{
                                width: global.Tool.pxToDp(10), height: global.Tool.pxToDp(20),
                                marginHorizontal: 15
                            }} ></Image>
                    </View>
                </TouchableHighlight>
            )
        } else {
            return (
                <TouchableHighlight style={{ flex: 1 }} underlayColor='transparent' onPress={this.goShopChoosePage.bind(this)} >
                    <View style={{ alignItems: "center", flexDirection: 'row' }} >

                        <Text style={{ fontSize: global.Tool.pxToDp(28), color: "#3e3e3e", marginTop: global.Tool.pxToDp(10) }} >
                            请选择门店
                        </Text>

                        <Image source={arrowRightIcon} style={{ width: global.Tool.pxToDp(10), height: global.Tool.pxToDp(20), marginLeft: global.Tool.pxToDp(36) }} ></Image>
                    </View>
                </TouchableHighlight>
            )
        }
    }

    /**
     * 门店以及扫码购物
     */
    _renderShopAndScan() {
        return (
            <View style={{
                height: global.Tool.pxToDp(154),
                borderRadius: global.Tool.pxToDp(6),
                paddingHorizontal: global.Tool.pxToDp(30),
                backgroundColor: '#fff',
                flexDirection: 'row',
                alignItems: 'center'
            }} >
                {/* 门店 */}
                {this._renderSelectedShop()}
                {/* 扫码购 */}
                <TouchableHighlight underlayColor='transparent' onPress={this.goScanBuyPage.bind(this)} >
                    <View style={{
                        width: global.Tool.pxToDp(180),
                        height: global.Tool.pxToDp(60),
                        borderRadius: global.Tool.pxToDp(6),
                        backgroundColor: '#9DC815',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }} >
                        <Image source={scanBuyIcon} style={{ width: global.Tool.pxToDp(30), height: global.Tool.pxToDp(30) }}  ></Image>
                        <Text style={{ fontSize: global.Tool.pxToDp(30), color: "#fff", marginLeft: global.Tool.pxToDp(18) }} >扫码购</Text>
                    </View>
                </TouchableHighlight>
            </View>
        )

    }
    /**
     * 渲染图标
     */
    _renderIcons() {
        if (this.props.icons && this.props.icons.length > 0) {
            let firstRowArr = this.props.icons.slice(0, 5)
            let secondRowArr = this.props.icons.slice(5, 10)
            let rowView = (arr) => {
                return arr.map((item, index) => {
                    return (
                        <TouchableHighlight style={{ flex: 1 }} underlayColor='transparent' key={index}
                            onPress={this._onIconPressed.bind(this, item)} >
                            <View style={{ height: global.Tool.pxToDp(180), justifyContent: "center", alignItems: "center" }} >
                                <Image
                                    style={{ width: global.Tool.pxToDp(90), height: global.Tool.pxToDp(90) }}
                                    source={{ uri: item.accessory_url }} ></Image>
                                <Text style={{ fontSize: global.Tool.pxToDp(24), color: "#333", marginTop: global.Tool.pxToDp(16) }} >{item.accessory_name}</Text>
                            </View>
                        </TouchableHighlight>
                    )
                })
            }
            return (
                <View style={{ marginTop: global.Tool.pxToDp(14), backgroundColor: "#fff", borderRadius: global.Tool.pxToDp(6) }} >
                    <View style={{ flexDirection: "row" }} >
                        {rowView(firstRowArr)}
                    </View>
                    <View style={{ flexDirection: "row" }} >
                        {rowView(secondRowArr)}
                    </View>
                </View>
            )
        } else {
            return null
        }
    }
    /**
     * 自提外卖信息
     */
    _renderOrderInfo() {
        let iconBgColor
        let textTip
        if (1 == 1) {   // 自提
            iconBgColor = '#39DDA5'
            textTip = '自提'
        } else {      //外卖
            iconBgColor = '#F7B927'
            textTip = '外卖'
        }
        return (
            <TouchableHighlight underlayColor='transparent' onPress={this.orderInfo.bind(this)} >
                <View style={{
                    marginTop: global.Tool.pxToDp(14),
                    flex: 1,
                    height: global.Tool.pxToDp(82),
                    backgroundColor: "#fff",
                    paddingHorizontal: global.Tool.pxToDp(30),
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: global.Tool.pxToDp(6)
                }} >
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }} >
                        <Text style={{
                            width: global.Tool.pxToDp(72),
                            height: global.Tool.pxToDp(36),
                            lineHeight: global.Tool.pxToDp(36),
                            fontSize: global.Tool.pxToDp(24),
                            borderRadius: global.Tool.pxToDp(4),
                            marginRight: global.Tool.pxToDp(20),
                            color: "#fff",
                            textAlign: "center",
                            backgroundColor: iconBgColor
                        }} >{textTip}</Text>
                        <Text style={{ fontSize: global.Tool.pxToDp(28), color: "#333" }} >{textTip + '订单，编号'}</Text>
                        <Text style={{ fontSize: global.Tool.pxToDp(28), color: global.Color.mainColor, marginHorizontal: global.Tool.pxToDp(8) }} >403</Text>
                        <Text style={{ fontSize: global.Tool.pxToDp(28), color: "#333" }} >等待领取</Text>
                    </View>
                    <Image source={arrowRightIcon} style={{ width: global.Tool.pxToDp(10), height: global.Tool.pxToDp(20), marginLeft: global.Tool.pxToDp(36) }} ></Image>
                </View>
            </TouchableHighlight>
        )
    }

    _renderProductView() {

    }

    render() {
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefresh}
                        onRefresh={() => {
                            const { dispatch } = this.props;
                            dispatch(getHomeData(this))
                            dispatch(getProductByCurTime(this.props.cartProductArray))
                        }}
                        tintColor={global.Color.mainColor}
                        title='正在刷新...'
                        titleColor={global.Color.mainColor}
                    />}
                style={styles.container}
                showsVerticalScrollIndicator={false}>

                <TStatusBar />

                {/* swiper */}
                <View style={{ width: global.screenW, height: global.Tool.pxToDp(360) }}  >
                    {this._renderSwiperBanner()}
                </View>
                {/* 主体内容 */}
                <View
                    onLayout={(event) => {
                        this.setState({

                        })
                    }}
                    style={{
                        marginHorizontal: global.Tool.pxToDp(20),
                        marginTop: global.Tool.pxToDp(-62), marginBottom: global.Tool.pxToDp(20)
                    }} >
                    {/* 扫码购 */}
                    {this._renderShopAndScan()}
                    {/* 图标 */}
                    {this._renderIcons()}
                    {/* 自提外卖信息 */}
                    {this._renderOrderInfo()}
                    {/* 首页banner */}
                    <HomeBanner itemPress={this._onIconPressed.bind(this)} />
                </View>

                <SectionList
                    ref='sectionList'
                    keyExtractor={(item, index) => index + ''}
                    style={{
                        width: global.screenW - LeftMenuWidth, marginLeft: LeftMenuWidth / 2,
                        borderRadius: 3
                    }}
                    stickySectionHeadersEnabled={false}
                    sections={this.props.productBuyCurTime}
                    renderSectionHeader={this._renderSectionHeader}
                    ItemSeparatorComponent={this._renderSeparator}
                    extraData={this.props}
                    renderItem={this._renderRowItem.bind(this)} />

                <View style={{
                    width: global.screenW, marginVertical: 15,
                    justifyContent: 'center', alignItems: 'center'
                }}>
                    <Text style={{ fontSize: 14, color: '#999999' }}>更多美味就在today今天</Text>
                </View>

            </ScrollView>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6'
    }
})

// export default HomePage;
function getStore(store) {
    let loginData = store.get('loginReducer');
    let homeData = store.get('homeReducer')
    let data = store.get('publicReducer');
    let shopData = store.get('shopReducer');
    let cartData = store.get('cartReducer');
    return {
        type: data.get('type'),
        locationInfo: data.get('locationInfo'),
        locationStatus: data.get('locationStatus'),
        cityInfo: data.get('cityInfo'),
        cityStatus: data.get('cityStatus'),
        swipeBanner: homeData.get('swipeBanner'),
        advBanner: homeData.get('advBanner'),
        icons: homeData.get('icons'),
        isAdvShowStatus: homeData.get('isAdvShowStatus'),
        userData: loginData.get('userData'),
        orderShop: shopData.get('orderSelectShop'),//下单所选门店

        productBuyCurTime: homeData.get('productBuyCurTime'),//当前时间段展示的商品

        cartCount: cartData.get('cartCount'),       //购物车商品数量
        cartProductArray: cartData.get('cartProductArray'),  //购物车商品数据
    }
}

export default connect(getStore)(HomePage);