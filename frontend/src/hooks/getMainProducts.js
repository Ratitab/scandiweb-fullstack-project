import { gql } from "graphql-request";
import graphqlServiceInstance from "../services/GraphQLService";

class GetMainProductsService {
    static async getMainProducts() {
        const query = gql`
        query {
            productDetails {
                id
                name
                in_stock
                category_name
                image_gallery
                price
                currency_symbol
            }
        }
        `

        try {
            const response = await  graphqlServiceInstance.request(query)
            
            return response
        } catch (err) {
            console.log("MAINPRODUCT RESPONSE RAW ERROR: ",err)
            throw err
        }

    }
}

export default GetMainProductsService