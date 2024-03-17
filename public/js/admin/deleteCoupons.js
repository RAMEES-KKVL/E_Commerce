//------------------------- REMOVING COUPONS - CLIENT SIDE ---------------------------------

document.querySelectorAll(".bi-trash-fill").forEach(deleteBtn =>{
    deleteBtn.addEventListener("click", async (event)=>{
        event.preventDefault()
        try {
            const couponId = deleteBtn.getAttribute("coupon-id")

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
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
            customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-secondary'
            }}).then( async (result) => {
                if (result.isConfirmed) {
                    swalWithBootstrapButtons.fire({
                    title: "Deleted!",
                    text: "Coupon has been deleted.",
                    icon: "success"
                    });

                    const response = await axios.delete(`/admin/coupons/delete_Coupon?couponId=${couponId}`)
                    const result = response.data

                    if(result.success){
                        deleteBtn.closest("tr").remove()
                    }else{
                        document.getElementById("errormsg").innerHTML = "Failed"
                        setTimeout(() => {
                            document.getElementById("errormsg").innerHTML = ""
                        }, 4000);
                    }
                } else if (
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    text: "Coupon deletion cancelled",
                    icon: "error"
                    });
                }
            });


        } catch (error) {
            console.log(error);
        }
    })
})