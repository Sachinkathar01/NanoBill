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
    updateUserSettings(userId: string, razorpayAccountId: string | null, reminderWhatsappEnabled: boolean, reminderEmailEnabled: boolean, businessName: string | null, businessAddress: string | null, phone: string | null, bankAccountNumber: string | null, bankIfsc: string | null, subscriptionPlan?: string): Promise<any>;
    verifyEmailToken(token: string): Promise<any>;
    initiateForgotPassword(email: string): Promise<{
        user: any;
        resetToken: string;
    } | null>;
    resetPasswordWithToken(token: string, passwordString: string): Promise<any>;
};
//# sourceMappingURL=authService.d.ts.map