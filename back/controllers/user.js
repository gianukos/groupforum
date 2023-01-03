const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require('../middleware/database');
require("dotenv").config()
exports.signup = async (req, res) => {
    if ( typeof req.body !== null){
        const body = req.body;
        // request is POST following preflight OPTION request
        await bcrypt.hash(body.password, 10).then( (encpass) => {
            const user = {
                name:body.name,
                email:body.email,
                password:encpass,
                bio:body.bio
            };
        var sql = 'SELECT * FROM users WHERE email = ?'
        pool.query(
            sql,
            [body.email],
            (error, userData) => {
                if (error){
                    return res.status(401).json({error: error});
                }
                if (userData.length > 0 && userData.rowCount != 0){
                    res.status(400).json("registered user");
                } else {
                        var sql = 'INSERT INTO users(name, email, password, bio) VALUES ( ?, ?, ?, ? )'
                        pool.query(
                            sql,
                            [user.name, user.email, user.password, user.bio],
                            (error, usersRowObjects) => {
                                if (error){
                                    throw error;
                                }
                                console.log("Registered user " + user.email);
                                res.status(201).json( user.email )
                    });
                }
            })
        });
    }
};
exports.login = async (req, res) => {
    if ( typeof req.body !== null){
        const body = req.body;
        // request is POST following preflight OPTION request
        var sql = 'SELECT * FROM users WHERE email = ?'
        pool.query(
            sql,
            [body.email],
            (error, userData) => {
                if (error){
                    return res.status(401).json({error: error});
                }
                if (userData.length > 0 && userData.rowCount != 0){
                    bcrypt.compare(body.password, userData[0].password)
                        .then((matching) => {
                            if (!matching){
                                console.log("password rejected for user " + body.email)
                                return res.status(401).json( {"error":"Password incorrect"} )
                            } else {
                                const token = jwt.sign({userId: userData[0].userID}, 'TOKEN_SECRET', {expiresIn: '24h'});
                                console.log(`Successful login by ${userData[0].userID}`)
                                res.status(200).json({
                                    userId: userData[0].userID, token: token
                                });
                            }
                        }
                    )
                } else {
                    return res.status(401).json( {error: new Error('Invalid email')} )
            }
        });
    }
}
