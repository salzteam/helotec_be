# HALOTEC Medical

[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
<br>


## 𓆙 Table of Contents

- [Table of Contents](#𓆙-Table-of-Contents)
- [Requirement](#𓆙-Requirement)
- [Installation](#)
  - [Windows](#𓆙-Windows-Installation)
  - [Linux](#𓆙_Linux_Installation)
- [How to run](#𓆙-How-to-run)
- [Route](#𓆙-Documentation-Postman)
- [Related Project](#𓆙-Related-Project)
- [Contributor](#𓆙-Contributors)

## 𓆙 Requirement

This repo require a [NodeJS](https://nodejs.org/)

[ENV](#ENV) File

## 𓆙 Windows Installation

First of all, you need to install [Git](https://git-scm.com/download/win) & [NodeJS](https://nodejs.org/). Then open your git bash, and follow this:<br>

```sh
$ git clone https://github.com/salzteam/helotec_be
$ cd helotec_be
```

## 𓆙 Linux Installation

```sh
$ apt-get update
$ apt-get install git-all
$ apt-get install nodejs-current
$ git clone https://github.com/salzteam/helotec_be
$ cd helotec_be
```

## 𓆙 How to run

1. Install file using [WINDOWS](#Windows-Installation) OR [LINUX](Linux-Installation)

2. Add .env file at root folder, and add following

```sh
DB_HOST_DEV = ''
DB_USER_DEV = ''
DB_PASS_DEV = ''
DB_NAME_DEV = ''
DB_PORT = ''
```

3. Starting application

```sh
$ npm run dev
```

## 𓆙 Route

| Endpoint                     |      Method      | Info         | Remark                                |
| ---------------------------- | :--------------: | :----------- | :------------------------------------ |
| /data/addData                    | `POST`  | Data         | Add Data                |
| /data/search                   |      `GET`       | Data         | Get Search                        |                |
| /data/dashboard            |      `GET`       | Data | Get Dashboard |          |


## 𓆙 Related-Project
- [FRONT-END](https://github.com/salzteam/helotec-app)

## 𓆙 Contributor
  <table>
    <tr>
      <td >
        <a href="https://github.com/salzteam">
          <img width="100" src="https://media.discordapp.net/attachments/1042328276623966313/1044211472001138799/A5EA7BEF-0326-4ED0-A439-A64A680A774B.jpg?width=250&height=250" alt=""><br/>
          <center><sub><b>Akshal </b></sub></center>
        </a>
        </td>
    </tr>
  </table>
<h1 align="center"> THANK FOR YOUR ATTENTION </h1>
