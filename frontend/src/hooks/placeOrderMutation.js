import { gql } from "graphql-request";
import graphqlServiceInstance from "../services/GraphQLService";

class PlaceOrder {
  static async placeOrder(variables) {
    // console.log("OrderPlaces succesfully", orderItems)
    const mutation = gql`
      mutation PlaceOrder($orderItems: [OrderItemInput!]!) {
        placeOrder(orderItems: $orderItems) {
          orderId
          status
          message
        }
      }
    `;


    // const variables = {orderItems}

    try {
        const response = await graphqlServiceInstance.request(mutation, variables)
        return response.placeOrder
    } catch (err) {
        console.log(err, "failed to olace oreder")
        throw new Error("FAILLDEEE")
    }
  }
}



export default PlaceOrder
