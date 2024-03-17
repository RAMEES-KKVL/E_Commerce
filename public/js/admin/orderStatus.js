//------------------------- FUNCTION FOR CHANGING ORDER STATUS ---------------------------------

async function changeOrderStatus(event, orderId, productId, userId){
    try{
        const response = await axios.patch("/admin/orders_status", {orderId, productId, userId})
        const result = response.data

        if(result.success){
            document.querySelector(".edit_order_status" + orderId + productId).innerHTML = "Delivered"
        }else{
            document.querySelector(".edit_order_status" + orderId + productId).innerHTML = "failed"
            setTimeout(() => {
                document.querySelector(".edit_order_status" + orderId + productId).innerHTML = "Confirmed"
            }, 4000);
        }
    } catch (error) {
        console.log(error);
    }
}