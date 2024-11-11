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
            console.log("STARTED")
            const response = await  graphqlServiceInstance.request(query)
            console.log("ENDED")
            console.log("MAINPRODUCT RESPONSE RAW: ", response)
            
            return response
        } catch (err) {
            console.log("MAINPRODUCT RESPONSE RAW ERROR: ",err)
            throw err
        }

    }
}

export default GetMainProductsService