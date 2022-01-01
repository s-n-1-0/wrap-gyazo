import { v4 as uuidv4 } from "uuid"
import { DEFAULT_POINT } from "../api_point";
export interface UserParams {
    clientId: string
    redirectUri: string
}

export class GyazoUser {
    userParams: UserParams;
    constructor(baseParams: UserParams) {
        const { clientId, redirectUri } = baseParams;
        this.userParams = {
            clientId: encodeURIComponent(clientId),
            redirectUri: encodeURI(redirectUri),
        }
    }
    private getIdURIQuery() {
        return `client_id=${this.userParams.clientId}&redirect_uri=${this.userParams.redirectUri}`;
    }
    /**
     * ユーザー認証用リンクを生成
     * 【GET】ユーザー情報へのアクセスをリクエストするためのURLを生成します。
     */
    makeAuthorizeURL() {
        const uuid: string = uuidv4();
        return {
            url: `${DEFAULT_POINT}/oauth/authorize?${this.getIdURIQuery()}&response_type=code&state=${uuid}`,
            /** stateパラメータ(uuidv4) */
            state: uuid
        }
    }
}