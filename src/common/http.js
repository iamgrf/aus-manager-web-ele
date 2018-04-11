import axios from 'axios';
import qs from 'qs';
import util from './util';
import notice from './notice';

var host = "http://127.0.0.1:8023";
// var host = "http://192.168.1.197:8023";

axios.defaults.withCredentials = true;

export default {
    
    post :function(vueObj, url, data, cabSuccess, cabFail = function(){}){
        if (!util.startWith(url, "http")) {
            url = host + url;
        }

        data.token = sessionStorage.getItem("token");

        axios.post(url, qs.stringify(data)).then(res => {
            let data = res.data;
            if(data.code == 1){
                cabSuccess(data);
            }else if(data.code == 10007){
                vueObj.$router.push('/');
            }else if(data.code == 10006){
                vueObj.$router.push('/permissionDenied');
            }else{
                cabFail(data);
                notice.error(vueObj, data.msg);
            }
        })
    },

    postFile :function(vueObj, url, data, cab){

        data.token = sessionStorage.getItem("token");

        let config = {headers: {'Content-Type': 'multipart/form-data'}};
        if (!startWith(url, "http")) {
            url = host + url;
        }
        axios.post(url, data, config).then(res => {
            let data = res.data;
            if(data.code == 1){
                cab(data);
            }else if(data.code == 10007){
                vueObj.$router.push('/');
            }else if(data.code == 10006){
                vueObj.$router.push('/permissionDenied');
            }else{
                notice.error(vueObj, data.msg);
            }
        })
    }
}