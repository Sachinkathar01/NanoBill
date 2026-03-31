export declare const AuthServices: {
    checkUserExists(email: string): Promise<boolean>;
    register(name: string, email: string, passwordString: string): Promise<{
        user: any;
        token: string;
    }>;
    login(email: string, passwordString: string): Promise<{
        user: any;
        token: string;
    } | null>;
    getUserById(userId: string): Promise<any>;
};
//# sourceMappingURL=authService.d.ts.map