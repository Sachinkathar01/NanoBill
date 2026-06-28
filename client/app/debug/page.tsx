"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";

export default function DebugPage() {
    const auth = useAuthStore();
    const [localStorageVal, setLocalStorageVal] = useState<string | null>(null);
    const [cookiesVal, setCookiesVal] = useState<string>("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setLocalStorageVal(localStorage.getItem("nanobill-auth"));
            setCookiesVal(document.cookie);
        }
    }, []);

    const testApiCall = async () => {
        try {
            const res = await api.get("/dashboard/stats");
            alert("API Call Succeeded! " + JSON.stringify(res.data));
        } catch (err: any) {
            alert("API Call Failed: " + (err.response?.status || err.message));
        }
    };

    return (
        <div className="p-8 space-y-6 text-white font-mono bg-black min-h-screen">
            <h1 className="text-2xl font-bold">NanoBill Auth Debugger</h1>
            
            <section className="p-4 border border-white/20 rounded">
                <h2 className="text-lg font-semibold mb-2">Zustand State</h2>
                <pre>{JSON.stringify({
                    isAuthenticated: auth.isAuthenticated,
                    user: auth.user,
                    token: auth.token ? "PRESENT (hidden)" : "MISSING"
                }, null, 2)}</pre>
            </section>

            <section className="p-4 border border-white/20 rounded">
                <h2 className="text-lg font-semibold mb-2">LocalStorage ('nanobill-auth')</h2>
                <pre>{localStorageVal ? JSON.stringify(JSON.parse(localStorageVal), null, 2) : "Null / Not set"}</pre>
            </section>

            <section className="p-4 border border-white/20 rounded">
                <h2 className="text-lg font-semibold mb-2">Document Cookies</h2>
                <p>{cookiesVal || "No readable cookies (might be HttpOnly)"}</p>
            </section>

            <button onClick={testApiCall} className="px-4 py-2 bg-white text-black font-semibold rounded hover:bg-neutral-200">
                Test API `/dashboard/stats`
            </button>
        </div>
    );
}
