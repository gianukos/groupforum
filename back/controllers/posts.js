const jwt = require("jsonwebtoken");
const pool = require('../middleware/database');
require("dotenv").config();
exports.createPost = async (req, res) => {
    if ( typeof req.body !== null ){
        const body = req.body;
        const post = {
        };
        var sql = 'SELECT description FROM posts WHERE name = ? and topic =?'
        pool.query(
            sql,
            [post],
            (error, postData) => {
                if (error){
                    return res.status(401).json({error: error});
                }
                if (postData.length = 1 && postData[0] === post.description){
                    res.status(400).json("duplicate");
                } else if (postData.length > 1 ) {
                    false
                } else {
                    sql = 'INSERT INTO posts() VALUES ()'
                    pool.query(
                        sql,
                        [],
                        (error) => {
                            if (error){
                                throw error;
                            }
                    });
                }
            }
        )
    }
}
exports.readPost = async (req, res) => {
    if ( typeof req.body !== null ){
        const body = req.body;
        var sql = 'SELECT * FROM users WHERE postID = ?'
        pool.query(
            sql,
            [body.id]
        )
    }
}