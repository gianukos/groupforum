const jwt = require("jsonwebtoken")
const pool = require('../middleware/database');
require("dotenv").config();
exports.createComment = async (req, res) => {
    if ( typeof req.body !== null ){
        const body = req.body;
        let sql = 'SELECT comment from comments where postID = ? and userID = ? order by time_created desc limit 1'
        await pool.query(
            sql,
            [
            body.postID,
            body.userID
            ],
            (error, userData) => {
                if (error){
                    return res.status(401).json({error: error});
                } else if (userData.length > 0 && userData[0].comment === body.comment){
                    res.status(400).json({error:"duplicate post"});
                } else {
                sql = 'INSERT INTO comments( postID, userID, name, comment ) VALUES( ?, ?, ?, ? )'
                pool.query(
                    sql,
                    [
                    body.postID,
                    body.userID,
                    body.name,
                    body.comment
                    ],
                    (error, postData) => {
                        if (error){
                            return res.status(401).json({error: error});
                        }else{
                            console.log(`comment added by ${body.userID}`);
                            res.status(200).json({
                                message: 'comment created successfully!'
                            })
                    }
                })
            }
        });
    }
};
exports.getComments = async (req, res) => {
    let sql = 'select * from comments where postID = ? order by time_created desc'
    await pool.query(
        sql,
        [req.query.p],
        (error, userData) => {
            if (error){
                return res.status(401).json({error: error});
            }else if( userData.length > 0 && userData.rowCount != 0 ){
                res.status(200).json({
                    userData
                });   
            } else {
                if ( userData.length === 0 ) {
                    res.status(200).json({message:"no comments yet"})
            }
        }
    })
};