import { gql } from "graphql-request";
import graphqlServiceInstance from "../services/GraphQLService";

class GetQuickShop {
    static async getQuickShop(id) {
        const query = gql`
        query GetPDP($id: String!) {
          PDP(id: $id) {
            attributes {
              name
              type
              items {
                display_value
                value
              }
            }
            price {
              amount
              currency_label
              currency_symbol
            }
          }
        }
      `;

    try {
        const variables = { id }
        const response = await  graphqlServiceInstance.request(query,variables)
        console.log("RESPNSIA AGI ESS", response)
        return response
    } catch (err) {
        console.log("MAINPRODUCT RESPONSE RAW ERROR: ",err)
        throw err
    }
    }
}

export default GetQuickShop