import React, {Component} from 'react';
import {Platform, Dimensions,View, BackHandler, WebView, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class WebViewPage extends Component {//自定义一个组件
    static navigationOptions = ({navigation}) => {

        return {
            headerTitle: navigation.getParam('title', '标题默认值'),   //导航标题
            headerTitleStyle: {
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 16,
            },
            headerLeft: (
                <View style={{paddingLeft: 12, flexDirection:'row'}}>
                    <TouchableHighlight
                        activeOpacity={1}
                        underlayColor='blue'
                        onPress={() => {
                            navigation.state.params.goBackPage();
                        }}
                    >
                            <Icon name="ios-arrow-back" size={30}/>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={{marginLeft: 20}}
                        activeOpacity={1}
                        underlayColor='blue'
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <Icon name="ios-close" size={30} />
                    </TouchableHighlight>

                </View>
            ),
            //导航左与导航右是为了让导航标题居中(Why?)
            headerRight: <View style={{paddingRight: 20}}/> ,
        };
    };

    constructor(props) {
        super(props);
        this.nav = this.props.navigation;//导航
        // 添加返回键监听(对Android原生返回键的处理)
        this.addBackAndroidListener(this.nav);
    }

    componentDidMount() {
        this.props.navigation.setParams({//给导航中增加监听事件
            goBackPage: this._goBackPage
        });

    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }
    //自定义返回事件
    _goBackPage = () => {
        //  官网中描述:backButtonEnabled: false,表示webView中没有返回事件，为true则表示该webView有回退事件
        if (this.state.backButtonEnabled) {
            this.refs['webView'].goBack();
        } else {//否则返回到上一个页面
            this.nav.goBack();
        }
    };

    //获取链接
    getSource() {//config.HelpProblemUrlTest是webView的地址(一个独立的H5页面)
        return 'https://github.com/facebook/react-native';
        // return 'https://www.baidu.com';
    }

    onNavigationStateChange = navState => {
        this.props.navigation.setParams({title: navState.title})
        this.setState({
            backButtonEnabled: navState.canGoBack
        });
    };

    // 监听原生返回键事件
    addBackAndroidListener(navigator) {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    onBackAndroid = () => {
        if (this.state.backButtonEnabled) {
            this.refs['webView'].goBack();
            return true;
        } else {
            return false;
        }
    };

    render() {
        let {width, height} = Dimensions.get('window');
        return (
            <View style={{backgroundColor: 'white', flex: 1}}>
                <WebView
                    source={{uri: this.getSource()}}
                    style={{flex: 10, justifyContent: 'center', alignItems: 'center', width: width}}
                    ref="webView"
                    onNavigationStateChange={this.onNavigationStateChange}
                />
            </View>
        );
    }
}