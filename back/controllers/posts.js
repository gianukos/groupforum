const jwt = require("jsonwebtoken");
const pool = require('../middleware/database');
require("dotenv").config();
exports.createPost = async (req, res) => {
    if ( typeof req.body !== null ){
        const body = req.body;
        var sql = 'SELECT description FROM posts WHERE name = ? and topic = ? and description = ?'
        await pool.query(
            sql,
            [
            body.name,
            body.topic,
            body.description
            ],
            (error, postData) => {
                if (error){
                    return res.status(401).json({error: error});
                }
                if (postData.length > 0 ){
                    res.status(400).json({error:"duplicate post"});
                } else {
                    sql = 'INSERT INTO posts( userID, name, url, topic, description ) VALUES( ?, ?, ?, ?, ? )'
                    pool.query(
                        sql,
                        [
                        body.id,
                        body.name,
                        body.url,
                        body.topic,
                        body.description
                        ],
                        (error) => {
                            if (error){
                                return res.status(401).json({error: error});
                            }else{
                                console.log(`Successful post made by ${body.id}`);
                                res.status(200).json({
                                    message: 'post created successfully!'
                                });
                        }
                    });
                }
            }
        )
    }
}
// exports.readPost = async (req, res) => {
//     if ( typeof req.body !== null ){
//         const body = req.body;
//         var sql = 'SELECT * FROM users WHERE postID = ?'
//         pool.query(
//             sql,
//             [body.id]
//         )
//     }
// }