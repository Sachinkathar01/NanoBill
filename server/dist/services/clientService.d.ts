export declare const ClientServices: {
    createClient(userId: string, name: string, email: string, phone: string, address: string): Promise<any>;
    getClientsByUser(userId: string): Promise<any[]>;
    updateClient(clientId: string, userId: string, name: string, email: string, phone: string, address: string): Promise<any>;
    deleteClient(clientId: string, userId: string): Promise<boolean>;
};
//# sourceMappingURL=clientService.d.ts.map