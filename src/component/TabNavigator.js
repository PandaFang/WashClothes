import React from 'react'
import {StyleSheet} from 'react-native'
import {createBottomTabNavigator} from 'react-navigation'
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomePage from '../page/home/HomePage';
import MyPage from '../page/my/MyPage';
import OrderPage from '../page/order/OrderPage';
import ShopCartPage from '../page/ShopCartPage'
  
const tabNavigator = createBottomTabNavigator(
  {
    Home:{ 
      screen: HomePage,
      navigationOptions: {
        tabBarLabel:'首页'
      }
    },
    Order:{
      screen:OrderPage,
      navigationOptions: {
        tabBarLabel:'订单',
      }
    },
    My: {
      screen:MyPage,
      navigationOptions: {
        tabBarLabel:'我的'
      }
    },
    ShopCart: {
      screen:ShopCartPage,
      navigationOptions: {
        tabBarLabel:'购物车'
      }
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;

        let iconName
        if (routeName === 'Home') {
          iconName = 'home';
        } else if (routeName === 'My') {
          iconName = 'person'
        } else if (routeName === 'Order') {
          iconName = 'receipt'
        }
        else if (routeName === 'ShopCart') {
          iconName = 'add-shopping-cart'
        }
        // if (routeName === 'Home') {
        //   iconName = `ios-information-circle${focused ? '' : '-outline'}`;
        // } else if (routeName === 'My') {
        //   iconName = `ios-options${focused ? '' : '-outline'}`;
        // }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Icon name={iconName} size={horizontal ? 20 : 25} color={tintColor} />;
      },
      header: null,
    }),
    tabBarOptions: {
      activeTintColor: '#00dbf5',
      inactiveTintColor: 'gray',
      style:{ 
        backgroundColor:'#ffffff',
        borderTopColor:'#b4b4b4',
        borderTopWidth:1,
      },
      labelStyle:{
        marginTop:4
      }
    },
  }
);

const styles = StyleSheet.create({
  tabBar: {
   
  }
})
export default tabNavigator