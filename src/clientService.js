// Service pour gérer les clients
const clients = [];

function addClient({ firstName, lastName, email, phone, address, city, postalCode }) { 
    if(!firstName){
        throw new Error('firstName is required');
    }

    if(!lastName){
        throw new Error('lastName is required');
    }

    if(!email){
        throw new Error('email is required');
    }

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('email is invalid');
    }

    if(!/^\+33[1-9][0-9]{8}$/.test(phone) && phone !== undefined) {
        throw new Error('phone is invalid');
    }

    if(clients.some(client => client.email === email)) {
        throw new Error('email must be unique');
    }  
    
    const client = { id: clients.length + 1, firstName, lastName, email, phone, address, city, postalCode };
    clients.push(client);
    return client;
}

function getClients() {
    return clients;
}

function updateClient(id, updates) {
    const client = clients.find(client => client.id === id);
    if (!client) {
        throw new Error('client not found');
    }

    if(clients.some(client => client.email === updates.email)){
        throw new Error('email must be unique');
    }
    // Mise à jour des champs
    Object.assign(client, updates);
    return client;
}

function deleteClient(id) {
    if(!clients.some(client => client.id === id)) {
        throw new Error('client not found');
    }
    const index = clients.findIndex(client => client.id === id);
    clients.splice(index, 1);
    return true;
}

function resetClients() {
    clients.length = 0; // Réinitialise le tableau des clients
}

module.exports = {
    addClient,
    resetClients,
    getClients,
    updateClient,
    deleteClient
};
