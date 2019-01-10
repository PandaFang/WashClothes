import { createStackNavigator, createAppContainer } from "react-navigation";
import TabNavigtor from './src/component/TabNavigator'
import DetailPage from './src/page/DetailPage'

/**
 * 总的是个 栈的导航
 * 内部嵌入tab 导航 和 不在 tab 中的内容
 */
const AppNavigator = createStackNavigator({
  Tab: {
    screen: TabNavigtor
  },

  Detail: {
    screen:DetailPage,
  }
}, 
{
  defaultNavigationOptions: ({ navigation }) => ({
    header:null // 不显示 标题栏
  })
});

export default createAppContainer(AppNavigator);