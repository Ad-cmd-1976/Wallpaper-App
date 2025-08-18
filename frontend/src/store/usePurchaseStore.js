import { create } from 'zustand';
import axios from '../lib/axios';
import { toast } from 'react-hot-toast';

export const usePurchaseStore=create((set, get)=>({
    purchaseIds:[],

    getPurchaseIds:async ()=>{
        try{
            const response=await axios.get('/purchase/list');
            set({ purchaseIds:response.data.purchaseIds });
        }
        catch(error){
            console.log("Error in getPurchasedId function in usePurchase controller!",error);
        }
    },

    buyPlus:async ()=>{
        try{
            const res=await axios.post('/payment/order/plus-user', {}, {
                withCredentials: true
            });
            console.log(res);

            const data=res.data;

            const options={
                amount: data.amount,
                currency: data.currency,
                key: data.key,
                name: "Freepixz+",
                description: "Unlock Premium Features",
                order_id: data.orderId,
                handler: async(response) => { await get().verifyPlusUser(response) },
                prefill:{
                    name:"Test User",
                    email:"test@razorpay.com",
                    contact:"9999999999"
                },
                theme:{ color:"#6366f1" },
                modal:{
                    ondismiss: function(){
                        toast.error("Payment failed try again!");
                    }
                },
                retry:{
                    enabled:true
                }
            };

            const rzp=new window.Razorpay(options);
            rzp.on('payment.failed', function(){
                toast.error("Payment Failed",response.error.description);
            })
            rzp.open();
        }
        catch(error){
            console.log("Error in buyPlus function of usePurchase Store!", error);
            toast.error(error.response.data.message);
        }
    },

    verifyPlusUser:async (response)=>{
        try{
            const res=await axios.post('/payment/verify/plus-user', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,

            }, { withCredentials: true });

            if(res.data.success) toast.success(res.data.message);
            else toast.error("Verification failed!");
        }
        catch(error){
            console.log("Error in verifyPlusUser function of usePurchaseStore!");
            toast.error(error.response.data.message);
        }
    },

    buyImage:async (imageId)=>{
        set({ isLoading:true });
        try{
            const res=await axios.post(`/payment/order/${imageId}`, {}, { withCredentials:true });
            
            const data=res.data;
            
            const options={
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: "Wallpaper Store",
                description: "Purchase Premium Wallpaper",
                order_id: data.orderId,
                handler:async (response)=>{ await get().verifyPayment(response, data.imageId, data.amount)},
                prefill:{
                    name:"Test User",
                    email:"test@razorpay.com",
                    contact:"9999999999"
                },
                theme:{ color:"#6366f1" },
                modal:{
                    ondismiss: function(){
                        toast.error("Payment failed try again!");
                    }
                },
                retry:{
                    enabled:true
                }
            };

            const rzp=new window.Razorpay(options);

            rzp.on('payment.failed', function(){
                toast.error("Payment Failed",response.error.description);
            })
            rzp.open();
        }
        catch(error){
            console.log("Error in buyImage function", error);
            toast.error(error.response.data.message);
        }
    },

    verifyPayment: async (response, imageId, amount)=>{
        try{
            const res=await axios.post('/payment/verify',{
                razorpay_order_id:response.razorpay_order_id,
                razorpay_payment_id:response.razorpay_payment_id,
                razorpay_signature:response.razorpay_signature,
                imageId,
                amount
            }, { withCredentials:true });

            if(res.data.downloadReady){
                await get().getPurchaseIds();
                toast.success("Wallpaper Unlocked!!");
            }
            else toast.error("Verification Failed!");
        }
        catch(error){
            console.log("Error in verifyPayment",error);
            toast.error("Something Went Wrong!");
        }
        finally{
            set({ isLoading:false });
        }
    }
}))