# Quick-credit

[![Coverage Status](https://coveralls.io/repos/github/victor-shagor/Quick-credit/badge.svg?branch=ft-signup-endpoints-165787161)](https://coveralls.io/github/victor-shagor/Quick-credit?branch=ft-signup-endpoints-165787161)
[![Build Status](https://travis-ci.org/victor-shagor/Quick-credit.svg?branch=develop)](https://travis-ci.org/victor-shagor/Quick-credit)
[![Test Coverage](https://api.codeclimate.com/v1/badges/ac796788812d95bb80a1/test_coverage)](https://codeclimate.com/github/victor-shagor/Quick-credit/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/ac796788812d95bb80a1/maintainability)](https://codeclimate.com/github/victor-shagor/Quick-credit/maintainability)


## Project Overview
Quick Credit is an application that enables a registered user apply for a loan

## Features
---
### Users
- Signup 
- Login
- View loan transactions

### Admin
- View all users
- Verify a user
- Approve or reject a loan
- View loan Applications
- View current loan
- View repaid loans
- Post a payment transaction

## Optional Feature
- user can reset password

### Pivotal Tracker
Project is built with the Project Management Tool, Pivotal [Pivotal tracker stories](https://www.pivotaltracker.com/n/projects/2328144)

### Template
Template is hosted at https://victor-shagor.github.io/Quick-credit/UI/


## Technologies Used
- [NodeJS](https://nodejs.org/en/download/)
- [ExpressJS](https://expressjs.com/)


## Getting Started
---

### Installing/Run locally
- Make sure you have `nodejs`, `postgres` installed.
- Clone or fork repo :man_shrugging:

  ```bash
    - git clone https://github.com/victor-shagor/Quick-credit.git
    - cd Quick-Credit
    - npm install
    - Create/configure `.env` environment with your credentials
    - Run `npm run dev-start` to start the server 
  ```

### Testing
- To test or consume the API locally, you can make use of [*Postman*](https://www.getpostman.com) to simulate a front-end client.
- You can also test by running `npm test`.


## HTTP Requests
All API requests are made by sending a secure HTTPS request using one of the following methods, depending on the action being taken:

- `POST` Create a data
- `PATCH` Update a data
- `GET` Get a data or datas
- `DELETE` Delete a data


### HTTP Response Codes
Each response will be returned with one of the following HTTP status codes:

- `200` `OK` The request was successful
- `200` `Created` The request was successful created
- `400` `Bad Request` There was a problem with the request (security, malformed)
- `401` `Unauthorized` The supplied API credentials are invalid
- `403` `Forbidden` The credentials provided do not have permissions to access the requested resource

