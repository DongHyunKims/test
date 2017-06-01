/**
 * Created by donghyunkim on 2017. 6. 1..
 */

const utility = {
    $ : document,
    $selector : function(selector){
        return document.querySelector(selector);
    },
    //ajax 실행 메소드
    runAjax : function(reqListener, method, url){
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.send();
        xhr.addEventListener("load", reqListener);
    },
    runAjaxData : function(reqListener, method, url, data, contentType){
        let xhr = new XMLHttpRequest();

        xhr.open(method, url);
        if(contentType !== undefined){
            xhr.setRequestHeader("Content-Type",contentType);
        }

        xhr.send(data);
        xhr.addEventListener("load", reqListener);
    },
    createFormData(data){
        let formData = new FormData();
        //FormData 에 파일과 이메일을 append 메소드를 통해 등록

        for(let key in data){
            let inputData = data[key];
            formData.append(key, inputData);
        }

        return formData;
    },

};
