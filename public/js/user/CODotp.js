// FUNCTION FOR MANAGING INPUT FIELDS 

const otpInputs = document.querySelectorAll('.otp_number input');
document.addEventListener('keydown', () => {
    if(otpInputs[0].value){
        return
    }
    else{ 
        otpInputs[0].focus();
    }
});

otpInputs.forEach((input, index) => { 
    input.addEventListener('input', (event) => {
        if (event.target.value.length === 1) {
            if (index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
        }
    } else if (event.target.value.length === 0 && index > 0) {
        otpInputs[index - 1].focus();
    }
    });
    input.addEventListener("keydown", (event)=>{
            const currentValue = event.target.value;
            if(event.keyCode === 8 && currentValue.length === 0){
                if(index > 0){
                    otpInputs[index - 1].focus();
                }
            }
        })
})


// FUNCTION SUBMITTING OTP FORM 

document.getElementById("cod_Otp_bttn").addEventListener("click", async (event)=>{
    event.preventDefault()
    try {
        if(
            !document.getElementById("one").value ||
            !document.getElementById("two").value ||
            !document.getElementById("three").value ||
            !document.getElementById("four").value ||
            !document.getElementById("five").value ||
            !document.getElementById("six").value
        ){
            document.getElementById("error_message").innerHTML = "Provide 6 digit otp"
            setTimeout(() => {
                document.getElementById("error_message").innerHTML = ""
            }, 4000);
        }else{
            const formData = Object.fromEntries(new FormData(document.getElementById("cod_otp_form")))
            const response = await axios.post("/cod_otp", formData)
            const result = response.data
            if(result.success){
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Order completed successfully",
                    showConfirmButton: false,
                    timer: 2500
                });
                setTimeout(() => {
                    window.location.href = "/home"
                }, 2500);
            }else{
                if(result.otp){
                    document.getElementById("error_message").innerHTML = "Invalid otp"
                    setTimeout(() => {
                        document.getElementById("error_message").innerHTML = ""
                    }, 4000);
                }
                else if(result.failedCreation){
                    document.getElementById("error_message").innerHTML = "Couldn't place order"
                    setTimeout(() => {
                        document.getElementById("error_message").innerHTML = ""
                    }, 4000);
                }
            }
        }
    } catch (error) {
        console.log(error);
    }

})
