export declare const ItemServices: {
    createItem(userId: string, name: string, description: string, defaultPrice: number, imageUrl?: string | null): Promise<any>;
    getItemsByUser(userId: string): Promise<any[]>;
    updateItem(itemId: string, userId: string, name: string, description: string, defaultPrice: number, imageUrl?: string | null): Promise<any>;
    deleteItem(itemId: string, userId: string): Promise<boolean>;
};
//# sourceMappingURL=itemService.d.ts.map