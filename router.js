var express = require('express')
var mysql = require('./mysql')
var md5 = require('blueimp-md5')
var fs = require('fs')

var router = express.Router()

router.get('/', function (req, res) {
    res.render('login.html')
})

router.post('/',function(req,res){

})
router.get('/login', function (req, res) {
    res.render('login.html')
})
router.post('/login',function(req,res){
    const {sno,password} = req.body;
    var sql = `select * from student where stusno=${sno} and stupassworld=${password} `;
    mysql(sql).then(data=>{
        if(Array.prototype.isPrototypeOf(data) && data.length === 0){
            return res.status(200).json({
                err_code:1,
                message:'账号或者密码错误'
            })
        }else{
            var dataString = JSON.stringify(data);
            var data = JSON.parse(dataString);
            req.session.islogin = data
            return res.status(200).json({
                err_code:0,
                message:'ok'
            })
        }
    }).catch(err=>{
        return res.status(200).json({
            err_code:500,
            message:err.message
        })
    })
})
router.post('/login2',function(req,res){
    const {sno,password} = req.body;
    var sql = `select * from teacher where sno=${sno} and passworld=${password} `;
    mysql(sql).then(data=>{
        if(Array.prototype.isPrototypeOf(data) && data.length === 0){
            return res.status(200).json({
                err_code:1,
                message:'账号或者密码错误'
            })
        }else{
            var dataString = JSON.stringify(data);
            var data = JSON.parse(dataString);
            req.session.tealogin = data
            return res.status(200).json({
                err_code:0,
                message:'ok'
            })
        }
    }).catch(err=>{
        return res.status(200).json({
            err_code:500,
            message:err.message
        })
    })
})


router.get('/zhuce', function (req, res) {
    res.render('zhuce.html')
})
router.post('/zhuce', function (req, res) {
    console.log(req.body)
    const {stusno,stuname,password,repassword} = req.body;
    var sql = `INSERT INTO student(stusno,stuname,stupassworld)VALUES ('${stusno}','${stuname}','${password}'); `;
    mysql(sql).then(data=>{
        return res.status(200).json({
            err_code:0,
            message:'插入成功'
        })
    }).catch(err=>{
        return res.status(200).json({
            err_code:500,
            message:err.message
        })
    })
})



router.get('/teamain', function (req, res) {
    if(req.session.tealogin == null){
        res.redirect('/');
    }else{
    var isteaginstring = JSON.stringify(req.session.tealogin);
    var tealogin = JSON.parse(isteaginstring);
    var sql = `SELECT * FROM student,subjectlist WHERE student.stuchoose=subjectlist.sbjsno AND student.stuchoose>0`;
    var sql2=`SELECT * FROM student WHERE stuchoose  IS NULL`;
    var sql3 = `SELECT * FROM subjectlist`;
    var sql4 = `select * from teacher where sno=${tealogin[0].sno} `;
    var sql5 = `SELECT * FROM qiandao,student WHERE student.stusno=qiandao.stusno AND qiandao.SNO =${tealogin[0].sno} `;
    mysql(sql).then(_data=>{
        mysql(sql2).then(_data2=>{
            mysql(sql3).then(_data3=>{
                mysql(sql4).then(_data4=>{
                    mysql(sql5).then(data5=>{
                        var dataString = JSON.stringify(_data);
                        var  data = JSON.parse(dataString);
                        var dataString2 = JSON.stringify(_data2);
                        var  data2 = JSON.parse(dataString2);
                        var dataString3 = JSON.stringify(_data3);
                        var  data3 = JSON.parse(dataString3);
                        var dataString4 = JSON.stringify(_data4);
                        var  data4 = JSON.parse(dataString4);
                        var wwwDir = 'C:/Users/HP/Desktop/学生课程设计管理系统/课程设计管理系统/login/studentchengguo'
                        fs.readdir(wwwDir,function(err,file){
                            if(err){
                                return res.end('目录读取失败！！')
                            }
                            res.render('teamain.html',{
                            stucguo:file,
                            ischosestu:data,
                            notchosestu:data2,
                            allsubject:data3,
                            tealogin:data4,
                            qiandao:data5
                            })
                        })
                    }).catch(err=>{
                        return res.status(200).json({
                            err_code:1,
                            message:err.message
                        })
                    })
                }).catch(err=>{
                    return res.status(200).json({
                        err_code:1,
                        message:err.message
                    })
                })
            }).catch(err=>{
                return res.status(200).json({
                    err_code:1,
                    message:err.message
                })
            })
        }).catch(err=>{
            return res.status(200).json({
                err_code:1,
                message:err.message
            })
        })
    }).catch(err=>{
        return res.status(200).json({
            err_code:1,
            message:err.message
        })
    })

    }
})
router.post('/teamain', function (req, res) {
    
})
router.post('/teamain/kcgr', function (req, res) {
    const {kcid,kcmc} = req.body;
    var sql = `INSERT INTO subjectlist (sbjsno,sbjname) VALUES (${kcid},${kcmc})`;
    mysql(sql).then(data=>{
        return res.status(200).json({
            err_code:0,
            message:'ok'
        })
    }).catch(err=>{
        return res.status(200).json({
            err_code:1,
            message:err.message
        })
    })
})


