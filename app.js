const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const NodeCache = require( "node-cache" );
const EthCrypto = require('eth-crypto');

const cache = new NodeCache();
const app = express();
app.use(express.json());      
app.use(express.urlencoded());

app.get('/auth', (req, res) => {
    let nonce = crypto.randomBytes(16).toString('base64');
    res.json({
      nonce: nonce
    });
    cache.set(nonce, nonce)
    console.log('GET /auth: nonce: '+nonce)
});

app.post('/auth', (req, res) => {  
    console.log("nonce: "+req.body.nonce)
    console.log("signature: "+req.body.signature)
    
    //List of signatures
    //HBN Signer, cadmin1, fadmin1, dadmin1    

    cache.get( req.body.nonce, function( err, value ){
        if( !err ){
          if(value == undefined){
            console.log('nonce not found in cache, so reject the request for JWT token')
            res.sendStatus(403);
          }else{
            console.log( "Nonce from Cahce: " + value );
            let accounts = [];

            for (s in req.body.signatures){
                let signer = EthCrypto.recover(
                    req.body.signatures[s],
                    EthCrypto.hash.keccak256(req.body.nonce) 
                );
                console.log('signer: '+signer)
                accounts.push(signer)
            }
    
        
            const payload = {
                "iss": "https://ht.components.healthmosphere.network/auth",
                "sub": [accounts, "*"],
                "aud": ["/questionnaire"]
           }
            
           jwt.sign({payload}, 'secretkey', { expiresIn: '1d' }, (err, token) => {
                res.json({
                  token
                });
            });
          }
        }
      });    
});

app.post('/questionnaire', verifyToken, (req, res) => {  
    console.log('/questionnaire')
    res.json({
        message: "questionnaire created"
      });
});


// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;

    console.log('verifyToken(): bearerToken: '+bearerToken)

    jwt.verify(bearerToken, 'secretkey', function(err, decoded) {
            console.log("Decoded Token:")
            console.log(JSON.stringify(decoded))
            console.log("\n")

            console.log('Perform authorization check')

            next();
      });
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}


app.listen(5000, () => console.log('Server started on port 5000'));
