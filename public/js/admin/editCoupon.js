//------------------------- EDIT COUPONS - CLIENT SIDE ---------------------------------

document.getElementById("coupon_edit_button").addEventListener("click", async (event)=>{
    event.preventDefault()
    try {
        const couponName = document.getElementById("couponName").value.trim()
        const couponDiscount = document.getElementById("couponDiscount").value.trim()
        const minOrderAmount = document.getElementById("minOrderAmount").value
        const maxOrderAmount = document.getElementById("maxOrderAmount").value
        const startingDate = document.getElementById("startingDate").value
        const endingDate = document.getElementById("endingDate").value
        const availability = document.getElementById("availability").value

        if(!couponName || !couponDiscount || !minOrderAmount || !maxOrderAmount || !startingDate || !endingDate || !availability){
            document.getElementById("errorMessage").innerHTML = "Provide required datas"
            setTimeout(() => {
                document.getElementById("errorMessage").innerHTML = ""
            }, 4000);
        }else{
            const formData = new FormData(document.getElementById("coupon_edit_form"))
            const couponData = Object.fromEntries(formData)
            const couponId = document.getElementById("coupon_edit_button").getAttribute("coupon-id")

            const response = await axios.patch(`/admin/coupons/edit_Coupon?couponId=${couponId}`, couponData)
            const result = response.data

            if(result.success){
                document.getElementById("couponName").innerHTML = couponName
                document.getElementById("couponDiscount").innerHTML = couponDiscount
                document.getElementById("minOrderAmount").innerHTML = minOrderAmount
                document.getElementById("maxOrderAmount").innerHTML = maxOrderAmount
                document.getElementById("startingDate").innerHTML = startingDate
                document.getElementById("endingDate").innerHTML = endingDate

                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Coupon edited successfully",
                    showConfirmButton: false,
                    timer: 2500
                });
            }else{
                document.getElementById("errorMessage").innerHTML = "Could't edit coupon"
                setTimeout(() => {
                    document.getElementById("errorMessage").innerHTML = ""
                }, 4000);
            }
        }
    } catch (error) {
        console.log(error);
    }
})