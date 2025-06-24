const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_API_KEY);

/**
 * Create a new Stripe customer
 * @param {Object} data - Customer data (email, name, etc.)
 * @returns {Promise<Object>}
 */
async function createCustomer(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid data: an object is required to create a customer");
  }

  try {
    const customer = await stripe.customers.create(data);

    return customer;
  } catch (err) {
    throw new Error(`Failed to create customer: ${err.message}`);
  }
}

/**
 * Retrieve a Stripe customer by ID
 * @param {string} customerId
 * @returns {Promise<Object>}
 */
async function getCustomer(customerId) {
  if (!customerId) {
    throw new Error("Customer ID is required");
  }

  try {
    const customer = await stripe.customers.retrieve(customerId);

    if (!customer || customer.deleted) {
      throw new Error("Customer not found");
    }

    return customer;
  } catch (err) {
    throw new Error(`Failed to get customer: ${err.message}`);
  }
}

/**
 * Update an existing Stripe customer
 * @param {string} customerId
 * @param {Object} data
 * @returns {Promise<Object>}
 */
async function updateCustomer(customerId, data) {
  if (!customerId) {
    throw new Error("Customer ID is required");
  }

  if (!data || typeof data !== "object") {
    throw new Error("Invalid data: an object is required to update a customer");
  }

  try {
    const customer = await stripe.customers.update(customerId, data);
    return customer;
  } catch (err) {
    throw new Error(`Failed to update customer: ${err.message}`);
  }
}

/**
 * Delete a Stripe customer
 * @param {string} customerId
 * @returns {Promise<boolean>}
 */
async function deleteCustomer(customerId) {
  if (!customerId) {
    throw new Error("Customer ID is required");
  }

  try {
    const deleted = await stripe.customers.del(customerId);

    if (!deleted.deleted) {
      throw new Error("Customer could not be deleted");
    }

    return true;
  } catch (err) {
    throw new Error(`Failed to delete customer: ${err.message}`);
  }
}

module.exports = {
  createCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
};
