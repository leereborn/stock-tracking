# Stock trading simulation

Built on Express.js and Mongodb. No UI is provided. Communicate with JSON over http API.

## Tested environment

- Node 14.16.0
- Ubuntu 18.04
- MongoDB 4.4.4

## Instructions

npm start

## APIs

Support for users to register/login/logout.

- POST /users/register, req.body: username&password
- POST /users/login, req.body: username&password
- GET /users/logout

Users are able to add balance to their wallet.

- PUT /users/addbalance, req.body: amount

Users are able to buy/sell shares

- PUT /users/buy, req.body: stockname&amount
- PUT /users/sell, req.body: stockname&amount

Users are able to subscribe to an endpoint that should provide live rates.

- POST /users/query req.body:stockname

Users have the ability to see their portfolio

- GET /users/portfolio

## APIs for the testing purpose

Initialize the stock collection by three hard-coded stocks (apple,google and amazon)

- GET /stocks/init

Add or update a stock

- POST /stocks/addorupdate

Get all available stocks

- GET /stocks/all
