const jwt = require('jsonwebtoken');

/**
 */
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6InphbWEiLCJlbWFpbCI6InphbWFtYkBnbWFpbC5jb20ifSwiaWF0IjoxNTUyNDczNTA0LCJleHAiOjE1NTI1NTk5MDR9.mC7BkT6yt6AJ31rYHO7Wgp_wNqosY1PO9s1w_tfaHTw';

console.log("Encoded Token: \n"+token+"\n")


jwt.verify(token, 'secretkey', function(err, decoded) {
  console.log("Decoded Token:")
  console.log(decoded) 
    console.log("\n")
});