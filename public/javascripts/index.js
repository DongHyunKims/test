/**
 * Created by donghyunkim on 2017. 6. 1..
 */

(function(){
    let preId = "1";
    const MAX_SIZE = 2 * 1024 * 1000;
    const TAG_MAX_LEN = 5;
    const TAG_STR_MAX_LEN = 10;
    const INIT_DATA = {_id:"1",name:"없음", img:"", tag:["없음"]};
    const REG_ALPHA = /^[A-Za-z]*$/;
    const elements = {
            nameInput : $(".nameInput"),
            tagInput : $(".tagInput"),
            fileInput : $(".fileInput"),
            submitBtn : $("#submitBtn"),
            nameListArea : $(".nameListArea"),
            userDetail : $(".userDetail"),
            deleteBtn : $(".deleteBtn"),
            previewImg : $("#previewImg"),
            userDetailImg : $(".userDetailImg > img"),
            userDetailName : $(".userDetailName"),
            tagArea : $(".tagArea"),
            userId : $("#userId"),
            addName : $("#addName"),
        };

        const { nameInput,tagInput,fileInput,nameListArea,submitBtn,userDetail,deleteBtn,previewImg ,userDetailImg,userDetailName,tagArea,userId, addName } = elements;

        fileInput.on("change",()=>{
            let file = fileInput.prop("files")[0];
            let reader = new FileReader();
            let { size,type} = file;

            if(size > MAX_SIZE || !type.match("image")){
                alert("2MB 보다 작은 파일을 업로드 하거나 이미지 파일을 업로드 하세요.");
                fileInput.val("");
                return;
            }

            reader.addEventListener("load",(event)=>{
                previewImg.attr("src",reader.result);
            },false);

            if (file) {
                reader.readAsDataURL(file);
            }else{
                previewImg.attr("src",null);
            }
        });

        submitBtn.on("click",()=>{
            let data = {};
            data.name = nameInput.val();
            data.tag = tagInput.val();
            data.img = fileInput.prop("files")[0];

            if(tagValidation(data.tag)){
                alert("tag는 최대 5개, 영어만 가능, 태그하나 당 최대 10글자입니다.");
                tagInput.val("");
                return;
            }

            if(!data.img){
                alert("이미지를 넣어주세요.");
                return;
            }

            let formData = utility.createFormData(data);
            utility.runAjaxData(reqListener,"POST",config.DEFAULT_URL + "/",formData);
        });

        function tagValidation(tag){
            let tagArr = tag.split(",");

            if(tagArr.length > TAG_MAX_LEN) {
                return true;
            }
            let len = tagArr.filter((val)=>{
                return !REG_ALPHA.test(val) || val.length > TAG_STR_MAX_LEN || val === "";
            }).length;

            if(len){
                return true;
            }
            return false;
        }

        function reqListener(res) {
            nameInput.val("");
            tagInput.val("");
            fileInput.val("");
            previewImg.attr("src","");
            let { response } = res.currentTarget;
            let data = JSON.parse(response);
            let { _id, name } = data;
            let liElements = $(".nameListArea li");
            const len = liElements.length;

            if(len){
                let firstLiElement = $(".nameListArea li:nth-child(1)");
                firstLiElement.before("<li id=" + _id + " class=userName >" + name+ "</li>");
            }else{
                nameListArea.empty();
                nameListArea.append("<li id=" + _id + " class=userName >" + name+ "</li><li id=addName>더보기</li>");
            }

        }

        nameListArea.on("click", (event)=>{
            let { target } = event;
            let { nodeName, id} = target;
            let liElements = $(".nameListArea li");
            let len = liElements.length-1;
            let lastId = $(".nameListArea li:nth-child("+len+")").attr("id");

            if(nodeName === "LI"){
                if(id === "addName" ){
                    utility.runAjax(getMoreUserListener,"GET",config.DEFAULT_URL + "/more/" + lastId);
                }else{
                    if(preId !== "1") {
                        $("#" + preId).css({"background-color" : "white"});
                    }
                    target.style.backgroundColor = "lightgray";
                    preId = target.id;
                    utility.runAjax(getUserListener,"GET",config.DEFAULT_URL + "/" + preId);
                }
            }
        });

        function getMoreUserListener(res){
            let { response } = res.currentTarget;
            let data = JSON.parse(response);

            if(data.err){
                return;
            }

            let moreUsers = data.map((val)=>{
                let {_id , name} = val;
                return "<li id=" + _id + " class=userName >" + name+ "</li>"
            }).join("");
            $("#addName").before(moreUsers);
        }

        function getUserListener(res){
            let { response } = res.currentTarget;
            let data = JSON.parse(response);
            detailInit(data);
        }

        userDetail.on("click",(event)=>{
            let { target } = event;
            if(target.type === "button"){
                let id = userId.val();
                if(id==="1"){
                    return;
                }else {
                    utility.runAjax(deleteUserListener, "DELETE", config.DEFAULT_URL + "/" + id);
                }
            }
        });

        function deleteUserListener(res){
            let { response } = res.currentTarget;
            let data = JSON.parse(response);
            let { _id } = data;
            let removeElement = $("#" +_id);
            removeElement.remove();
            let liElements = $(".nameListArea li");
            const len = liElements.length;
            let lastId = $(".nameListArea li:nth-child("+(len-1)+")").attr("id");

            if(len > 1){
                if(len === 2){
                    utility.runAjax(getMoreUserListener,"GET",config.DEFAULT_URL + "/more/" + lastId);
                }
                let firstLiElement = $(".nameListArea li:nth-child(1)");
                let id = firstLiElement.attr("id");
                preId = id;
                firstLiElement.css({"background-color" : "lightgray"});
                utility.runAjax(getUserListener,"GET",config.DEFAULT_URL + "/" + id);
            }else{
                preId = "1";
                detailInit(INIT_DATA);
                $("#addName").remove();
                nameListArea.append("등록 되지 않았습니다.");
            }
        }

        function detailInit(data) {
            let {img,tag,_id, name} = data;
            userId.val(_id);
            userDetailImg.attr("src",img);
            userDetailName.text(name);
            tagArea.empty();
            let newTags = tag.map((val)=>{
                return "<li class=tag >" + val + "</li>";
            }).join("");
            tagArea.append(newTags);
        }
})();

