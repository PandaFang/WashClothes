import React, {Component} from "react";
import { StyleSheet, View, Text, Button, TouchableOpacity, FlatList, RefreshControl, AsyncStorage , Dimensions} from "react-native";

class OrderPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin:false,
            isRefreshing:false,
            dataSource:[{title:'洗衣', orderNo:'123123132', time:'2019-1-13'},
                {title:'洗衣', orderNo:'123123132', time:'2019-1-13'},
                {title:'洗衣', orderNo:'123123132', time:'2019-1-13'} ],
        };
        this.responseData = [];
    }

    componentWillMount() {
        console.log('componentWillMount');
        AsyncStorage.getItem('isLogin').then(value => this.setState({isLogin:Boolean(value)}));
    }

    _refresh() {
        AsyncStorage.getItem('isLogin').then(value => this.setState({isLogin:Boolean(value)}));
    }

    // 下拉刷新
    onRefresh = ()=> {
        this.setState({
            isRefreshing: true,
        });


        setTimeout(() => {
            //默认选中第二个
            this.responseData = [
                {title:'洗衣2', orderNo:'123123132', time:'2019-1-13'},
                {title:'洗衣2', orderNo:'123123132', time:'2019-1-13'},
            ];
            this.setState({
                isRefreshing: false,
                dataSource: this.responseData.concat(this.state.dataSource),
            });
        }, 2000);

    }

    render() {
        console.log('render ...');
        if (this.state.isLogin) {
            return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.dataSource}
                    renderItem={ ({item}) => (
                        <TouchableOpacity onPress={()=> this.props.navigation.navigate('PullRefreshPage')}>
                        <View style={styles.listItem}>
                            <Text>{item.title}</Text>
                            <Text>订单号{item.orderNo}</Text>
                            <Text>时间{item.time}</Text>
                        </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => String(index)}
                    refreshControl={
                        <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={this.onRefresh}
                        title="Loading..."/>
                    }
                />
            </View>
            )
        } else {
            return(
                <View style={styles.container}>
                    <Text>Order Page</Text>
                    {/*这个onGoBack 是解决从 登录界面 goback 之后 本界面不走生命周期 不会刷新界面的问题*/}
                    <Button title='登录' onPress={() => this.props.navigation.navigate('LoginPage',{
                        onGoBack: () => this._refresh(),
                    })}/>
                </View>
            )
        }
    }
}

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
   container: {
       flex:1,
       justifyContent: 'center',
       alignItems: 'center',
   },

    listItem: {
        width: width,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'red'
    }


});

export default OrderPage;