import{pool} from "../controller/exchangeController";

export const insertOrderData = async (quantity, price, timestamp, instId, side) => {
    let response= await pool.query
    ('INSERT INTO  "orders" ("quantity", "price", "timestamp", "instid", "side")'+
    'VALUES ($1, $2, $3, $4, $5) RETURNING id', [quantity, price, timestamp, instId, side])
    .then(res => res.rows[0])
        .catch(e => console.error(e.stack));
     return response;
}

// INSERT INTO  "orders" ("quantity", "price", "timestamp") VALUES (45, 41545 , 45454544);

export const getOrderDetailsbyId = async (orderId) =>{
    let response= await pool.query('SELECT * FROM orders where id='+orderId)
    .then(res => res.rows[0])
        .catch(e => console.error(e.stack));
     return response;
}