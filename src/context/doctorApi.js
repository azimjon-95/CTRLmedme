import { api } from "./api";

export const clinicApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllClinics: builder.query({
      query: () => 'clinics/getData',

      providesTags: ["GetClinics"],
    }),
    getAllPayments: builder.query({
      query: () => 'clinics/getDataPayments',
    }),
    deleteClinic: builder.mutation({
      query: (id) => ({
        url: `clinics/${id}`,
        method: 'DELETE',
      }),
    }),
    markPaymentMade: builder.mutation({
      query: (id) => ({
        url: `clinics/${id}/payment`,
        method: 'POST',
      }),
      invalidatesTags: ["GetClinics"],
    }),
    createClinics: builder.mutation({
      query: (body) => ({
        url: "clinics/post/data",
        method: "POST",
        body,
      }),
      invalidatesTags: ["GetClinics"],
    }),
    updateClinic: builder.mutation({
      query: ({ id, clinicData }) => ({
        url: `clinics/clinicsPut/${id}`,
        method: 'PUT',
        body: clinicData,
      }),
      invalidatesTags: ["GetClinics"],
    }),
  }),
});

export const {
  useGetAllClinicsQuery,
  useDeleteClinicMutation,
  useMarkPaymentMadeMutation,
  useCreateClinicsMutation,
  useGetAllPaymentsQuery,
  useUpdateClinicMutation,
} = clinicApi;


