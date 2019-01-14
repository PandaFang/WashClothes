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
import Icon from 'react-native-vector-icons/Ionicons';
import appService from '../../api/AppService'

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
        this.timer = null;
    }

    componentWillUnmount() {
        if (this.timer != null) {
            clearInterval(this.timer)
        }
    }

    // 发送验证码
    _sendCode() {
        if (this.state.isSending) {
            return;
        }
        this.setState({isSending:true});

        appService.sendCode().then((resp) => console.log(resp)).catch((error) => console.log('发生异常'));

        let time = 3;
        this.timer = setInterval(() => {
            if (time == 0) {
                clearInterval(this.timer);
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
                <Text>{this.state.username}</Text>
                {/*登录表单*/}
                <View style={styles.form}>
                    <View style={styles.input}>
                        <Icon
                            name={"ios-megaphone"}
                            style={styles.inputicon}
                            size={20}
                        />
                        <TextInput
                            underlineColorAndroid={'transparent'}
                            placeholder={'请输入手机号'}
                            placeholderTextColor={'rgba(0,0,0,0.3)'}
                            style={styles.textinput}
                            onChangeText={(d)=>{
                                this.setState({
                                    username:d
                                })
                            }}
                        />
                        {/*发送验证码按钮*/}
                        <View style={styles.getcodebtn}>
                            <Text
                                style={styles.getcodebtnword}
                                onPress={this._sendCode.bind(this)}
                            >{this.state.sendCodeBtnText}</Text>
                        </View>
                    </View>

                    <View style={styles.input}>
                        <Icon
                            name={"ios-pin"}
                            style={styles.inputicon}
                            size={20}
                        />
                        <TextInput
                            underlineColorAndroid={'transparent'}
                            placeholder={'请输入验证码'}
                            placeholderTextColor={'rgba(0,0,0,0.3)'}
                            style={styles.textinput}
                            onChangeText={(text) => this.setState({password:text})}
                        />
                    </View>

                    {/*登录按钮*/}
                    <View style={styles.loginbtn}>
                        <Text
                            style={styles.loginbtncontent}
                            onPress={this._login.bind(this)}
                        >登录</Text>
                    </View>
                    <View style={styles.loginremind}>
                        <Text style={styles.loginremindword}>点击登录，即表示您同意</Text>
                        <Text style={[styles.loginremindword,styles.link]}>用户协议</Text>
                    </View>

                </View>
                {/*登录表单结束*/}

            </View>
        );
    }
}

const styles = StyleSheet.create({

    form: {
        position: 'absolute',
        top: 30,
        left: 0,
        width: '100%',
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingLeft: '5%',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    inputicon: {
        color: 'rgba(0,0,0,0.3)',
    },
    textinput: {
        width: '68%',
    },
    getcodebtn: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'white',
        borderColor: '#35B6FF',
        borderWidth: 1,
        borderRadius: 5,
    },
    getcodebtnword: {
        color: '#35B6FF',
        justifyContent: 'center',
        textAlign: 'center',
    },

    loginbtn:{
        width:'90%',
        height:40,
        backgroundColor:'#35B6FF',
        marginLeft:'5%',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:6,
        marginTop:45,
    },
    loginbtncontent:{
        color:'white',
        fontSize:15,
    },

    loginremind:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
    },
    loginremindword:{
        color:'rgba(0,0,0,0.7)',
    },
    link:{
        color:'#35B6FF',
        textDecorationLine:'underline',
    }
});

export default LoginPage;


