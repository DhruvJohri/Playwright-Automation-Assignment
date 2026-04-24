// utils/apiHelper.ts
import { APIRequestContext, expect } from '@playwright/test';

const BASE = 'https://automationexercise.com/api';

export class ApiHelper {
  constructor(private request: APIRequestContext) {}

  // API 1
  async getAllProducts() {
    const res = await this.request.get(`${BASE}/productsList`);
    const body = await res.json();
    return { status: res.status(), body };
  }

  // API 2
  async postToProductsList() {
    const res = await this.request.post(`${BASE}/productsList`);
    const body = await res.json();
    return { status: res.status(), body };
  }

  // API 3
  async getAllBrands() {
    const res = await this.request.get(`${BASE}/brandsList`);
    const body = await res.json();
    return { status: res.status(), body };
  }

  // API 4
  async putToBrandsList() {
    const res = await this.request.put(`${BASE}/brandsList`);
    const body = await res.json();
    return { status: res.status(), body };
  }

  // API 5
  async searchProduct(searchTerm: string) {
    const res = await this.request.post(`${BASE}/searchProduct`, {
      form: { search_product: searchTerm },
    });
    const body = await res.json();
    return { status: res.status(), body };
  }

  // API 6
  async searchProductNoParam() {
    const res = await this.request.post(`${BASE}/searchProduct`);
    const body = await res.json();
    return { status: res.status(), body };
  }

  // API 7
  async verifyLoginValid(email: string, password: string) {
    const res = await this.request.post(`${BASE}/verifyLogin`, {
      form: { email, password },
    });
    const body = await res.json();
    return { status: res.status(), body };
  }

  // API 8
  async verifyLoginNoEmail(password: string) {
    const res = await this.request.post(`${BASE}/verifyLogin`, {
      form: { password },
    });
    const body = await res.json();
    return { status: res.status(), body };
  }

  // API 9
  async deleteVerifyLogin() {
    const res = await this.request.delete(`${BASE}/verifyLogin`);
    const body = await res.json();
    return { status: res.status(), body };
  }

  // API 10
  async verifyLoginInvalid() {
    const res = await this.request.post(`${BASE}/verifyLogin`, {
      form: { email: 'invalid@fake.com', password: 'wrongpass' },
    });
    const body = await res.json();
    return { status: res.status(), body };
  }

  // API 11
  async createUser(data: Record<string, string>) {
    const res = await this.request.post(`${BASE}/createAccount`, { form: data });
    const body = await res.json();
    return { status: res.status(), body };
  }

  // API 12
  async deleteUser(email: string, password: string) {
    const res = await this.request.delete(`${BASE}/deleteAccount`, {
      form: { email, password },
    });
    const body = await res.json();
    return { status: res.status(), body };
  }

  // API 13
  async updateUser(data: Record<string, string>) {
    const res = await this.request.put(`${BASE}/updateAccount`, { form: data });
    const body = await res.json();
    return { status: res.status(), body };
  }

  // API 14
  async getUserByEmail(email: string) {
    let res;
    try {
      res = await this.request.get(`${BASE}/getUserDetailByEmail`, {
        params: { email },
      });
    } catch {
      res = await this.request.get(`${BASE}/getUserDetailByEmail`, {
        params: { email },
      });
    }
    const body = await res.json();
    return {
      status: res.status(),
      body: {
        ...body,
        data: body.data ?? body.user,
      },
    };
  }
}
