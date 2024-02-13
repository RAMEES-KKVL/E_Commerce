const submitbtn = document.getElementById("reset_submit")
const form = document.getElementById("resetForm")
const errorMessage = document.getElementById("resetError")

const urlParams = new URLSearchParams(window.location.search)
const email = urlParams.get('email')

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
const passValue = document.getElementById("password")
const cPassValue = document.getElementById("confirmPassword")

passValue.onblur = ()=>{
    if(passwordRegex.test(passValue.value)){
        errorMessage.style.display = "none"
    }else{
        errorMessage.style.display = "block"
        errorMessage.innerHTML = "Invalid Password"
        setTimeout(() => {
            errorMessage.innerHTML = ""
        }, 4000);
    }
}
cPassValue.onblur = ()=>{
    if(passValue.value == cPassValue.value){
        errorMessage.style.display = "none"
    }else{
        errorMessage.style.display = "block"
        errorMessage.innerHTML = "Invalid Confirm Password"
        setTimeout(() => {
            errorMessage.innerHTML = ""
        }, 4000);
    }
}

submitbtn.addEventListener("click", async (event)=>{
    event.preventDefault()
    const resetForm = new FormData(form)
    const resetData = Object.fromEntries(resetForm)

    try {
        const url = `/reset_Password?email=${encodeURIComponent(email)}`
        const response = await axios.post(url,resetData)
        const result = response.data

        if(result.success){
            window.location.href = "/login"
        }else{
            errorMessage.innerHTML = result.error
            setTimeout(() => {
                errorMessage.innerHTML = ""
            }, 4000);
        }
    } catch (error) {
        console.log("reset ", error.errorMessage);
    }
})