const bodyParser = require('body-parser');
const cookieParser=require('cookie-parser');
const multer=require('multer');
const express=require('express');
const app=express(); 
var mysql=require('mysql');
var session= require('express-session');
var cors=require('cors');
app.set("viewengine","ejs");
var saltRounds=10;
var constants= require("./config.json");
app.use(express.json());
app.use(bodyParser.json());
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../etsyfrontend/src/uploads')
    },
    filename: (req, file, cb)=>{
        const mimeExtension={
            'image/jpeg' : '.jpeg',
            'image/jpg' : '.jpg',
            'image/png' : '.png',

        }
        cb(null,file.fieldname +'-'+Date.now()+mimeExtension[file.mimetype]);
    }
})
 
var upload = multer({ 
    storage: storage,
    fileFilter:(req,file,cb)=>{
        if(file.mimetype=='image/jpeg'||
       file.mimetype=='image/jpg'||
       file.mimetype=='image/png'){
       cb(null,true);
}else{
    cb(null,false);
    req.fileError="File format not valid";
} 
}
})

app.use(cors({origin:constants.frontend, 
    methods:['GET','POST'],
    credentials:true}));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended:true}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });
app.use(session({
    key:"userID",
    secret: 'etsyback',
    resave: false,
    saveUninitialized : false,
    duration : 60*60*1000,
    activeDuration : 5*60*1000,
    cookie:{
        expires: 60*60*24,
   
    },
}));
var dbConnection=mysql.createPool({
    host :constants.DB.host,
    user : constants.DB.username,
    password : constants.DB.password,
    port : constants.DB.port,
    database : constants.DB.database,
});
const passport=require('passport');
require('./config/passport');
app.use(passport.initialize());



dbConnection.getConnection((err)=>
{
    if(err)
    {
        throw 'error occured'+ err;
    }
    console.log("pool created");
});

app.post('/register',(req,res)=>{
    
    const username=req.body.username
    const password=req.body.password
    const emailid= req.body.emailid
    bcrypt.hash(password,saltRounds,(err,hash) =>{
    
        if(err){
            console.log(err);
        }
    dbConnection.query("INSERT INTO login (emailid,name,password) VALUES (?,?,?)",
    [emailid,username,hash],
    (err,result) =>{
        console.log(err);
        res.send(result);
    })
    console.log("db insertion");
})
})



 app.get("/login",(req,res)=>{
     if(req.session.user){
         res.send({loggedIn: true, user: req.session.user})
     }
     else{
         res.send({loggedIn:false});
     }
 })   
app.post("/login",(req,res) =>
{
    
    const emailid_login=req.body.emailid;
    const password_login=req.body.password;
    
    dbConnection.query(
        "SELECT * FROM login WHERE emailid= ?" ,
        [emailid_login],
        (err, result) => {

            if(result.length > 0){
                console.log(result);
                
                bcrypt.compare(password_login,result[0].password,(error,response) =>{
                    if(response){
                         const payload={
                            username:result[0].name,
                            id:result[0].id,
                            emailid:result[0].emailid
                        }
                        
                        req.session.user=result;
                        const accessToken=jwt.sign(payload, "CMPE273", { expiresIn : "1d"})
                        
                        res.send(
                            {success: true,
                            
                            token: "Bearer "+accessToken,
                            result}
                        )
                    }else{
                        res.send({message: "Wrong usename/password combination"});

                    }
                });
            }else{
                res.send({message:"User doesn't exist"});
            }

            
            
        })
        console.log("user found");
  
    
})


