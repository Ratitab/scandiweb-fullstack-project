import { gql } from "graphql-request";
import graphqlServiceInstance from "./GraphQLService";

class GetPDPService {
    static async getPDP(id) {
        const query = gql`
        query GetPDP($id: String!) {
          PDP(id: $id) {
            id
            name
            in_stock
            description
            brand
            category_name
            image_gallery
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
        
        return response
    } catch (err) {
        throw err
    }
    }
}

export default GetPDPService