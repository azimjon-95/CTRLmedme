import { api } from "./api";
export const clinicApi = api.injectEndpoints({
  endpoints: (builder) => ({

    getAllClinics: builder.query({
      query: () => 'clinics/getData',
    }),
    getAllPayments: builder.query({
      query: () => 'clinics/getDataPayments',
    }),
    blockClinic: builder.mutation({
      query: (id) => ({
        url: `clinics/block/${id}`,
        method: 'PUT',
      }),
    }),
    unblockClinic: builder.mutation({
      query: (id) => ({
        url: `clinics/unblock/${id}`,
        method: 'PUT',
      }),
    }),
    deleteClinic: builder.mutation({
      query: (id) => ({
        url: `clinics/${id}`,
        method: 'DELETE',
      }),
    }),
    markPaymentMade: builder.mutation({
      query: (id) => ({
        url: `clinics/payment/${id}`,
        method: 'PUT',
      }),
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
        url: `clinics/${id}`,
        method: 'PUT',
        body: clinicData,
      }),
    }),
  }),

})

export const {
  useGetAllClinicsQuery,
  useBlockClinicMutation,
  useDeleteClinicMutation,
  useMarkPaymentMadeMutation,
  useCreateClinicsMutation,
  useGetAllPaymentsQuery,
  useUnblockClinicMutation,
  useUpdateClinicMutation, // Add this line
} = clinicApi;




