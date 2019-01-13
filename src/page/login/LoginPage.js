import React, {Component} from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Button,
    Alert,
    AsyncStorage
} from "react-native";
import TitleBar from "../../component/TitleBar";
import Constant from '../../Constant'

class LoginPage extends  Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin:false,
            username:'',
            password:'',
            sendCodeBtnText:'发送验证码',
            isSending:false,
        }
    }

    // 发送验证码
    _sendCode() {
        if (this.state.isSending) {
            return;
        }
        this.setState({isSending:true})

        fetch(Constant.host + 'sendCode', {
            method:'POST',
            body:JSON.stringify({
                phone:111111,
            })
        }).then(response => response.toJSON()).then(responseJson=> {
            if (responseJson.status == 0) {
                // 处理获得验证码成功的逻辑
            } else {
                console.log('失败')
                Alert.alert('失败')

            }
        }).catch(() => {
            console.log('发生异常'); Alert.alert("异常");
        });

        let time = 10;
        let timer = setInterval(() => {
            if (time == 0) {
                clearInterval(timer);
                this.setState({sendCodeBtnText: '发送验证码'});
                this.setState({isSending:false})
            } else {
                this.setState({sendCodeBtnText: time + '秒'});
                time--;
            }
        }, 1000)
    }

    _login() {
        AsyncStorage.setItem("isLogin", 'true').then( ()=> {
            {/*这个onGoBack 是解决从 登录界面 goback 之后 之前的界面不走生命周期 不会刷新界面的问题*/}
            this.props.navigation.state.params.onGoBack();
            this.props.navigation.goBack();
        });

    }
    render() {
        return (
            <View>
                <TitleBar title={'Login'} goBack={()=> this.props.navigation.goBack()}/>
                <Text>{this.state.username}</Text>
                <View style={{flexDirection:'row'}}>
                    <TextInput
                        style={{height: 40}}
                        placeholder="Input username here"
                        onChangeText={(text) => this.setState({username:text})}
                    />
                    <Button title={this.state.sendCodeBtnText} onPress={this._sendCode.bind(this)} />
                </View>

                <TextInput
                    style={{height: 40}}
                    placeholder="Input password here"
                    onChangeText={(text) => this.setState({password:text})}
                />

                <Button title={'登录'} onPress={this._login.bind(this)} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
   sendCodeBtn:{
       backgroundColor:'white',
       borderWidth: 1,
       borderColor: 'blue',
   }
});

export default LoginPage;


