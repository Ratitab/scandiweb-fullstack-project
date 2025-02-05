import {GraphQLClient} from 'graphql-request'
import { LOCAL_GRAPHQL_URL } from '../env'

class GraphQLService {
    client

    constructor() {
        this.client = new GraphQLClient(LOCAL_GRAPHQL_URL)
    }

    async request(query, variables = {}) {
        try {
            const data = await this.client.request(query, variables)
            return data
        } catch (error) {
            throw new Error("Graphql request failed", error)
        }
    }
}

const graphqlServiceInstance = new GraphQLService()
export default graphqlServiceInstance