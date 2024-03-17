//------------------------- FORGET PASSWORD OTP SECTION - CLIENT SIDE ---------------------------------

const submitButn = document.getElementById("forgetPass_Otp_bttn")
const form = document.getElementById("forgetPass_otp_form")
const errorMessage = document.getElementById("error_message")
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');

submitButn.addEventListener("click", async (event)=>{
    event.preventDefault()
    const otpForm = new FormData(form)
    const formotp = Object.fromEntries(otpForm)
    
    try {
        const url = `/forget_Password/otp?email=${encodeURIComponent(email)}`;
        const response = await axios.post(url,formotp)
        const result = response.data
        
        if(result.success){
            window.location.href = `/reset_Password?email=${encodeURIComponent(email)}`
        }else{
            errorMessage.innerHT
            errorMessage.innerHTML = result.error
            setTimeout(() => {
                errorMessage.innerHTML = ""
            }, 5000);
        }
    } catch (error) {
        console.log("forget pass otp ",error.message);
    }
})