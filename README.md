# wrap-gyazo
Gyazo API wrapper made in TypeScript.  
*For now, only upload feature.


## Installation
`
npm i wrap-gyazo
`

## Register an application with Gyazo.
+ [Gyazo Applications](https://gyazo.com/oauth/applications)

## Authorize (Optional)
*If you want to get an access token for each user.

0. Get client_id, secret_id and Callback URL in [Gyazo Applications](https://gyazo.com/oauth/applications).
1. Generate a link for approval.  
```typescript
import {GyazoAdmin} from 'wrap-gyazo';
const gyazoAdmin = new GyazoAdmin({
  clientId:"***************",
  redirectUri:"***************",
  clientSecret:"***************"
});
const authUrl = gyazoAdmin.makeAuthorizeURL();
/**
 * authUrl = {url:string,state:string}
 */
```

【Optional】 Please use the "state" parameter to prevent CSRF.  
*The "state" parameter is uuidv4.  

2. The user accesses the generated URL and approves the app.
    1. Get the "code" and "state" parameters from the callback URL.
    2. 【Optional】 Check the state parameter.  
    3. Get "access_token" from "code".
    ```typescript
    const accessToken =  await gyazoAdmin.getAccessToken(code);
    ```

## Upload
### Preparation
1. Get the user access token or the [application access token](https://gyazo.com/oauth/applications).
2. Load an image data.

### Upload to Gyazo
```typescript
//base64
const uploadRes = await gyazoAdmin.uploadBase64(accessToken,base64);
//buffer
const uploadRes = await gyazoAdmin.uploadBuffer(accessToken,imageData,"png")
```
*You can't upload from a browser, because of the CORS policy

## Others
### File/Blob->Base64 Conversion (Browser Only)
```typescript
import {readAsDataURL} from 'wrap-gyazo';

const base64 = await readAsDataURL(file);
```
### Thanks for the Reference
+ [Gyazo API Docs](https://gyazo.com/api/docs)
+ [gyazo-api](https://github.com/shokai/node-gyazo-api)

### Pull Request
If you want to add a feature, please submit a pull request.
