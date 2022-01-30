# Quotes

Small web app with simple user management which can store quotes.

Configuration: ``./src/settings.js``

## Functionality

* User can sign up
* User can authenticate using JWT
* User can create quotes
* User can manage their quotes
* Quotes can store an author
* Quotes can be set public
* Non authenticated user can access public quotes

## API 

### User

URL  | Method | Authenticated | Description
--- | --- | --- | ---
``/users`` | POST | false | Create new user
``/users/login`` | POST | false | Login with credentials, returns an api key
``/users/logout`` | GET | true | Remove API key which was used for authentication
``/users/logout/all`` | POST | true | Remove all API keys from the authenticated user
``/users/me`` | GET | true | Show authenticated profile
``/users/me`` | PATCH | true | Update authenticated profile
``/users/me`` | DELETE | true | Delete authenticated profile and all linked quotes

### Quotes
URL | Method | Authenticated | Description
--- | --- | --- | ---
``/quotes/public`` | GET | false | Get all public quotes
``/quotes/public/random`` | GET | false | Get a random public quote
``/quotes`` | GET | true | Get all quotes from the authenticated user
``/quotes`` | POST | true | Create a new quote
``/quotes/<id:hash>`` | PATCH | true | Update an existing quote 
``/quotes/<id:hash>`` | DELETE | true | Delete a quote
