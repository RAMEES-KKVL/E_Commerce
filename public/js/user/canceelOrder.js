async function cancelOrder(event, productId, orderId, quantity){
    try {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
            });
            swalWithBootstrapButtons.fire({

            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, cancel it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
            customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-secondary'
            }}).then( async (result) => {
                if (result.isConfirmed) {

                    const response = await axios.patch("/cancelOrder",{productId, orderId, quantity})
                    const result = response.data

                    if(result.success){
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Order cancelled successfully",
                            showConfirmButton: false,
                            timer: 2500
                        });
                        setTimeout(() => {
                            window.location.href = "/account/orders"
                        }, 2500);
                    }else{
                        document.getElementById("error_cancelOrder").innerHTML = "Cancellation Failed"
                        setTimeout(() => {
                            document.getElementById("error_cancelOrder").innerHTML = ""
                        }, 4000);
                    }
                } else if (
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    text: "Cancelled",
                    icon: "error"
                    });
                }
            });
    } catch (error) {
        console.log(error);
    }
}