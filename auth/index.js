const jwt=require('jsonwebtoken');
const config = require('../config');
const error=require('../utils/error');
const secret=config.jwt.secret;
function sign(data){
    return jwt.sign({data},secret);
}

function verify(token){
    return jwt.verify(token,secret);
}
const check={
    own:function(req,owner){
        const decoded=decodeHeader(req);
        // console.log({decoded});
        

        //COMPROBAR SI ES O NO PROPIO

        if(decoded.id!==owner){
            throw error('No estas autorizado para realizar la acción',401);
            
        // throw new Error('');
        }
    },
    logged:function (req){
        const decoded=decodeHeader(req);
    }
}

function getToken(auth){
    //Bearer token
    if(!auth){
        // throw new Error('No viene token');
        throw error('No viene token',401);
    }

    if(auth.indexOf('Bearer')===-1){
        // throw new Error('Formato invalido');
        throw error('Formato invalido',401);
    }
    let token=auth.replace('Bearer ','');

    return token;
}



function decodeHeader(req){
    const authorization=req.headers.authorization || '';
    const token=getToken(authorization);
    const decoded=verify(token);

    req.user=decoded;

    return decoded;
}

module.exports={
    sign,
    check
}