// api.js
import { api } from "./api";

// Define an API using reduxjs/toolkit/query
export const clinicPayApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Endpoint for fetching clinic balance
        getClinicBalance: builder.query({
            query: () => '/clinic/balance',
            providesTags: ["GetClinics"],
        }),
        // Endpoint for fetching payments data
        getPayments: builder.query({
            query: () => '/clinic/getData/payment',
            providesTags: ["GetClinics"],
        }),
    }),
});

// Export hooks for usage in functional components
export const { useGetClinicBalanceQuery, useGetPaymentsQuery } = clinicPayApi;