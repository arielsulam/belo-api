## Challenge
### Consigna

Teniendo en cuenta los **order books** de Okex, implementar un servicio que:

- Se autentique en Okex
- Estime y ejecute un swap (SPOT) óptimo por volumen de los siguientes pares:
  - USDT ↔ ETH
  - USDT ↔ BTC
  - USDC ↔ AAVE
- Un endpoint para pedir estimación de precio dado un volumen y un par, con una expiración para el precio prometido
- Un endpoint para ejecutar el swap dada la estimación prometida
- Manejos de fees y spread parametrizable

### Requerimientos

- Typescript o Rust
- API Rest o Graphql
- SQL Database, preferentemente postgres (usen el ORM/query builder que más les guste)
- Integration tests


## Belo Trade API

### Requerimientos e Instalacion
    Instalar Node version v18.12.1 y npm version 9.1.2

### Run

Para ejecutar el servicio

    npm install dependencies
    npm start

### Endpoint 1 - Optimal Price  - GET 
'/optimal-price'

example CURL optimal-price?instId=BTC-USDT&side=BUY&volume=1

Request Params

    instID, volume, side.

### Endpoint 2 - Place Order  - POST 
'/place-order'

Example  
    curl --location --request POST "http://localhost:3000/place-order" --header "Content-Type: application/json" --data-raw "{
    \"orderId\":99
}"

Request Body

    'orderId'


### Integration tests

Los integration tests de ambos endpoins se corren en Postman WEB. 

Se debe importar el .json `'Belo API.postman_collection'` en Postman mediante un boton de `IMPORT` y correrlos desde `Run Collection` > `Run Belo API`.



