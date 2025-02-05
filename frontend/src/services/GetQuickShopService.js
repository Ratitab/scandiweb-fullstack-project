import { gql } from "graphql-request";
import graphqlServiceInstance from "./GraphQLService";

class GetQuickShopService {
  static async getQuickShop(id) {
    const query = gql`
      query FetchAttributes($id: String!) {
        attributes(id: $id) {
          name
          type
          items {
            display_value
            value
          }
        }
      }
    `;

    try {
      const variables = { id };
      const response = await graphqlServiceInstance.request(query, variables);
      return response;
    } catch (err) {
      throw err;
    }
  }
}

export default GetQuickShopService;
