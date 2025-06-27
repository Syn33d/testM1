const mockStripe = {
    customers: {
        create: jest.fn(),
        retrieve: jest.fn(),
        update: jest.fn(),
        del: jest.fn(),
    }
}

jest.mock('stripe', () => {
    return jest.fn(() => mockStripe);
});

const Stripe = require('stripe');
const stripeService = require('../src/stripeService');

describe('Create Customer', () => {
    let mockedStripeInstance;

    beforeEach(() => {
        Stripe.mockClear();
        mockedStripeInstance = Stripe();
        Stripe().customers.create.mockClear();
    });

    it('should create a customer with valid data', async () => {
        const customerData = { email: 'customer@customer.fr', name: 'John Doe' };
        const mockResponse = { id: 'cus_123', ...customerData };
        mockedStripeInstance.customers.create.mockResolvedValue(mockResponse);
        const result = await stripeService.createCustomer(customerData);
        expect(mockedStripeInstance.customers.create).toHaveBeenCalledWith(customerData);
        expect(result).toEqual(mockResponse);
    });

    it('Should fail with invalid data', async() => {
        const data = null;
        await expect(stripeService.createCustomer(data)).rejects.toThrow("Invalid data: an object is required to create a customer");
    });

    it('should throw if Stripe fails to create customer', async () => {
        const customerData = { email: 'fail@fail.fr', name: 'Fail' };
        const error = new Error('Stripe error');
        mockedStripeInstance.customers.create.mockRejectedValue(error);
        await expect(stripeService.createCustomer(customerData)).rejects.toThrow('Failed to create customer: Stripe error');
    });
});

describe('Get Customer', () => {
    let mockedStripeInstance;

    beforeEach(() => {
        Stripe.mockClear();
        mockedStripeInstance = Stripe();
        Stripe().customers.retrieve.mockClear();
    });

    it('Should fail without an ID', async () => {
        const customerData = { id: '', email: 'bob@bob.fr', name: 'Bob' };
        expect(stripeService.getCustomer(customerData.id)).rejects.toThrow('Customer ID is required');
    });

    it('should fail without a customer', async () => {
        const customerData = {id: '18', email: 'test@test.fr', name: 'Test User'};
        expect(stripeService.getCustomer(customerData)).rejects.toThrow('Customer not found');
    })

    it('should throw if Stripe fails to retrieve customer', async () => {
        const error = new Error('Stripe error');
        mockedStripeInstance.customers.retrieve.mockRejectedValue(error);
        await expect(stripeService.getCustomer('cus_123')).rejects.toThrow('Failed to get customer: Stripe error');
    });

    it('should get a customer with valid id', async () => {
        const customerId = 'cus_123';
        const mockResponse = { id: customerId, email: 'test@test.fr', name: 'Test', deleted: false };
        mockedStripeInstance.customers.retrieve.mockResolvedValue(mockResponse);
        const result = await stripeService.getCustomer(customerId);
        expect(mockedStripeInstance.customers.retrieve).toHaveBeenCalledWith(customerId);
        expect(result).toEqual(mockResponse);
    });
});

describe('Update Customer', () => {
    let mockedStripeInstance;

    beforeEach(() => {
        Stripe.mockClear();
        mockedStripeInstance = Stripe();
        Stripe().customers.update.mockClear();
    });

    it('should fail without an ID', async () => {
        const customerData = { id: '', email: 'dog@dog.fr', name: 'Dog' };
        await expect(stripeService.updateCustomer(customerData.id, customerData)).rejects.toThrow('Customer ID is required');
    });

    it('should fail with invalid data', async () => {
        const customerData = { id: 'cus_123', email: 'cat@cat.fr', name: 'Cat' };
        await expect(stripeService.updateCustomer(customerData.id, null)).rejects.toThrow('Invalid data: an object is required to update a customer');
    });

    it('should throw if Stripe fails to update customer', async () => {
        const error = new Error('Stripe error');
        mockedStripeInstance.customers.update.mockRejectedValue(error);
        await expect(stripeService.updateCustomer('cus_123', { name: 'New' })).rejects.toThrow('Failed to update customer: Stripe error');
    });

    it('should update a customer with valid data', async () => {
        const customerId = 'cus_123';
        const updateData = { name: 'Updated Name' };
        const mockResponse = { id: customerId, ...updateData };
        mockedStripeInstance.customers.update.mockResolvedValue(mockResponse);
        const result = await stripeService.updateCustomer(customerId, updateData);
        expect(mockedStripeInstance.customers.update).toHaveBeenCalledWith(customerId, updateData);
        expect(result).toEqual(mockResponse);
    });
});

describe('Delete Customer', () => {
    let mockedStripeInstance;

    beforeEach(() => {
        Stripe.mockClear();
        mockedStripeInstance = Stripe();
        Stripe().customers.del.mockClear();
    });

    it('should fail without an ID', async () => {
        await expect(stripeService.deleteCustomer('')).rejects.toThrow('Customer ID is required');
    });

    it('should fail to delete a customer that does not exist', async () => {
        const customerId = 'non_existent_id';
        mockedStripeInstance.customers.del.mockRejectedValue(new Error('Customer could not be deleted'));
        await expect(stripeService.deleteCustomer(customerId)).rejects.toThrow('Customer could not be deleted');
    });

    it('should throw if Stripe fails to delete customer', async () => {
        const error = new Error('Stripe error');
        mockedStripeInstance.customers.del.mockRejectedValue(error);
        await expect(stripeService.deleteCustomer('cus_123')).rejects.toThrow('Failed to delete customer: Stripe error');
    });

    it('should throw if deleted.deleted is false', async () => {
        mockedStripeInstance.customers.del.mockResolvedValue({ deleted: false });
        await expect(stripeService.deleteCustomer('cus_123')).rejects.toThrow('Customer could not be deleted');
    });

    it('should delete a customer with valid id', async () => {
        const customerId = 'cus_123';
        mockedStripeInstance.customers.del.mockResolvedValue({ deleted: true });
        const result = await stripeService.deleteCustomer(customerId);
        expect(mockedStripeInstance.customers.del).toHaveBeenCalledWith(customerId);
        expect(result).toBe(true);
    });
});