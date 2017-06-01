/**
 * Created by donghyunkim on 2017. 6. 1..
 */
(function(){
        let preId = "";
        let users=null;
        const MAX_SIZE = 2 * 1024 * 1000;
        const TAG_MAX_LEN = 5;
        const TAG_STR_MAX_LEN = 10;

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
        };


        let { nameInput,tagInput,fileInput,nameListArea,submitBtn,userDetail,deleteBtn,previewImg ,userDetailImg,userDetailName,tagArea,userId } = elements;


        fileInput.on("change",()=>{
            const file = fileInput.prop("files")[0];
            const reader = new FileReader();

            //console.log("file",file);

            let { size } = file;

            if(size > MAX_SIZE){
                alert("2MB 보다 작은 파일을 업로드 하세요.");
                fileInput.val("");
                return;
            }

            reader.addEventListener("load",(event)=>{
                previewImg.attr("src",reader.result);
            },false);

            if (file) {
                reader.readAsDataURL(file);
            }else{
                previewImg.attr("src","");
            }
        });


        submitBtn.on("click",()=>{
            //fileInput
            const data = {};
            data.name = nameInput.val();
            data.tag = tagInput.val();

            if(tagValidation(data.tag)){
                alert("tag를 다시 작성하세요");
                tagInput.val("");
                return;
            }

            data.img = fileInput.prop("files")[0];

            const formData = utility.createFormData(data);
            utility.runAjaxData(reqListener,"POST",config.DEFAULT_URL + "/",formData);

        });
        function tagValidation(tag){

            const tagArr = tag.split(",");

            if(tagArr.length > TAG_MAX_LEN) {
                return true;
            }

            let len = tagArr.filter((val)=>{

                return !REG_ALPHA.test(val) || val.length > TAG_STR_MAX_LEN || val === "";
            }).length;

            if (len){
                return true;
            }

            return false;


        }

        function reqListener(res) {

            nameInput.val("");
            tagInput.val("");
            fileInput.val("");
            previewImg.attr("src","");

            const { response } = res.currentTarget;

            const user = JSON.parse(response);
            const {_id , name } = user;
            const liElement = $(".nameListArea li");

            if(liElement.length){
                const firstLiElement = $(".nameListArea li:nth-child(1)");
                firstLiElement.before("<li id=" + _id + " class=userName >" + name+ "</li>");
            }else{
                nameListArea.empty();
                nameListArea.append("<li id=" + _id + " class=userName >" + name+ "</li>")
                preId = _id;
            }

            utility.runAjax(getUserListener,"GET",config.DEFAULT_URL + "/" + preId);


        }

        nameListArea.on("click", (event)=>{

            let { target } = event;
            let { nodeName , id} = target;
            const liElement = $(".nameListArea li");


            $.each(liElement,(idx,val)=>{
                console.log(val);
                val.style.backgroundColor = "white";
            });

            if(nodeName === "LI"){
                if(id === "addName" ){


                }else{
                    target.style.backgroundColor = "lightgray";
                    preId = target.id;
                    if(preId==="1"){
                        return;
                    }
                    utility.runAjax(getUserListener,"GET",config.DEFAULT_URL + "/" + preId);
                }

            }

        });



        function getUserListener(res){


            const { response } = res.currentTarget;
            const user = JSON.parse(response);
            const {img, tag, name, _id} = user;

            userId.val(_id);
            userDetailImg.attr("src",img);
            userDetailName.text(name);
            tagArea.empty();
            tag.forEach((val)=>{
                tagArea.append("<li class=tag >" + val + "</li>");
            });



        }


        userDetail.on("click",(event)=>{
            let { target } = event;
            if(target.type === "button"){
                let id = userId.val();
                if(id==="1"){
                    return;
                }else {
                    utility.runAjax(deleteUserListener.bind(null, id), "DELETE", config.DEFAULT_URL + "/" + id);
                }
            }
        });


        function deleteUserListener(id,res){



            const removeElement = $("#" +id);
            removeElement.remove();

            const liElement = $(".nameListArea li");
            if(liElement.length){
                const firstLiElement = $(".nameListArea li:nth-child(1)");
                const id = firstLiElement.attr("id");
                firstLiElement.css({"background-color" : "lightgray"});
                utility.runAjax(getUserListener,"GET",config.DEFAULT_URL + "/" + id);
            }else{
                preId = "1";
                userId.val(preId);
                userDetailImg.attr("src","");
                userDetailName.text("없음");
                tagArea.empty();
                let tag = ["없음"];
                tag.forEach((val)=>{
                    tagArea.append("<li class=tag >" + val + "</li>");
                });

            }

        }






})();

