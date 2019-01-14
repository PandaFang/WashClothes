import request from "./Reqeust";

class AppService {
    sendCode = () => {
        return request('/today', 'get');
    }
}

export default  new AppService()