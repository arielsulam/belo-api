
const cryptojs = require('crypto-js');
const axios = require('axios');

enum METHOD { POST='POST', GET='GET', PUT='PUT', DELETE='DELETE'}

export const promisedOrders = {};
import { getOrderDetailsbyId } from "./repository";

const baseOkxUrl='https://www.okx.com';
let key = '8DEAB95B3CA6E82B08BA4CC36ECE9C60'


function sign(date, verbHttp, path, body, key){
    let sign = {
        date: date,
        key: key,
        body: JSON.stringify(body),
        verbHttp: verbHttp,
        path: path
    }
    return cryptojs.enc.Base64.stringify(cryptojs.HmacSHA256(
        sign.date + sign.verbHttp + sign.path + sign.body , sign.key));
}

function buildHeaders(isSigned, date,verbHttp,body,path){
    let headers={'Content-Type': 'application/json'}
    let signedHeaders = {
        'OK-ACCESS-KEY': 'ddede720-b4e0-4cf7-957d-b2ff02da8919',
        'OK-ACCESS-SIGN': sign(date, verbHttp, path, body, key),
        'OK-ACCESS-TIMESTAMP': date,
        'OK-ACCESS-PASSPHRASE': 'TheLift$2992',
    }
    return isSigned ? {...headers, ...signedHeaders} : {...headers};
}

function buildConfig(isSigned,verbHttp,body,path){
    let date =new Date().toISOString()
    return {
        method: verbHttp,
            url: baseOkxUrl+path,
        headers: buildHeaders(isSigned,date,verbHttp,body,path),
        data: body?body:null
    };
}

export async function getOrderBooks(body,instId, sz){
    
    const path=`/api/v5/market/books?instId=${instId}&sz=${sz}`;
    const isSigned=false;
    let config = buildConfig(isSigned,METHOD.GET,body,path);
    return await axios(config)
        .then(function (response) {

            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
}

export async function placeOrder(orderId){
    const path=`/api/v5/trade/order`; 
    const isSigned=true;
    const order= await getOrderDetailsbyId(orderId);
    order.timeStamp
    if (order && order.timestamp > Date.now()) {

        const body= {"instId":order.instid,"tdMode":"cash","clOrdId":"b15","side":order.side,"ordType":"limit","px":order.price,"sz":order.quantity};
        let config = buildConfig(isSigned,METHOD.POST,body,path);
    
    return await axios(config)
        .then(function (response) {
            const okxData = response.data;
            console.log(JSON.stringify(okxData,null,4));
            return {
                msg : okxData.data[0].sMsg,
                orderId : okxData.data[0].ordId,
            };
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    else { 
        return {error: "INVALID ORDER"};
    }
}

export async function getEstimateQuote(body){
    const path='/api/v5/asset/convert/estimate-quote';
    let isSigned = true;
    let config = buildConfig(isSigned,METHOD.POST,body,path)
    return await axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
}
