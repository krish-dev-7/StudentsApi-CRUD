const express = require('express');
const {v4 : uuid4} = require('uuid');
const bcrypt = require('bcrypt');
//Model import
const Students = require('../models/student');
const Mod = require('../models/mods');

//router initialization
const router = express.Router();
//url parsing
router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/', (req, res) => {
    res.json({success: true, message: 'Api can be implemented'});
})

router.post('/addStudent',async (req, res) => {
    const studId = uuid4();
    const stud = new Students({
        studId: studId,
        name: req.body.name,
        dept: req.body.dept,
        year: req.body.year,
        regNo: req.body.regNo
    });
    await stud.save()
    .then((result) => res.json({success: true, student: stud})).catch((err) =>{
        if(err||err.code === 11000){
            res.json({success: false, message:"Already exist!"});
        }
        else{
            res.json({success:false, message: err})
        }
    });
});

router.get('/students', async (req, res) => {
     res.json(await Students.find());
});

router.get('/studId/:studId', async (req, res)=>{
    const stud = await Students.findOne({studId: req.params.studId});
    if(stud) res.json(stud);
    else{
        res.json({success:false, message:"Student Not Found"});
    }
});
router.delete('/studId/delete/:studId/', async (req, res)=>{
    await Students.remove({studId: req.params.studId},(err)=>{
        if(err){
            res.json({success:false, error: err});
        }
        else{
            res.json({success:true, message:req.params.studId+" Deleted"})
        }
    });
});
router.delete('/regNo/delete/:regNo', async (req, res)=>{
    await Students.remove({regNo: req.params.regNo},(err)=>{
        if(err){
            res.json({success:false, error: err});
        }
        else{
            res.json({success:true, message:req.params.regNo+" Deleted"})
        }
    });
});
router.get('/regNo/:regNo', async (req, res)=>{
    const stud = await Students.findOne({regNo: req.params.regNo});
    if(stud) res.json(stud);
    else{
        res.json({success:false, message:"Student Not Found"});
    }
});

router.post('/regNo/update/:regNo', async (req, res)=>{
    const update = {
        name: req.body.name,
        dept: req.body.dept,
        year: req.body.year,
    };
    const filter = {
        regNo: req.params.regNo
    };
    await Students.findOneAndUpdate(filter, update).then(async ()=>{
        
        const stud = await Students.findOne(filter);
        if(stud) res.json({success: true,stud: stud});
        else{
            res.json({success:false, message:"Oops!, Can't Update"});
        }
    });
    
})

router.post('/mod/register', async(req, res) => {
    const modId = uuid4();
    const salt = await bcrypt.genSalt(10);
    const password = req.body.password;
    const hashedPass = await bcrypt.hash(password, salt);
    const mod = new Mod({
        modId:modId,
        name: req.body.name,
        email: req.body.email,
        password: hashedPass
    });
    await mod.save().then((result) => {
        res.json({success:true, mod: mod});
    }).catch((err) => {
        if(err && err.code === 11000){
            res.json({success:false, message:"User already exists, try with another email"});
        }
        else{
            res.json({success:false, message:"can't register"})
        }
    });
});

router.get('/mod/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const mod = await Mod.findOne({email: email});
    if(mod){
        console.log(mod.name);
        const isValidPass = await bcrypt.compare(password, mod.password);
        console.log("is valid --> "+isValidPass)
        if(isValidPass){
            res.json({success:true, message:"Login successfull", mod: mod});
        }
        else{
            res.json({success:false, message:"Wrong password"});
        }
    }
    else{
        res.json({success:false, message:"User does not exist, register in '/api/mod/register' endpoint"})
    }
})


module.exports = router;