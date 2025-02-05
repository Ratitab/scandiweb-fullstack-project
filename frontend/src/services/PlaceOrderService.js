import { gql } from "graphql-request";
import graphqlServiceInstance from "./GraphQLService";

class PlaceOrderService {
  static async placeOrder(variables) {
    const mutation = gql`
      mutation PlaceOrder($orderItems: [OrderItemInput!]!) {
        placeOrder(orderItems: $orderItems) {
          orderId
          status
          message
        }
      }
    `;

    try {
        const response = await graphqlServiceInstance.request(mutation, variables)
        return response.placeOrder
    } catch (err) {
        throw new Error("failed to place oreder", err)
    }
  }
}



export default PlaceOrderService
