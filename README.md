# IG抽起來

[![Framework](https://img.shields.io/badge/Framework-Express-aliceblue.svg)](https://www.npmjs.com/package/express)
[![ORM](https://img.shields.io/badge/ORM-Sequelize-steelblue.svg)](https://www.npmjs.com/package/sequelize)
[![Database](https://img.shields.io/badge/Database-MySQL-lightblue.svg)](https://www.npmjs.com/package/mysql)

IG抽起來，是一個 Instagram 留言抽獎的網頁工具，透過 Facebook 認證後，以 Instagram Graph API 取得貼文留言名單，並且使用者能夠依照需求來決定抽獎的條件與獎項。

主要使用技術 Node.js + Express + Express-handlebars + Passport + Sequelize + Axios + Sortable + Cryptr + Bootstrap + Font-awesome

</br>

## 頁面呈現

大螢幕與小螢幕首頁顯示

<p float="left"><img src="https://github.com/z88243310/expense_tracker/blob/master/public/img/home-pc.png" width="49%">
<img src="https://github.com/z88243310/expense_tracker/blob/master/public/img/home-phone.png" width="49%"></p>

授權與選取貼文

<p float="left">
<img src="https://github.com/z88243310/expense_tracker/blob/master/public/img/login-flow.gif" width="49%">
<img src="https://github.com/z88243310/expense_tracker/blob/master/public/img/register-flow.gif" width="49%">
</p>

條件設定與獎項設定

<p float="left">
<img src="https://github.com/z88243310/expense_tracker/blob/master/public/img/new-flow.gif" width="49%">
<img src="https://github.com/z88243310/expense_tracker/blob/master/public/img/edit-flow.gif" width="49%">
</p>

抽獎頁面

<p float="left">
<img src="https://github.com/z88243310/expense_tracker/blob/master/public/img/delete-flow.gif" width="49%">
<img src="https://github.com/z88243310/expense_tracker/blob/master/public/img/keyword-flow.gif" width="49%">
</p>

</br>

## 功能描述

登入授權

- Facebook 第三方登入

貼文相關

- IG 商業帳號貼文選擇
- IG 留言擷取
- 留言標記擷取

抽獎 - 條件設定

- 重複留言個數
- 標記人數
- 包含關鍵字
- 截止時間

抽獎 - 獎項設定

- 獎項增刪功能
- 獎項拖曳排序
- 順序/反序/隨機抽獎

使用者體驗

- 彈出式提示訊息
- Loading 動畫

</br>

## 環境建置需求

- [Node.js 14.16.0](https://nodejs.org/dist/v14.16.0/)
- Terminal | CMD | [Git Bash](https://gitforwindows.org/)
- [MySQL Community Server & Workbench 8.0.15](https://www.mysql.com/products/workbench/)
- [Facebook developer app](https://developers.facebook.com/apps)
- [Instagram business account](https://www.facebook.com/business/help/502981923235522)
- [ngrok](https://ngrok.com/download) ( 非必要 )

</br>

## 安裝與執行步驟

### **一、建立專案**

1.打開終端機 cd 到指定路徑 ( 以 windows 桌面 為例 )

```text
cd C:\Users\'使用者名稱'\Desktop
```

2.下載 drawup 專案到本地電腦上

```text
git clone https://github.com/z88243310/drawup.git
```

3.進入 drawup 路徑

```text
cd drawup
```

4.在 drawup 路徑中，依照 package-lock.json 安裝 Express、Express-handlebars 與其他必要套件

```text
npm install
```

5.在 drawup 路徑中，建立 .env 檔，設定環境變數

- CRYPTR_SECRET 用於加密網址中的貼文 ID

```text
PORT=3000
SESSION_SECRET="輸入任意加密字串"
CRYPTR_SECRET="輸入任意加密字串"
```

</br>

### **二、建立 Facebook Developer**

#### 方法一、本地測試使用

1. 建立 [Facebook developer app](https://developers.facebook.com/docs/development/create-an-app) 後，點選 developer app 左上方，再次建立測試應用程式
2. 於 .env 加入環境變數

```text
FACEBOOK_ID="輸入 facebook test app ID"
FACEBOOK_SECRET="輸入 facebook test app SECRET"
FACEBOOK_CALLBACK="http://localhost:3000/auth/facebook/callback"
```

#### 方法二、部屬 heroku，或以外網進入 localhost 測試時使用

1. 建立 [Facebook developer app](https://developers.facebook.com/docs/development/create-an-app) 取得 ID 和 SECRET
2. 使用 [ngrok](https://ngrok.com/download) 取得 https 本地外網網址
3. 於 .env 加入環境變數

```text
FACEBOOK_ID="輸入 facebook app ID"
FACEBOOK_SECRET="輸入 facebook app SECRET"
FACEBOOK_CALLBACK="https 本地外網網址/auth/facebook/callback"
```

4. 將 <FACEBOOK_CALLBACK> 網址填入 Facebook developer app 設定裡的 <有效的 OAuth 重新導向 URI>

```text
"https 本地外網網址/auth/facebook/callback"
```

5. 在 Facebook developer app <權限與功能> 中，開啟 <public_profile> 權限

</br>

### **三、設定 MySQL Workbench**

1.於 Workbench 中，建立 [MySQL Connection](https://dev.mysql.com/doc/workbench/en/wb-mysql-connections-new.html)

2.調整專案中 config/config.json 設定

- 其中 username 與 password 依照 workbench 設定

```json
{
  "development": {
    "username": "root",
    "password": "password",
    "database": "drawup",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
  ...
}
```

3.使用 Git Bash 在本專案路徑下，輸入以下指令來`建立資料庫`
```text
npx sequelize db:create
```

</br>

### **四、設定 Facebook & Instagram**

1.[建立 Instagram business account](https://www.facebook.com/business/help/502981923235522)

2.[Facebook 粉絲頁連結 Instagram 商業帳號](https://www.facebook.com/business/help/898752960195806)

</br>

### **五、啟動專案**

1.執行專案 ( 伺服器啟動後會顯示 `App is listening on port 3000!` )

```text
npm run start
```

2.開啟瀏覽器輸入網址 <http://localhost:3000>

3.若要終止伺服器，請按以下按鍵 ( 以 windows 為例 )，即可直接`終止 Server 運作`。

```text
按下2次 [ Ctrl + C ]
```

</br>

更新時間 : 2022.05.18
