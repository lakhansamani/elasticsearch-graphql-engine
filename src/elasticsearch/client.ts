import { Client } from '@elastic/elasticsearch';

export class ESClient {
  private static instance: Client;

  public static getInstance(): Client {
    if (ESClient.instance) {
      return ESClient.instance;
    }
    ESClient.instance = new Client({
      node: process.env.ELASTICSEARCH_URL,
      maxRetries: 5,
      requestTimeout: 60000,
      sniffOnStart: false,
    });

    return ESClient.instance;
  }
}
