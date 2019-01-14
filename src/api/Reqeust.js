import {
    Alert,
} from 'react-native';
import Constant from "../Constant";

const  request = (url,method, params) => {
    return new Promise((resolve, reject) => {
        fetch(Constant.BASE_URL + url, {
            method:method,
            body:JSON.stringify(params)
        }).then(response => response.json())
            .then(responseJson => {
                if (Boolean(responseJson.error) == false) {
                    resolve(responseJson);
                } else {
                    Alert.alert("提示", "查询不到结果")
                }
            })
            .catch(reason => reject(reason))
    });
}

export  default request;