router.get('/teamain/shanchu', function (req, res) {
    var sbjsno = req.query.sbjsno;
    var sql = `DELETE FROM subjectlist WHERE sbjsno = ${sbjsno}`;
    mysql(sql).then(data=>{
        res.redirect('/teamain/kcck')
    }).catch(err=>{
        return res.status(200).json({
            err_code:1,
            message:err.message
        })
    })
})
router.get('/teamain/startclass', function (req, res) {
    var teasno = req.query.teasno;
    var sql = `UPDATE teacher SET starclass = 1 WHERE sno = ${teasno}`;
    mysql(sql).then(data=>{
        res.redirect('/teamain')
    }).catch(err=>{
        return res.status(200).json({
            err_code:1,
            message:err.message
        })
    })
})
router.get('/teamain/endclass', function (req, res) {
    var teasno = req.query.teasno;
    var sql = `UPDATE teacher SET starclass = 0 WHERE sno = ${teasno}`;
    var sql2=` UPDATE teacher SET classtimes=classtimes+1 WHERE sno = ${teasno}`;
    mysql(sql).then(_data=>{
        mysql(sql2).then(data2=>{
            res.redirect('/teamain')
        }).catch(err=>{
            return res.status(200).json({
                err_code:1,
                message:err.message
            })
        })
    }).catch(err=>{
        return res.status(200).json({
            err_code:1,
            message:err.message
        })
    })
})



router.post('/teamain/cjsc', function (req, res) {
    const {stusno,pingshivalue,testvalue,qimovalue} = req.body
    var sql = `UPDATE qiandao SET testvalue=${testvalue},qimovalue=${qimovalue} WHERE stusno= ${stusno}`
    mysql(sql).then(data=>{
        return res.status(200).json({
            err_code:0,
            message:'修改成绩成功'
        })
    }).catch(err=>{
        return res.status(200).json({
            err_code:1,
            message:'修改成绩失败'
        })
    })
    
})





router.get('/stumain', function (req, res) {
    if(req.session.islogin == null){
        res.redirect('/');
    }else{
    var sql = `select * from subjectlist where sbjischose = 0 `;
    var sql2 = `SELECT * FROM teacher`;
    var isloginstring = JSON.stringify(req.session.islogin);
    var islogin = JSON.parse(isloginstring);
    var sql3 = `SELECT * FROM student WHERE stusno=${islogin[0].stusno}`
    //var sql22 = `SELECT * FROM subjectlist WHERE sbjischose=0 LIMIT 0,4`;
    mysql(sql).then(_data=>{
        mysql(sql2).then(_data2=>{
            mysql(sql3).then(data3=>{
                var dataString = JSON.stringify(_data);
                var  data = JSON.parse(dataString);
                var dataString2 = JSON.stringify(_data2);
                var  data2 = JSON.parse(dataString2);
                var dataString3 = JSON.stringify(data3);
                var  data3 = JSON.parse(dataString3);
                 res.render('stumain.html',{
                    islogin:data3,
                    subject:data,
                    allteacher:data2
                })
            }).catch(err=>{
                return res.status(200).json({
                    err_code:500,
                    message:err.message
                })
            })
        }).catch(err=>{
            return res.status(200).json({
                err_code:500,
                message:err.message
            })
        })
        }).catch(err=>{
            return res.status(200).json({
                err_code:500,
                message:err.message
            })
        })
    }
})

