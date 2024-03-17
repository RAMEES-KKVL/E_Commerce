//------------------------- FUNCTION FOR OTP INPUT AUTO FOCUS ---------------------------------
const otpInputs = document.querySelectorAll('.otp_number input');
document.addEventListener('keydown', () => {
    
    if(otpInputs[0].value){
        return
    }
    else{
        otpInputs[0].focus();
    }
});

//------------------------- FUNCTION FOR AUTO CHANGING INPUT FIELD ---------------------------------
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
});