const connection = require('./middleware/groupomania');

connection.query(
    `
    USE groupomania;
    ` , function(error){if (error) throw error;}
)

.then(connection.query(
  `
      CREATE TABLE IF NOT EXISTS users (
          userID varchar(36) NOT NULL DEFAULT (uuid()),
          name varchar(100) NOT NULL, 
          email varchar(100) NOT NULL,
          password varchar(100) NOT NULL,
          bio varchar(1000) NOT NULL,
          PRIMARY KEY (userID),
          UNIQUE KEY email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
      `, function(error){if (error) throw error;
          else console.log("----users----");})
  )
  
.then(connection.query(
    `
    CREATE TABLE IF NOT EXISTS posts (
        postID varchar(36) NOT NULL DEFAULT (uuid()) ,
        userID varchar(36) NOT NULL,
        name varchar(100) NOT NULL,
        topic varchar(100) NOT NULL,
        description varchar(5000) NOT NULL,
        url varchar(100) DEFAULT NULL,
        filepath varchar(500) DEFAULT NULL,
        time_created datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (postID),
        KEY fk_user (userID),
        CONSTRAINT fk_user FOREIGN KEY (userID) REFERENCES users (userID) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
      `, function(error){if (error) throw error;
        else console.log("----posts----");})
)
.then(connection.query(
  `
   CREATE TRIGGER after_posts_insert AFTER INSERT ON posts FOR EACH ROW insert into read_posts values ( new.userID, new.postID )
   `, function(error){if (error) throw error;})
 )
.then(connection.query(
  `
  CREATE TABLE IF NOT EXISTS comments (
      commentID varchar(36) NOT NULL DEFAULT (uuid()),
      postID varchar(36) NOT NULL,
      userID varchar(36) NOT NULL,
      name varchar(100) NOT NULL,
      comment varchar(1000) NOT NULL,
      time_created datetime DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (commentID),
      KEY fk_comment (userID),
      KEY fk_post (postID),
      CONSTRAINT fk_comment FOREIGN KEY (userID) REFERENCES users (userID) ON DELETE CASCADE,
      CONSTRAINT fk_post FOREIGN KEY (postID) REFERENCES posts (postID) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  `, function(error){if (error) throw error;
    else console.log("----comments----");})
)

.then(connection.query(
  `
  CREATE TABLE IF NOT EXISTS read_posts (
      userID varchar(36) DEFAULT NULL,
      postID varchar(36) DEFAULT NULL,
      UNIQUE KEY read_posts_userID_postID (userID, postID)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `, function(error){if (error) throw error;
    else console.log("----read_posts----");})
)

.then(connection.query(
      'show tables' , function(err, result, fields){
        console.log("'show tables' query")
        console.log("Number of tables: " + result.length + "\n" + fields[0].table)
        for (let c = 0; c < result.length; c++){ console.log(result[c].Tables_in_groupomania)}
        connection.end((err) => {err && console.log("Error closing connections to connection: " + err)}
        )
      })
)
