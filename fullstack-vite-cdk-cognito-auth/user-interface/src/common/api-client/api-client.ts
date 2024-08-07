import { ItemsApiClient } from "./items-api-client";
import { OutputsApiClient } from "./outputs-api-client";

export class ApiClient {
  private _itemsClient: ItemsApiClient | undefined;
  private _outputsClient: OutputsApiClient | undefined;

  public get items() {
    if (!this._itemsClient) {
      this._itemsClient = new ItemsApiClient();
    }

    return this._itemsClient;
  }

  public get outputs() {
    if (!this._outputsClient) {
      this._outputsClient = new OutputsApiClient();
    }

    return this._outputsClient;
  }
}
