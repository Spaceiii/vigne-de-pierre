import { getRequest, postRequest, putRequest } from '@/services/axios.ts'
import type { Order, OrderFormData } from '@/types/order.ts'

/**
 * Creates a new order
 * @param orderData The order data to submit
 * @returns The created order
 */
async function createOrder(orderData: OrderFormData): Promise<Order> {
  const { data, error, status } = await postRequest('/order/create', orderData)
  if (error) {
    console.error(`Error creating order (status ${status}):`, data)
    throw new Error(`Error creating order: ${data}`)
  }
  return data
}

async function fetchUserOrders() {
  const { data, error, status } = await getRequest('/order/user');
  if (error) {
    console.error(`Error fetching user orders (status ${status}):`, data);
    throw new Error(`Error fetching orders: ${data}`);
  }
  console.log(data)
  return data;
}

async function updateOrderStatus(orderId: number, status: string) {
  const { data, error, status: statusCode } = await putRequest(`/order/${orderId}/status`, { status });
  if (error) {
    console.error(`Error updating order ${orderId} (status ${statusCode}):`, data);
    throw new Error(`Error updating order: ${data}`);
  }
  return data;
}

async function fetchAllOrders() {
  const { data, error, status } = await getRequest('/order/all');
  if (error) {
    console.error(`Error fetching all orders (status ${status}):`, data);
    throw new Error(`Error fetching all orders: ${data}`);
  }
  return data;
}

export {
  createOrder,
  fetchUserOrders,
  updateOrderStatus,
  fetchAllOrders,
}
