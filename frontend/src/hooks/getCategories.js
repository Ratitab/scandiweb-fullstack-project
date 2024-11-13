import GraphQLService from "../services/GraphQLService"
import { gql } from "graphql-request"

class CategoryService {
    static async getCategories() {
        const query = gql`
        query {
            categories {
                name
            }
        }
        `

        try {
            const response = await GraphQLService.request(query)
            return response.categories
        } catch (err ) {
            console.log("GRAPHQL ERROR GETCHING",err)
            throw err
        }
    }
}

export default CategoryService