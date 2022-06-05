const express = require('express');
const {v4 : uuid4} = require('uuid');

//Model import
const Students = require('../models/student');

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


module.exports = router;