/**
 * Created by donghyunkim on 2017. 6. 1..
 */
(function(){
        let cnt = 0;
        const {$selector} = utility;
        const elements = {
            nameInput : $selector(".nameInput"),
            tagInput : $selector(".tagInput"),
            fileInput : $selector(".fileInput"),
            submitBtn : $selector("#submitBtn"),
            nameListArea : $selector(".nameListArea"),
            userDetail : $selector(".userDetail"),
            deleteBtn : $selector(".deleteBtn"),
            previewImg : $selector("#previewImg"),




        };


        let { nameInput,tagInput,fileInput,nameListTemplate,nameListArea,submitBtn,userDetail,deleteBtn } = elements;


        fileInput.addEventListener("change",()=>{
            const reader = new FileReader();

            reader.addEventListener("load",(event)=>{
                previewImg.src = reader.result;
            },false);
        });


        submitBtn.addEventListener("click",()=>{
            //fileInput

            const data = {};

            data.name = nameInput.value;
            data.tag = tagInput.value;
            data.img = fileInput.files[0];
            const formData = utility.createFormData(data);
            utility.runAjaxData(reqListener,"POST",config.DEFAULT_URL + "/",formData);




        });

        function reqListener(res) {

            nameInput.value = "";
            tagInput.value = "";
            fileInput.value = "";

            const { response } = res.currentTarget;

            const users = JSON.parse(response);

            //console.log("user",users);

            let renderTemplate = $selector("#nameListTemplate").innerText;

            renderTemplate = renderTemplate.replace("{{nameList}}",users.map((val)=>{
                let {_id ,name } = val;
                return "<li id=" + _id + " class=userName >" + name+ "</li>"
            }).join(""));

            nameListArea.innerHTML = renderTemplate;


        }

        nameListArea.addEventListener("click", (event)=>{

            let { target,currentTarget } = event;
           // console.log("currentTarget.child(li)",currentTarget.children);
            let { nodeName , id} = target;
            if(nodeName === "LI"){

                if(id === "addName" ){




                }else{
                    target.style.backgroundColor = "lightgray";
                    let id = target.id;
                    utility.runAjax(getUserListener,"GET",config.DEFAULT_URL + "/" + id);
                }

            }


        });



        function getUserListener(res){


            const { response } = res.currentTarget;
            const user = JSON.parse(response);

            const {img, tag, name, _id} = user;


            let renderTemplate = $selector("#userDetailTemplate").innerText;

            renderTemplate = renderTemplate.replace("{{id}}",_id);
            renderTemplate = renderTemplate.replace("{{imgUrl}}",img);
            renderTemplate = renderTemplate.replace("{{name}}",name);
            renderTemplate = renderTemplate.replace("{{tagList}}",tag.map((val)=>{
                    return "<li class=tag >" + val + "</li>"
            }).join(""));


            userDetail.innerHTML = renderTemplate;
        }


        userDetail.addEventListener("click",(event)=>{
            let { target } = event;
            if(target.type === "button"){
                let id = $selector("#userId").value;
                utility.runAjax(deleteUserListener,"DELETE",config.DEFAULT_URL + "/" + id);
            }
        });


        function deleteUserListener(res){
            location.reload();
        }






})();


// runAjaxData : function(reqListener, method, url, data, contentType){
//     let xhr = new XMLHttpRequest();
//     //reqListener 제일 마지막에 실행된다.
//
//     xhr.open(method, url);
//     //xhr.setRequestHeader("Content-Type","application/json");
//     if(contentType !== undefined){
//         xhr.setRequestHeader("Content-Type",contentType);
//     }
//
//     xhr.send(data);
//     xhr.addEventListener("load", reqListener);
// },