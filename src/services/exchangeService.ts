import { response } from "express";
import {getOrderBooks, placeOrder} from "./okxService";
import {insertOrderData} from "./repository";
import {expiredTimeWindow} from "./../controller/exchangeController";

export enum SIDE { BUY = "buy", SELL = "sell"}

const size= 1000;
export async function calculateOptimalPrice(instId, side, volume) {
    let coin = instId.split("-")[0];
    let stableCoin = instId.split("-")[1];

    let requiredVolume = volume;  //Quantity of the coin to buy

    let orderBooks = await getOrderBooks(null, instId, size);
    let orders = side === SIDE.BUY ? orderBooks.data["0"].asks : orderBooks.data["0"].bids;

    let auxVolume = requiredVolume;
    let avgPrice: number;

    let sum = 0;
    while (auxVolume > 0) {
        let counter = 0;
        let element = orders[counter];
        let currentOrder = {
            price: element[0],
            volume: element[1],
            quantity: element[3]
        }

        let orderVolume = currentOrder.price * currentOrder.volume * currentOrder.quantity;
        if (auxVolume >= orderVolume) {
            auxVolume = auxVolume - orderVolume;
            sum = sum + orderVolume * currentOrder.price
        } else {
            sum = sum + auxVolume * currentOrder.price;
            break;
        }
        counter++;
    }
    avgPrice = sum / requiredVolume

    const okexTakerFee = 0.0008
    const okexMakerFee = 0.001
    const beloFee = 0.001
    const spread = 0.001
    let finalPrice= avgPrice; 


    if (side === 'buy'){
        finalPrice = finalPrice * (1+(okexTakerFee+beloFee)) * (1-spread);
    }
    else{
        finalPrice = finalPrice * (1+(okexTakerFee+beloFee)) * (1+spread);   
    }
    

    let result = {
        id: null,
        quantity: requiredVolume,
        priceNoFeeNoSpread: avgPrice, 
        price: finalPrice,
        timeStamp: Date.now() + expiredTimeWindow
    }

    const insertResult = await insertOrderData(result.quantity, result.price, result.timeStamp, instId, side); 
      result.id = insertResult["id"];
    return result;
}

export async function placingOrder(orderId){
    return placeOrder(orderId)
}