router.get('/stumain/xuanze', function (req, res) {
    var stusno = req.session.islogin[0].stusno;
    var sbjsno = req.query.sbjsno;
    var sql = `UPDATE student SET stuchoose = ${sbjsno}  WHERE stusno = ${stusno}`;
    var sql2 = `UPDATE subjectlist SET sbjischose = 1 WHERE sbjsno = ${sbjsno}`;
    var sql3 = `select * from student where stusno=${stusno}`;
    var sql4 = `select * from subjectlist where sbjischose = 0 `;
    mysql(sql).then(_data=>{
        mysql(sql2).then(_data2=>{
            mysql(sql3).then(_data3=>{
                mysql(sql4).then(data4=>{
                var dataString = JSON.stringify(_data3);
                var data3 = JSON.parse(dataString);
                req.session.islogin = data3
                res.render('stumain.html',{
                    islogin:req.session.islogin,
                    subject:data4
                })    
                }).catch(err=>{
                    return res.status(200).json({
                        err_code:500,
                        message:err.message
                    })
                })
                
            }).catch(err=>{
                return res.status(200).json({
                    err_code:500,
                    message:err.message
                })
           })
         }).catch(err=>{
             return res.status(200).json({
                 err_code:500,
                 message:err.message
             })
        })
     }).catch(err=>{
         return res.status(200).json({
             err_code:500,
             message:err.message
         })
    })
})

router.post('/stumain/xsqd', function (req, res) {
    const {qdstusno,teasno,classtimes} = req.body
    var sql = `UPDATE qiandao SET class${classtimes}=1,allget=allget+1 WHERE stusno= ${qdstusno} AND sno = ${teasno}`
    var sql2 = `UPDATE student SET sking = 1 WHERE stusno= ${qdstusno}`
    mysql(sql).then(_data=>{
        mysql(sql2).then(data2=>{
            return res.status(200).json({
                err_code:0,
                message:'签到成功！'
            })
        }).catch(err=>{
            return res.status(200).json({
                err_code:1,
                message:'签到失败！'
            })
        })
    }).catch(err=>{
        return res.status(200).json({
            err_code:1,
            message:'签到失败！'
        })
    })
    
})
router.get('/stumain/xsqt', function (req, res) {
    const stusno = req.query.stusno
    var sql = `UPDATE student SET sking = 0 WHERE stusno =${stusno};`
    mysql(sql).then(_data=>{
        res.redirect('/stumain')
    }).catch(err=>{
        return res.status(200).json({
            err_code:1,
            message:'签到失败！'
        })
    })
    
})

router.post('/stumain', function (req, res) {
    
})

router.post('/stumain/ktsc', function (req, res) {
    const {path,pathname,pathtype} = req.body
    console.log(path);                 
    fs.readFile(path,function(err,data){
        if(err){
            console.log(err)
        }
        var nodepath = './studentchengguo/'+pathname;
        fs.writeFile(nodepath,data,'utf8',function(error){
            if(error){
                return res.status(200).json({
                    err_code:1,
                    message:'上传失败！'
                })
            }
            return res.status(200).json({
                err_code:0,
                message:'上传成功！'
            })
        })
    })
})

router.get('/tealogout', function (req, res) {
    // 清除登陆状态
    req.session.tealogin = null
  
    // 重定向到登录页
    res.redirect('/login')
})
router.get('/stulogout', function (req, res) {
    // 清除登陆状态
    req.session.islogin = null
  
    // 重定向到登录页
    res.redirect('/login')
})

module.exports = router