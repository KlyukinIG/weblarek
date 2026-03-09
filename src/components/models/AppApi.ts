// src/components/api/AppApi.ts

import { Api} from '../base/Api';
import { IProduct, postRequestIOrder, IOrderResponse, getResponseIProduct } from '../../types';

export class AppApi {
    private api: Api;

    constructor(api: Api) {
        this.api = api;
    }

    async getProducts(): Promise<IProduct[]> {
        const response = await this.api.get<getResponseIProduct>('/product/');
        return response.items;
    }

    async postOrder(order: postRequestIOrder): Promise<IOrderResponse> {
        const response = await this.api.post<IOrderResponse>('/order', order);
        return response;
    }
}