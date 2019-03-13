const request = require('request')
const EthCrypto = require('eth-crypto');

const accounts = [];
const hbn = EthCrypto.createIdentity();
const fadmin = EthCrypto.createIdentity();
const dadmin = EthCrypto.createIdentity();


accounts[0] = hbn;
accounts[1] = fadmin;
accounts[2] = dadmin;

console.log('--------------');
console.log('hbn: ' + JSON.stringify(hbn))
console.log('--------------');
console.log('fadmin: ' + JSON.stringify(fadmin))
console.log('--------------');
console.log('dadmin: ' + JSON.stringify(dadmin))
console.log('--------------');

request.get('http://localhost:5000/auth', (error, res, body) => {
    if (error) {
        console.error(error)
        return
    }
    console.log(JSON.parse(body));
    let nonce = JSON.parse(body).nonce
    console.log('nonce: ' + nonce)

    const messageHash = EthCrypto.hash.keccak256(nonce);

    request.post('http://localhost:5000/auth', {
        json: {
            nonce: nonce,
            signatures: [EthCrypto.sign(hbn.privateKey, messageHash), 
                        EthCrypto.sign(fadmin.privateKey, messageHash),
                        EthCrypto.sign(dadmin.privateKey, messageHash)]    
        }
    }, (error, res, body) => {
        if (error) {
            console.error(error)
            return
        }
        console.log('JWT Token: ' + JSON.stringify(body));
        let buff = new Buffer(body.token, 'base64');
        let decodedToken = buff.toString('ascii');

        console.log('Decoded Token: ' + decodedToken);
        console.log('-----------');
        console.log('Calling protected API:')

        request.post('http://localhost:5000/questionnaire', {
            headers: {
                'Authorization': 'Bearer ' + body.token,
                'Content-Type': 'application/json'
            },
            json: {
                "id": 100,
                action: "update"
            }
        }, (error, res, body) => {
            if (error) {
                console.error(error)
                return
            }
            console.log("Response:" + body);
        })

    })
})