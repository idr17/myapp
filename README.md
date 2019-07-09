# myApp
### Simple account and banking case API Service with Express JS Framework

There is 3 entity in this case; 
* userAccount 
* Transactions
* Balances history

1. Firstly create an account to [http://localhost:3000/api/user](http://localhost:3000/api/user) 
```json
example payload: {
	"email": "your@email.com",
	"password": "yourpassword"
}
```

2. Login with your account to [http://localhost:3000/api/user/login](http://localhost:3000/api/user/login)
```json
example payload: {
	"email": "your@email.com",
	"password": "yourpassword"
}
```

3. you can create transactions to [http://localhost:3000/api/transaction](http://localhost:3000/api/transaction)
```json
example CR payload: {
	"type": "DB",
	"amount": 40000,
	"to": "5d0bd05d1ea65e2a454753f3"
}
```

```json
example DB payload: {
	"type": "DB",
	"amount": 10000,
	"to": "5d0bd05d1ea65e2a454753f3"
}
```

```json
example TRANSFER payload: {
	"type": "TRANSFER",
	"amount": 50000,
  "from": "5d0a43ae5140c3185e9ba01a",
	"to": "5d0bd05d1ea65e2a454753f3"
}
```

> NOTE: to create a transaction you must be logged in
