import { Collection, MongoClient, ObjectId } from 'mongodb'

export const MongoHelper = {
  client: MongoClient,
  uri: null,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },

  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client) await this.connect(this.uri)
    return this.client.db().collection(name)
  },

  map (id: ObjectId, collection: any): any {
    return { id: String(id), ...collection }
  }
}
