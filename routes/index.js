const express = require('express');
const requestSender = require('request');
const router = express.Router();
const multer = require("multer");
const bodyParser = require('body-parser');
const User = require("../database/model/user");
const WEBHOOK_URL = "https://hooks.slack.com/services/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";
router.use(express.static('public'));
router.use(bodyParser.urlencoded({extended : true}));
router.use(bodyParser.json());
const LIMIT_LEN = 5;
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/images/uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname+ '-' + Date.now() + "." +file.mimetype.split("/")[1])
    }
});
const upload = multer({storage: storage});

router.get('/', function(req, res) {
  let user = {_id:"1",name:"없음", img:"", tag:["없음"]};
  User.find({}).sort({date : -1}).skip(0).limit(LIMIT_LEN).exec((err,users)=>{
      if(err) res.status(500).json(err);
      if(!users.length) {
          res.render('index',{err:"Not found users", user: user});
      }else{
          res.render('index', {users : users, user: user});
      }
  });
});

router.post("/",upload.single("img"),(req,res)=>{
  let data = req.body;
  let path = req.file.path;
  path = path.split("/").slice(1);
  data.tag = data.tag.split(",");
  data.img = "http://localhost:3000/"+ path.join("/");
  let user = new User(data);
  let payloadData = {
      "username" : "dhkim",
      "text" : data.name + " 사용자가 추가되었습니다.",
  };

  user.save()
      .then((user)=>{
          res.json(user);
          requestSender(createWebhookOption(payloadData),(err, response, body)=>{
          });
      })
      .catch((err)=>{
        res.status(500).json(err);
      });
});

function createWebhookOption(payloadData){
    return {
        method: 'POST',
        uri: WEBHOOK_URL,
        body: payloadData,
        json: true
    };
}

router.get("/:id",(req,res)=>{
    const {id} =  req.params;

    User.find({_id:id},(err,user)=>{
        if(err) res.status(500).json(err);
        if(user) {
            if (!user.length) res.json({err: "Not found user"});
            else {
                console.log(user[0]);
                res.json(user[0]);
            }
        }
    });
});

router.delete("/:id",(req,res)=>{
    const {id} =  req.params;

    User.findOneAndRemove({_id:id},(err, doc)=>{
        if(err) res.status(500).json(err);
        res.json(doc);
    });
});

router.get("/more/:id",(req,res)=>{
    let { id } = req.params;

    User.find({_id: {$lt: id}}).sort({date : -1}).limit(LIMIT_LEN).exec((err,users)=>{
        if(err) res.status(500).json(err);
        if(users) {
            if (!users.length) {
                res.json({err: "Not found user"});
            } else {
                res.json(users);
            }
         }
    });
});

module.exports = router;
