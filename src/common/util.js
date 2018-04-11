export default {

    formatTen: function(num){
        return num > 9 ? (num + "") : ("0" + num);
    },

    dateFormatter: function(date){
        date = new Date(date);
        return date.getFullYear() + '-' + this.formatTen((date.getMonth() + 1)) + '-' + this.formatTen(date.getDate()) + ' ' + this.formatTen(date.getHours()) + ':' + this.formatTen(date.getMinutes()) + ':' + this.formatTen(date.getSeconds());
    },

    ymd: function(date){

        if(date == undefined || date == ''){
            return "";
        }
        date = new Date(date);
        return date.getFullYear() + '-' + this.formatTen((date.getMonth() + 1)) + '-' + this.formatTen(date.getDate());
    },

    startWith: function(url, prefix){
        var reg=new RegExp("^"+prefix);
        return reg.test(url);
    }

};
