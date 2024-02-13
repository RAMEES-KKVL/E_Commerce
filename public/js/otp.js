const submitButn = document.getElementById("otp_submit_btn")
const form = document.getElementById("otp_form")
const errorMessage = document.getElementById("otp_error_message")

const urlParams = new URLSearchParams(window.location.search)
const phone = urlParams.get("phone")

submitButn.addEventListener("click", async (event)=>{
    event.preventDefault()
    const otpForm = new FormData(form)
    const formotp = Object.fromEntries(otpForm)
   
    try {
        const url = `/otp?phone=${encodeURIComponent(phone)}`
        const response = await axios.post(url,formotp)
        const result = response.data

        if (result.success) {
            window.location.href = "/login"
        }else{
            errorMessage.innerHTML = result.error
            setTimeout(() => {
                errorMessage.innerHTML = ""
                
            }, 5000);
        }
    } catch (error) {
        console.log("otp ", error.message);
    }
})