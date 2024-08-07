import { get, put, del } from "aws-amplify/api";
import { Item } from "../types";
import { API_NAME } from "../constants";
import { ApiClientBase } from "./api-client-base";

export class OutputsApiClient extends ApiClientBase {
  async getOutputs(): Promise<Item[]> {
    const headers = await this.getHeaders();
    const restOperation = get({
      apiName: API_NAME,
      path: "/outputs",
      options: {
        headers,
      },
    });

    const response = await restOperation.response;
    const { data = [] } = (await response.body.json()) as any;

    return data;
  }

  async addOutput(item: Omit<Item, "itemId">): Promise<boolean> {
    const headers = await this.getHeaders();
    const restOperation = put({
      apiName: API_NAME,
      path: "/outputs",
      options: {
        headers,
        body: {
          ...item,
        },
      },
    });

    const response = await restOperation.response;
    console.log(response);
    const data = (await response.body.json()) as any;

    return data.ok;
  }

  async getOutput(id: string): Promise<Item> {
    const headers = await this.getHeaders();
    const restOperation = get({
      apiName: API_NAME,
      path: `/outputs/${id}`,
      options: {
        headers,
      },
    });

    const response = await restOperation.response;
    const { data } = (await response.body.json()) as any;

    return data;
  }

  async deleteOutput(id: string): Promise<void> {
    const headers = await this.getHeaders();
    const restOperation = del({
      apiName: API_NAME,
      path: `/outputs/${id}`,
      options: {
        headers,
      },
    });

    await restOperation.response;
  }
}
