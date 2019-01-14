import request from "./Reqeust";

class AppService {
    sendCode = () => {
        return request('/today', 'get');
    }

    login=(username, password) => {
        let param = {username:username, password:password}
        return request('/login', 'post', param)
    }
}

export default  new AppService()