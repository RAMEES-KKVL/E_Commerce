//------------------------- USER SINGNUP SECTION - CLIENT SIDE ---------------------------------

const submitButn = document.getElementById("signup_submit_btn")
const form = document.getElementById("signup_form")
const signup_email = document.getElementById("signup_error_email")
const signup_phone = document.getElementById("signup_error_phone")
const signup_password = document.getElementById("signup_error_password")
const signup_cpass = document.getElementById("signup_error_cpass")
const signup_error = document.getElementById("signup_error")

const email_value = document.getElementById("signup_input_email")
const password_value = document.getElementById("signup_input_password")
const phone_value = document.getElementById("signup_input_phone")
const cPass_value = document.getElementById("signup_input_confirmPassword")

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
const phoneRegex = /^[0-9]{10}$/  

email_value.onblur = ()=>{
    if(emailRegex.test(email_value.value)){
        signup_email.style.display = "none"
    }else{
        signup_email.style.display = "block"
        signup_email.innerHTML = "Invalid Email"
        setTimeout(() => {
            signup_email.innerHTML = ""
        }, 4000);
    }
}

password_value.onblur = ()=>{
    if(passwordRegex.test(password_value.value)){
        signup_password.style.display = "none"
    }else{
        signup_password.style.display = "block"
        signup_password.innerHTML = "Invalid Password"
        setTimeout(() => {
            signup_password.innerHTML = ""
        }, 4000);
    }
}

phone_value.onblur = ()=>{
    if(phoneRegex.test(phone_value.value)){
        signup_phone.style.display = "none"
    }else{
        signup_phone.style.display = "block"
        signup_phone.innerHTML = "Invalid Phone Number"
        setTimeout(() => {
            signup_phone.innerHTML = ""
        }, 4000);
    }
}

cPass_value.onblur = ()=>{
    if(password_value.value == cPass_value.value){
        signup_cpass.style.display = "none"
    }else{
        signup_cpass.style.display = "block"
        signup_cpass.innerHTML = "Confirm Password not matches password"
        setTimeout(() => {
            signup_cpass.innerHTML = ""
        }, 4000);
    }
}

submitButn.addEventListener("click", async (event)=>{
    event.preventDefault()
    const signupForm = new FormData(form)

    try {
        const email = document.getElementById("signup_input_email").value
        const password = document.getElementById("signup_input_password").value
        const phone = document.getElementById("signup_input_phone").value
    
        const validatingEmail = emailRegex.test(email)
        const validatingPassword = passwordRegex.test(password)
        const validatingPhone = phoneRegex.test(phone)

    if( !validatingEmail ){
        signup_email.innerHTML = "Invalid Email"
        setTimeout(() => {
            signup_email.innerHTML = ""
        }, 4000);
    }
    else if( !validatingPassword ){
        signup_password.innerHTML = "Invalid Password"
        setTimeout(() => {
            signup_password.innerHTML = ""
        }, 4000);
    }
    else if( !validatingPhone ){
        signup_phone.innerHTML = "Invalid Mobile Number"
        setTimeout(() => {
            signup_phone.innerHTML = ""
        }, 4000);
    } 
    else{
        const response = await fetch("/signup",{
            method: "POST",
            headers: {
                "content-Type":"application/json" 
            },
            body: JSON.stringify(Object.fromEntries(signupForm))
        })
        const result = await response.json()
    
        if(response.ok){
            if(result.success){
                const phone = result.phone
                    if(result.notVerified){
                        window.location.href =`/otp?phone=${phone}`
                    }else if(result.newUser){
                        window.location.href = `/otp?phone=${phone}`
                    }
                }
            }else{
                if(result.missingdata){
                    signup_error.innerHTML = result.error
                    setTimeout(() => {
                        signup_error.innerHTML = ""
                    }, 4000);
                }
                else if(result.notequlapass){
                    signup_cpass.innerHTML = result.error
                    setTimeout(() => {
                        signup_cpass.innerHTML = ""
                    }, 4000);
                }
                else if(result.userExist){
                    signup_error.innerHTML = result.error
                    setTimeout(() => {
                        signup_error.innerHTML = ""
                    }, 4000);
                } 
                else if(result.usernoval){
                    signup_error.innerHTML = result.error
                    setTimeout(() => {
                        signup_error.innerHTML = ""
                    }, 4000);
                }
            }
        }
    } catch (error) {
        console.log("signup ",error.message);
    }
})