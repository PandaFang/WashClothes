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
        screen: TabNavigtor
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
    defaultNavigationOptions: ({navigation}) => ({
        header: null // 不显示 标题栏
    })
});

export default createAppContainer(AppNavigator);