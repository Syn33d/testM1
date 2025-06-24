const clientService = require("../src/clientService");

beforeEach(() => {
  clientService.resetClients();
});

describe("addClient", () => {
  it("should create client with valid data", () => {
    const data = {
      firstName: "Alice",
      lastName: "Smith",
      email: "alice@example.com",
      phone: "+33123456789",
      address: "123 rue de Paris",
      city: "Paris",
      postalCode: "75001",
    };

    const client = clientService.addClient(data);

    expect(client).toHaveProperty("id");
    expect(client.firstName).toBe("Alice");
    expect(client.lastName).toBe("Smith");
    expect(client.email).toBe("alice@example.com");
    expect(client.phone).toBe("+33123456789");
    expect(client.address).toBe("123 rue de Paris");
    expect(client.city).toBe("Paris");
    expect(client.postalCode).toBe("75001");
  });

  it("should fail without firstName", () => {
    const data = {
      lastName: "Smith",
      email: "alice@example.com",
    };

    expect(() => clientService.addClient(data)).toThrow(
      "firstName is required"
    );
  });

  it("should fail without lastName", () => {
    const data = {
      firstName: "Alice",
      email: "alice@example.com",
    };

    expect(() => clientService.addClient(data)).toThrow("lastName is required");
  });

  it("should fail without email", () => {
    const data = {
      firstName: "Alice",
      lastName: "Smith",
    };

    expect(() => clientService.addClient(data)).toThrow("email is required");
  });

  it("should fail with invalid email", () => {
    const data = {
      firstName: "Alice",
      lastName: "Smith",
      email: "not-an-email",
    };

    expect(() => clientService.addClient(data)).toThrow("email is invalid");
  });

  it("should fail with badly formatted phone", () => {
    const data = {
      firstName: "Alice",
      lastName: "Smith",
      email: "alice@example.com",
      phone: "12345",
    };

    expect(() => clientService.addClient(data)).toThrow("phone is invalid");
  });

  it("should create client with minimal valid data", () => {
    const data = {
      firstName: "Bob",
      lastName: "Brown",
      email: "bob@example.com",
    };

    const client = clientService.addClient(data);

    expect(client).toHaveProperty("id");
    expect(client.firstName).toBe("Bob");
    expect(client.lastName).toBe("Brown");
    expect(client.email).toBe("bob@example.com");
    expect(client.phone).toBeUndefined();
    expect(client.address).toBeUndefined();
    expect(client.city).toBeUndefined();
    expect(client.postalCode).toBeUndefined();
  });

  it("should fail if email is not unique", () => {
    const data1 = {
      firstName: "Alice",
      lastName: "Smith",
      email: "duplicate@example.com",
    };

    const data2 = {
      firstName: "Bob",
      lastName: "Brown",
      email: "duplicate@example.com",
    };

    clientService.addClient(data1);

    expect(() => clientService.addClient(data2)).toThrow(
      "email must be unique"
    );
  });
});

describe("updateClient", () => {
  it("should update existing client data", () => {
    const client = clientService.addClient({
      firstName: "Alice",
      lastName: "Smith",
      email: "alice@example.com",
    });

    const updated = clientService.updateClient(client.id, {
      city: "Lyon",
      phone: "+33765432109",
    });

    expect(updated.city).toBe("Lyon");
    expect(updated.phone).toBe("+33765432109");
    expect(updated.firstName).toBe("Alice");
  });

  it("should fail updating non-existent client", () => {
    expect(() => clientService.updateClient(999, { city: "Lyon" })).toThrow(
      "client not found"
    );
  });

  it("should fail updating with duplicate email", () => {
    const client1 = clientService.addClient({
      firstName: "Alice",
      lastName: "Smith",
      email: "alice@example.com",
    });
    const client2 = clientService.addClient({
      firstName: "Bob",
      lastName: "Brown",
      email: "bob@example.com",
    });

    expect(() =>
      clientService.updateClient(client2.id, { email: "alice@example.com" })
    ).toThrow("email must be unique");
  });
});

describe("deleteClient", () => {
  it("should delete existing client", () => {
    const client = clientService.addClient({
      firstName: "Alice",
      lastName: "Smith",
      email: "alice@example.com",
    });

    clientService.deleteClient(client.id);

    expect(clientService.getClients()).toHaveLength(0);
  });

  it("should fail deleting non-existent client", () => {
    expect(() => clientService.deleteClient(999)).toThrow("client not found");
  });
});

describe("getClients", () => {
  it("should return all clients", () => {
    clientService.addClient({
      firstName: "Alice",
      lastName: "Smith",
      email: "alice@example.com",
    });
    clientService.addClient({
      firstName: "Bob",
      lastName: "Brown",
      email: "bob@example.com",
    });

    const clients = clientService.getClients();
    expect(clients).toHaveLength(2);
  });
});
