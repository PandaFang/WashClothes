'use strict';

import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    ImageBackground,
    TouchableHighlight,
    Animated,
    Easing,
    DeviceEventEmitter,
    Image,
    Platform,
    AsyncStorage,
    ScrollView
} from 'react-native';

import PropTypes from 'prop-types'
import { connect } from 'react-redux';

const ImageResizeMode = 'stretch';

class HomeBanner extends React.Component {
    /**
     * 点击处理
     */
    _itemPress(item) {
        this.props.itemPress(item)
    }
    /**
     * 渲染一张图
     */
    _renderOneImg(arr) {
        let item = arr[0]
        return (
            <TouchableHighlight underlayColor='transparent' onPress={this._itemPress.bind(this, item)} >
                <Image style={{
                    marginTop: global.Tool.pxToDp(14),
                    height: global.Tool.pxToDp(200)
                }} source={{ uri: item.accessory_url }} resizeMode={ImageResizeMode}/>
            </TouchableHighlight>
        )
    }
    /**
     * 渲染两张图
     */
    _renderTwoImg(arr) {
        let [item1, item2] = arr
        return (
            <View style={{ marginTop: global.Tool.pxToDp(14), flexDirection: "row", justifyContent: "space-between" }} >
                <TouchableHighlight underlayColor='transparent' onPress={this._itemPress.bind(this, item1)} >
                    <Image style={{
                        width: global.Tool.pxToDp(348),
                        height: global.Tool.pxToDp(200)
                    }} source={{ uri: item1.accessory_url }} resizeMode={ImageResizeMode}/>
                </TouchableHighlight>
                <TouchableHighlight underlayColor='transparent' onPress={this._itemPress.bind(this, item2)} >
                    <Image style={{
                        width: global.Tool.pxToDp(348),
                        height: global.Tool.pxToDp(200)
                    }} source={{ uri: item2.accessory_url }} resizeMode={ImageResizeMode}/>
                </TouchableHighlight>
            </View>
        )
    }
    /**
     * 渲染三张图
     */
    _renderThreeImg(arr) {
        let [item1, item2, item3] = arr
        return (
            <View style={{ marginTop: global.Tool.pxToDp(14), flexDirection: "row", justifyContent: "space-between" }} >
                <TouchableHighlight underlayColor='transparent' onPress={this._itemPress.bind(this, item1)} >
                    <Image style={{
                        width: global.Tool.pxToDp(348),
                        height: global.Tool.pxToDp(414)
                    }} source={{ uri: item1.accessory_url }} resizeMode={ImageResizeMode}/>
                </TouchableHighlight>
                <View style={{ justifyContent: "space-between" }} >
                    <TouchableHighlight underlayColor='transparent' onPress={this._itemPress.bind(this, item2)} >
                        <Image style={{
                            width: global.Tool.pxToDp(348),
                            height: global.Tool.pxToDp(200)
                        }} source={{ uri: item2.accessory_url }} resizeMode={ImageResizeMode}/>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='transparent' onPress={this._itemPress.bind(this, item3)} >
                        <Image style={{
                            width: global.Tool.pxToDp(348),
                            height: global.Tool.pxToDp(200)
                        }} source={{ uri: item3.accessory_url }} resizeMode={ImageResizeMode}/>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
    /**
     * 渲染四张图
     */
    _renderFourImg(arr) {
        let [item1, item2, item3, item4] = arr
        return (
            <View style={{ marginTop: global.Tool.pxToDp(14) }} >
                <View style={{ flexDirection: "row", justifyContent: "space-between" }} >
                    <TouchableHighlight underlayColor='transparent' onPress={this._itemPress.bind(this, item1)} >
                        <Image style={{
                            width: global.Tool.pxToDp(348),
                            height: global.Tool.pxToDp(200)
                        }} source={{ uri: item1.accessory_url }} resizeMode={ImageResizeMode} />
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='transparent' onPress={this._itemPress.bind(this, item2)} >
                        <Image style={{
                            width: global.Tool.pxToDp(348),
                            height: global.Tool.pxToDp(200)
                        }} source={{ uri: item2.accessory_url }} resizeMode={ImageResizeMode}/>
                    </TouchableHighlight>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: global.Tool.pxToDp(14) }} >
                    <TouchableHighlight underlayColor='transparent' onPress={this._itemPress.bind(this, item3)} >
                        <Image style={{
                            width: global.Tool.pxToDp(348),
                            height: global.Tool.pxToDp(200)
                        }} source={{ uri: item3.accessory_url }} resizeMode={ImageResizeMode}/>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='transparent' onPress={this._itemPress.bind(this, item4)} >
                        <Image style={{
                            width: global.Tool.pxToDp(348),
                            height: global.Tool.pxToDp(200)
                        }} source={{ uri: item4.accessory_url }} resizeMode={ImageResizeMode}/>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
    render() {
        let banners = this.props.banners
        if (banners.length == 1) {
            return this._renderOneImg(banners)
        } else if (banners.length == 2) {
            return this._renderTwoImg(banners)
        } else if (banners.length == 3) {
            return this._renderThreeImg(banners)
        } else if (banners.length == 4) {
            return this._renderFourImg(banners)
        } else {
            return <View></View>
        }
    }
}

const styles = StyleSheet.create({
})

function getStore(store) {
    let homeData = store.get('homeReducer')
    return {
        type: homeData.get('type'),
        banners: homeData.get('banners')
    }
}

export default connect(getStore)(HomeBanner);