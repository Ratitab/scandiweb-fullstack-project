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
        console.log("OrderPlaces succesfully", variables)
        const response = await graphqlServiceInstance.request(mutation, variables)
        console.log("OrderPlaces succesfully", response)
        return response.placeOrder
    } catch (err) {
        // console.log(err, "failed to olace oreder")
        throw new Error("FAILLDEEE")
    }
  }
}



export default PlaceOrder
