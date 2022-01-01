import axios from "axios";
import * as base64 from 'urlsafe-base64'
import * as FormData from "form-data";
import { UserParams, GyazoUser } from "./user";
import { DEFAULT_POINT, UPLOAD_POINT } from "../api_point";
export interface AdminParams extends UserParams {
    clientSecret: string
}
export class GyazoAdmin extends GyazoUser {
    clientSecret: string
    constructor(baseParams: AdminParams) {
        super(baseParams);
        const { clientSecret } = baseParams;
        this.clientSecret = encodeURIComponent(clientSecret);
    }
    /**
     * 【POST】codeからアクセストークンを取得します。
     * @param code Gyazoから返されるcode
     */
    async getAccessToken(code: string) {
        const { clientId, redirectUri } = this.userParams;
        const result = await axios.post(`${DEFAULT_POINT}/oauth/token`, {
            "client_id": clientId,
            "client_secret": this.clientSecret,
            "redirect_uri": redirectUri,
            code: code,
            "grant_type": "authorization_code"
        });
        const accessToken: string = result.data.access_token;
        return accessToken;
    }
    /**
     * post処理(Promise)
     * @param uploadExtension 拡張子 png,jpg... アップロードしない場合は空文字
     * @param apiPath オリジン以降のパス 例 /api/upload
     * @param data 
     * @param accessToken 
     */
    private postWithBearer(uploadImageExtension: string, apiPath: string, data: any, accessToken: string) {
        let headers = {
            'Cache-Control': 'no-cache',
            'Authorization': 'Bearer ' + accessToken
        }
        if (uploadImageExtension != "") {
            let form = new FormData();
            Object.keys(data).forEach(key => {
                if (key == "imagedata") form.append(key, data[key], {
                    filename: "upload." + uploadImageExtension
                });
                else form.append(key, data[key]);
            });
            return axios.post(UPLOAD_POINT + apiPath, form, {
                headers: { ...form.getHeaders(), ...headers },
                timeout: 30000,
            });
        } else {
            return axios.post(DEFAULT_POINT + apiPath, data, {
                headers: headers,
                timeout: 30000,
            });
        }
    }
    /**
     * Base64形式の画像データをアップロードします。
     */
    async uploadBase64(accessToken: string, base64Data: string) {
        let b64: string[] = base64Data.split(',');
        let data = await this.uploadBuffer(accessToken,base64.decode(b64[1]),b64[0].split('/')[1],);
        return data;
    }
    /**
     * Buffer形式の画像をアップロードします。
     */
    async uploadBuffer(accessToken: string, imageData: Buffer,imageExtension: string){
        let result = await this.postWithBearer(imageExtension, "/api/upload", {
            "imagedata": imageData,
            "metadata_is_public": "false"
        }, accessToken);
        let data: UploadResponse = result.data;
        return data;
    }
}
interface UploadResponse {
    "image_id": string,
    "permalink_url": string,
    "thumb_url": string,
    "url": string,
    "type": string
}