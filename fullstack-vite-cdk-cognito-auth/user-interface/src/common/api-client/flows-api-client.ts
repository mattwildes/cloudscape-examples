import { get, put, del } from "aws-amplify/api";
import { Item } from "../types";
import { API_NAME } from "../constants";
import { ApiClientBase } from "./api-client-base";

export class FlowsApiClient extends ApiClientBase {
  async getFlows(): Promise<Item[]> {
    const headers = await this.getHeaders();
    const restOperation = get({
      apiName: API_NAME,
      path: "/flows",
      options: {
        headers,
      },
    });

    const response = await restOperation.response;
    const { data = [] } = (await response.body.json()) as any;

    return data;
  }

  async addFlow(item: Omit<Item, "itemId">): Promise<boolean> {
    const headers = await this.getHeaders();
    const restOperation = put({
      apiName: API_NAME,
      path: "/flows",
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

  async getFlow(id: string): Promise<Item> {
    const headers = await this.getHeaders();
    const restOperation = get({
      apiName: API_NAME,
      path: `/flows/${id}`,
      options: {
        headers,
      },
    });

    const response = await restOperation.response;
    const { data } = (await response.body.json()) as any;

    return data;
  }

  async deleteFlow(id: string): Promise<void> {
    const headers = await this.getHeaders();
    const restOperation = del({
      apiName: API_NAME,
      path: `/flows/${id}`,
      options: {
        headers,
      },
    });

    await restOperation.response;
  }
}