var landingpage = require('./src/routes/landingpage.js');
const { response } = require('express');
app.get('/protected', passport.authenticate('jwt', {session:false}),(req,res)=>
 res.status(200).send({
     success:true,
     user:{
        email: req.user.name,
        id:req.user.id
     }
 }))
 app.post('/getProducts',(req,res)=>{
     let limit=req.body.limit? parseInt(req.body.limit):100;
     let skip=parseInt(req.body.skip);
    
     dbConnection.query("SELECT * FROM products LIMIT ?,?",[skip,limit],
     (err,result) =>{
         console.log(result);
         if(err){

             res.status(400).json({success:false, err})
         }else{

             res.status(200).json({ success:true, result , postSize:result.length})
         }
     })
 }
 )

 app.post('/getShopName',(req,res) =>{
     let shop_name=req.body.shopname
     console.log(shop_name)
    dbConnection.query("SELECT * FROM products WHERE shopname = ?",
    [shop_name],
    (err,result) => {
        console.log(result);
        if(result.length>0){
            res.json({message:"NotAvailable"})
        }else{
            res.status(200).json({message:"Available"})
        }
    })
 })
 app.post('/addShop/:id',(req,res) =>{
    let shop_name=req.body.shopname
    let userid=req.params.id
    dbConnection.query("UPDATE login SET shopname= ? where id=?",[shop_name,userid],
    (err,result) =>{
        if(err){
            res.send("adding shop failed")
        }
        else{
            res.send("success")
        }
    })
 })


 app.post("/addProductShop/:shop", async (req, res) => {
    try {
      let upload = multer({ storage: storage }).single("itemImage");

      upload(req, res, function (err) {
          console.log("image name"+req.file);
        if (!req.file) {
          return res.send("Please select an image to upload");
        } else if (err instanceof multer.MulterError) {
          return res.send(err);
        } else if (err) {
          return res.send(err);
        }
  
        
        const itemName = req.body.itemName;
        const itemDescriprion = req.body.itemDescription;
        const itemPrice = req.body.itemPrice;
        const itemCount = req.body.itemCount;
        const itemImage = req.file.filename;
        const itemCategory = req.body.itemCategory;
        const userid=req.body.id;
        const shopname=req.params.shop;
        console.log(shopname);
        console.log(itemImage);
        console.log(itemName);
        dbConnection.query(
          "INSERT INTO products (productname, category, price, description, count, image, shopname, id) VALUES (?, ?, ?, ?, ?, ?,?, ?)",
          [
          
            itemName,
            itemCategory,
            itemPrice,
            itemDescriprion,
            itemCount,
            itemImage,
            shopname,
            userid

          ],
          (err, result) => {
            if (err) {
              console.log(err);
              res.send({ message: "error" });
            } else {
              res.send({ message: "success" });
            }
          }
        );
      });
    } catch (err) {
      console.log(err);
    }
  });
  app.post("/getAllProducts/:user_id", (req, res) => {
    
    const limit = req.body.limit ? parseInt(req.body.limit) : 100;
    const skip = parseInt(req.body.skip);
    const userid=req.params.user_id;
    console.log(userid);
    console.log(req.body.skip + "skip");
    console.log(req.body.limit + "limit");
    dbConnection.query(
      "SELECT * FROM products WHERE id=? LIMIT ?,?",
      [userid,skip,limit],
      (err, result) => {
        
        if (err) {
          console.log("err");
          res.send(err + "err");
        } else {
          console.log(result + "result");
          res
            .status(200)
            .json({ success: true, result, postSize: result.length });
        }
      }
    );
  });

  app.get('/editProduct/:product_id',async (req,res)=>{
      const user_id=req.params.product_id
      
      dbConnection.query("SELECT * FROM products WHERE productid=?",[user_id],
      (err,result)=>{
          if(err){
              res.send({error:err});
          }else{
              res.send({success:"true",result})
          }
      })

  })
  app.post('/editProduct/:product_id',async(req,res)=>{
      console.log("in post");
      console.log(req.body);
          const user_id=req.params.product_id
          const itemName = req.body.itemName;
          const itemDescriprion = req.body.itemDescription;
          const itemPrice = req.body.itemPrice;
          const itemCount = req.body.itemCount;
     
          const itemCategory = req.body.itemCategory;
    
         
          console.log(itemName);
          dbConnection.query(
            "UPDATE products SET productname=?, category=?, price=?, description=?, count=? WHERE productid=?",
            [
            
              itemName,
              itemCategory,
              itemPrice,
              itemDescriprion,
              itemCount,
              
              user_id
            ],
            (err, result) => {
              if (err) {
                console.log(err);
                res.send({ message: "error" });
              } else {
                res.send({ message: "success" });
              }
            }
          );
        });
        app.post("/updateImage/:product_id",async (req, res) => {
            console.log(req.body);
            try {
              let upload = multer({ storage: storage }).single("itemImage");
        
              upload(req, res, function (err) {
                  console.log("image name"+req.file);
                if (!req.file) {
                  return res.send("Please select an image to upload");
                } else if (err instanceof multer.MulterError) {
                  return res.send(err);
                } else if (err) {
                  return res.send(err);
                }
          
                
                const user_id=req.params.product_id
                const itemImage = req.file.filename;
                
          
                console.log(itemImage);
                
                dbConnection.query(
                  "UPDATE products set image=? WHERE productid=?",
                  [
                  
                    
                    itemImage,
                    user_id,
        
                  ],
                  (err, result) => {
                    if (err) {
                      console.log(err);
                      res.send({ success: "false" });
                    } else {
                      res.send({ success: "true" });
                    }
                  }
                );
              });
            } catch (err) {
              console.log(err);
            }
          });
      app.post("/updateshopImage/:user_id",async (req, res) => {
        console.log("updateimage"+req.body);
        try {
          let upload = multer({ storage: storage }).single("itemImage");
    
          upload(req, res, function (err) {
              console.log("image name"+req.file);
            if (!req.file) {
              return res.send("Please select an image to upload");
            } else if (err instanceof multer.MulterError) {
              return res.send(err);
            } else if (err) {
              return res.send(err);
            }
      
            
            const user_id=req.params.user_id
            const itemImage = req.file.filename;
            
      
            console.log(itemImage);
            
            dbConnection.query(
              "UPDATE login set shopimage=? WHERE id=?",
              [
              
                
                itemImage,
                user_id,
    
              ],
              (err, result) => {
                if (err) {
                  console.log(err);
                  res.send({ success: "false" });
                } else {
                  
                  res.send({ success: "true" ,shopimage:itemImage});
                }
              }
            );
          });
        } catch (err) {
          console.log(err);
        }
      });
     app.get('/updateshopImage/:user_id',async (req,res)=>{
      const user_id=req.params.user_id
      
      dbConnection.query("SELECT * FROM login WHERE id=?",[user_id],
      (err,result)=>{
          if(err){
              res.send({error:err});
          }else{

              res.send({success:"true",result})
          }
      })

  })
   
  app.get("/getSearchItems/:SearchTerms", (req, res) => {
    console.log("get Search Items -------------------------------");
    const searchValue = req.params.SearchTerms;
    console.log(searchValue);
  
    dbConnection.query(
      `SELECT * FROM products WHERE productname REGEXP '${searchValue}'`,
      (err, result) => {
        console.log(result);
        if (err) {
          res.send(err);
        } else {
          res.send({ success: true, result });
        }
      }
    );
  });  
  app.post("/profile",async (req,res)=>{
          
    try {
      let upload = multer({ storage: storage }).single("userImage");

      upload(req, res, function (err) {
          console.log("image name"+req.file);
        if (!req.file) {
          return res.send("Please select an image to upload");
        } else if (err instanceof multer.MulterError) {
          return res.send(err);
        } else if (err) {
          return res.send(err);
        }
  
        
        const userName = req.body.userName;
        const about = req.body.about;
        const gender = req.body.gender;
        const dob = req.body.dob;
        const userImage = req.file.filename;
        const country = req.body.country;
        const userid=req.body.id;
    
        dbConnection.query(
          "UPDATE login set name=?,about=?,gender=?,dob=?,profileimage=?,country=? WHERE id=?",
          [
          
            userName,
            about,
            gender,
            
            dob,
            userImage,
            country,
            userid

          ],
          (err, result) => {
            if (err) {
              console.log(err);
              res.send({ message: "error" });
            } else {
              res.send({ message: "success" });
            }
          }
        );
      });
    } catch (err) {
      console.log(err);
    }
        }); 
        app.get('/getProducts/:productid',async(req,res)=>{
          let product_id=req.params.productid;
          console.log("Product_is"+product_id);
         
          dbConnection.query("SELECT * FROM products where productid=?",[product_id],
          (err,result) =>{
              console.log(result);
              if(err){
     
                  res.status(400).json({success:false, err})
              }else{
     
                  res.status(200).json({ success:true, result })
              }
          })
      }
      )
      app.post("/addFav/:productid/:userid", (req, res) => {
        const userId = req.params.userid;
        console.log(userId);
        const itemId = req.params.productid;
        console.log(itemId);
        dbConnection.query(
          "INSERT INTO favorites (productid, userid) VALUES (?, ?)",
          [itemId, userId],
          (err, result) => {
            console.log(result);
            if (err) {
              console.log(err);
              res.send(err);
            } else {
              res.send({ success: true, result });
            }
          }
        );
      });
      app.get("/getFav/:userid", (req, res) => {
        const userId = req.params.userid;
        console.log(userId);
        console.log("Getting all favoutrites in home");
        dbConnection.query(
          "SELECT * FROM products WHERE productid IN (SELECT productid FROM favorites WHERE userid=?)",
          [userId],
          (err, result) => {
            console.log(result);
            if (err) {
              console.log(err);
              res.send(err);
            } else {
              res.send({ success: true, result });
            }
          }
        );
      });
      app.post("/addProductToCart/:userid", (req, res) => {
        const userId = req.params.userid;
        const itemId = req.body.itemId;
        const qty = req.body.qty;
        dbConnection.query(
          "INSERT INTO cart (cuserid, cproductid, quantity) VALUES (?, ?, ?)",
          [userId,itemId, qty],
          (err, result) => {
            console.log(result);
            if (err) {
              console.log(err);
              res.send(err);
            } else {
              res.send({ success: true, result });
            }
          }
        );
      });

      app.post("/delcart",(req,res)=>{
        const userId = req.params.userid;
        const itemId = req.body.itemId;
        const qty = req.body.qty;

        dbConnection.query(
          "DELETE FROM cart WHERE userid=? AND productid=?",
          [userId,itemId],
          (err, result) => {
            console.log(result);
            if (err) {
              console.log(err);
              res.send(err);
            } else {
              res.send({ success: true, result });
            }
          }
        );
      })
      app.get("/getFinalCartProducts/:userid", (req, res) => {
        const userId = req.params.userid;
        console.log("Getting all products in home");
        dbConnection.query(
          "SELECT * FROM products WHERE productid IN (SELECT cproductid FROM cart WHERE cuserid=?)",
      
          [userId],
          (err, result) => {
            console.log(result);
            if (err) {
              console.log(err);
              res.send(err);
            } else {
              res.send({ success: true, result });
            }
          }
        );
      });
      app.put("/updateCartQuantity/:userId", (req, res) => {
        const userId = req.params.userId;
        // const userId = req.params.id;
        const itemId = req.body.itemId;
        const qty = req.body.qty;
      
        console.log("In update cart");
        console.log(itemId);
        console.log(qty);
        console.log(userId);
      
        db.query(
          "UPDATE cart SET quantity = ? WHERE cuserid=? AND cproductid = ?",
          [qty, userId, itemId],
          (err, result) => {
            console.log(result);
            if (err) {
              console.log(err);
              res.send(err);
            } else {
              res.send({ success: true, result });
            }
          }
        );
      });
      app.get("/getQty/:userid/:productid", (req, res) => {
        const userId = req.params.userid;
        const productId=req.params.productid
        console.log("user"+userId);
        console.log("product "+productId)
        console.log("Getting all products in home");
        dbConnection.query(
          "SELECT quantity FROM cart WHERE cuserid=? AND cproductid=?",
      
          [userId,productId],
          (err, result) => {
            console.log(result);
            if (err) {
              console.log(err);
              res.send(err);
            } else {
              res.send({ success: true, result });
            }
          }
        );
      });
      app.post("/editCount/:id",(req,res)=>{
        const productid=req.params.id;
        const quantity=req.body.quantity;
        console.log(productid);
        console.log(quantity);
        dbConnection.query(
          "UPDATE products SET count=count-?,sales=sales+? WHERE productid=?",
          [quantity,quantity,productid],
          (err,result)=>{
            if(err){
              console.log(err);
            }else{
              res.send({success:true});
            }
          }
        )
      })



  

//app.use(basePath,landingpage);s
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});



