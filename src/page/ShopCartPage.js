import React, {Component} from "react";
import {
    StyleSheet,
    Animated,
    Button,
    View,
    Text,
    Image,
    Alert,
    Dimensions,
} from "react-native";
import { SwipeListView } from 'react-native-swipe-list-view';

const {width, height} = Dimensions.get('window')

class ShopCartPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listType: 'FlatList', // 此例中没有用到
            listViewData: Array(20).fill('').map((_,i) => ({key: `${i}`, text: `item #${i}`})),
        };

        this.rowSwipeAnimatedValues = {};
        Array(20).fill('').forEach((_, i) => {
            this.rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <SwipeListView
                    useFlatList
                    data={this.state.listViewData}
                    renderItem={ (data, rowMap) => (
                        <View style={styles.rowFront}>
                            <Text>I am {data.item.text} in a SwipeListView</Text>
                        </View>
                    )}
                    renderHiddenItem={ (data, rowMap) => (
                        <View style={styles.rowBack}>
                            <Text>Left</Text>
                            <Text>Right</Text>
                        </View>
                    )}
                    leftOpenValue={0}
                    rightOpenValue={-75}
                />
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', height:40}}>
                <Text>共计￥100元</Text>
                <Button title="结算" onPress={() => Alert.alert("")} />
            </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },

});
export default ShopCartPage;