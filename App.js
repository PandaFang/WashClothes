import React, {Component} from 'react';
import { createStackNavigator, createAppContainer } from "react-navigation";
import TabNavigtor from './src/component/TabNavigator'
import DetailPage from './src/page/DetailPage'
import LoginPage from './src/page/login/LoginPage'
import PullRefreshPage from './src/page/PullRefreshPage'
import WebPage from './src/page/WebViewPage'
/**
 * 总的是个 栈的导航
 * 内部嵌入tab 导航 和 不在 tab 中的内容
 */
const AppNavigator = createStackNavigator({
    Tab: {
        screen: TabNavigtor,
        navigationOptions:{
            header:null, // 所有tab 页不显示标题栏

            /** 也可以 重写 header， 比如
            header: (<View><Text>这是标题栏</Text></View>)
            或者 如果 元素内容太多，可以 写一个class extends Component， 抽离到独立js文件中 再import 进来
             header:<Titlebar />
            */
        }
    },

    DetailPage: {
        screen: DetailPage,
    },
    LoginPage: {
        screen:LoginPage,
    },

    PullRefreshPage:{
        screen:PullRefreshPage,
    },
    WebPage:{
        screen:WebPage,
    }
},
{
    // 全局配置 所有界面
    defaultNavigationOptions: ({navigation}) => ({
        // 全局设置所有界面都 标题栏 高度
        headerStyle:{
            height:40,
        }
    })
});

export default createAppContainer(AppNavigator);