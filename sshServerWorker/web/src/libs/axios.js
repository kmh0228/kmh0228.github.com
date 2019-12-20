
import axios from 'axios'

class HttpRequest {

    request(options){
        const instance = axios.create();
        return instance(options);
    }

}

export default HttpRequest
