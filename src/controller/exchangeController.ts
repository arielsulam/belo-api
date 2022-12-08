import express, { response } from 'express';
import {calculateOptimalPrice, placingOrder, SIDE} from "../services/exchangeService";
import {promisedOrders} from "../services/okxService";
import { placeOrder } from '../services/okxService';
export {pool};

const app = express();
const port = 3000;

const Pool = require('pg').Pool;
  
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'beloapi',
    password: 'newpassword',
    dialect: 'postgres',
    port: 5432
});

export const expiredTimeWindow = 10 * 60 * 1000;
app.use(express.json())

app.get('/optimal-price', (req, res) => {
    let side = req.query["side"] === 'BUY' ? SIDE.BUY : SIDE.SELL;
    calculateOptimalPrice(
        req.query["instId"],
        side,
        req.query["volume"]
    ).then(result => res.json(result));
});

app.post('/place-order', (req, res) => {
        placingOrder(req.body["orderId"])
        .then(response =>{
            let result= response.data? response.data:response 
            res.json((result))
        });
});

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);

});
