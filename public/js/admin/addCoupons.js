document.getElementById("coupon_create_button").addEventListener("click", async (event)=>{
    event.preventDefault()

    try {
        const couponName = document.getElementById("couponName").value.trim()
        const couponDiscount = document.getElementById("couponDiscount").value.trim()
        const minOrderAmount = document.getElementById("minOrderAmount").value
        const maxOrderAmount = document.getElementById("maxOrderAmount").value
        const startingDate = document.getElementById("startingDate").value
        const endingDate = document.getElementById("endingDate").value

        if(!couponName || !couponDiscount || !minOrderAmount || !maxOrderAmount || !startingDate || !endingDate){
            document.getElementById("errorMessage").innerHTML = "Please provide required datas"
            setTimeout(() => {
                document.getElementById("errorMessage").innerHTML = ""
            }, 4000);
        }else{
            const formData = new FormData(document.getElementById("coupon_add_form"))
            const couponData = Object.fromEntries(formData)

            const response = await axios.post("/admin/coupons/add_Coupon",couponData)
            const result = response.data

            if(!result.success){
                document.getElementById("errorMessage").innerHTML = "Coupon already exists"
                setTimeout(() => {
                    document.getElementById("errorMessage").innerHTML = ""
                }, 4000);
            }else{
                document.getElementById("couponName").value = ""
                document.getElementById("couponDiscount").value = ""
                document.getElementById("minOrderAmount").value = ""
                document.getElementById("maxOrderAmount").value = ""
                document.getElementById("startingDate").value = ""
                document.getElementById("endingDate").value = ""
                
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Coupon added successfully",
                    showConfirmButton: false,
                    timer: 2500
                  });
            }
        }
    } catch (error) {
        console.log(error);
    }
})