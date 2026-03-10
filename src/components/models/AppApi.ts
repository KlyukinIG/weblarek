// src/components/api/AppApi.ts

import { IProduct, PostRequestIOrder, IOrderResponse, GetResponseIProduct, IApi } from '../../types/index';

export class AppApi {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    async getProducts(): Promise<IProduct[]> {
        const response = await this.api.get<GetResponseIProduct>('/product/');
        return response.items;
    }

    async postOrder(order: PostRequestIOrder): Promise<IOrderResponse> {
        const response = await this.api.post<IOrderResponse>('/order', order);
        return response;
    }
}