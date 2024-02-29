import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { selectToken } from '../../features/users/userSlice';
// import { userId } from '../../components/Chatbar/ChatBar';
// const userId = sessionStorage.getItem('userId')
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/',
        prepareHeaders: (headers, { getState }) => {
          
            const token = selectToken(getState())// Get the token from the Redux store
            if (token) {
                headers.set('token', `${token}`);
            }
            return headers;

        }
    }),
    tagTypes: 'User',
    endpoints: (builder) => ({



        getUser: builder.query({
            query: (data) => ({
                url: `user/user/${data?._id}`,
                method: 'GET',
            })
        }),

        logInUser: builder.mutation({
            query: (data) => ({
                url: 'user/logIn',
                method: 'POST',
                body: data
            }),

        }),

        updateUser: builder.mutation({
            query: (data) => ({
                url: `user/update/${data.userId}`,
                method: 'PUT',
                body: { email: data?.email, username: data?.username, password: data?.password, image: data?.image }
            }),

        }),

        signOutUser: builder.mutation({
            query: () => ({
                url: 'user/signOut',
                method: 'POST',
                body: ''
            }),

        }),

        getProtection: builder.query({
            query: () => ({
                url: 'user/protected',
                method: 'GET',
            }),

        }),
        getProducts: builder.mutation({
            query: () => ({
                url: 'product',
                method: 'GET'
            })
        }),
        updateProduct: builder.mutation({
            query: ({productId,data}) => ({
                url: `product/updatetProduct/${productId}`,
                method: 'PUT',
                body:data
            })
        }),
        addProduct: builder.mutation({
            query: (data) => {
                const formData = new FormData();
                formData.append('productName',data.productName); 
                formData.append('image', data.productPicture); 
                formData.append('price', data.price); 
                formData.append('buyPrice', data.buyPrice); 
                formData.append('count', data.count); 
              
                return {
                    url: 'product/addProduct',
                    method: 'POST',
                    body:formData,

                };
            },
        }),
        removeProduct: builder.mutation({
            query: (productId) => ({
                url: `product/removeProduct/${productId}`,
                method: 'DELETE',
            })
        }),
        getProduct: builder.mutation({
            query: (productId) => ({
                url: `product/product/${productId}`,
                method: 'GET',
            })
        }),
        getSales: builder.mutation({
            query: () => ({
                url: 'sale',
                method: 'GET'
            })
        }),
        updateSale: builder.mutation({
            query: ({saleId,data}) => ({
                url: `sale/updatetSale/${saleId}`,
                method: 'PUT',
                body:data
            })
        }),
        addSale: builder.mutation({
            query: (data) =>( {
                    url: 'sale/addSale',
                    method: 'POST',
                    body:data,

                })
            },
        ),
        removeSale: builder.mutation({
            query: ({sales}) => ({
                url: `sale/removeSale`,
                method: 'DELETE',
                body: {saleIds:sales}
            })
        }),

    })

})
export const { useRegisterUserMutation,
    useUpdateUserMutation,
    useLogInUserMutation,
    useGetProtectionQuery,
    useSignOutUserMutation,
    useGetUserQuery,
    useAddProductMutation,
    useGetProductsMutation,
    useGetProductMutation,
    useUpdateProductMutation,
    useRemoveProductMutation,
    useAddSaleMutation,
    useGetSalesMutation,
    useGetSaleMutation,
    useUpdateSaleMutation,
    useRemoveSaleMutation,
    
} = apiSlice