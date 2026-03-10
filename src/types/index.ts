export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export type TPayment = "online" | "cash";

export type TValidationErrors = {
  payment?: string;
  address?: string;
  email?: string;
  phone?: string;
};

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface GetResponseIProduct {
  total: number;
  items: IProduct[];
}

export interface PostRequestIOrder extends IBuyer {
  id: string;
  items: string[];
}

export interface IOrderResponse {
  id: string;
  total: number;
}

export interface IApi {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(
    uri: string,
    data: object,
    method?: "POST" | "PUT" | "DELETE",
  ): Promise<T>;
}
