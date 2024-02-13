const submitbtn = document.getElementById("reset_submit")
const form = document.getElementById("resetForm")
const errorMessage = document.getElementById("resetError")

const urlParams = new URLSearchParams(window.location.search)
const email = urlParams.get('email')
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
const passValue = document.getElementById("password")

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

submitbtn.addEventListener("click", async (event)=>{
    event.preventDefault()
    const resetForm = new FormData(form)
    const resetData = Object.fromEntries(resetForm)

    try {
        const url = `/admin/reset_password?email=${encodeURIComponent(email)}`
        const response = await axios.post(url,resetData)
        const result = response.data
        const password = document.getElementById("password").value
        const validatingPassword= passwordRegex.test(password)

        if(!validatingPassword){
            errorMessage.innerHTML = "Invalid Password"
            setTimeout(() => {
                errorMessage.innerHTML = ""
            }, 4000);
        }else{
            if(result.success){
                window.location.href = "/login"
            }
            else if(result.passNoMatch){
                errorMessage.innerHTML = result.error
                setTimeout(() => {
                    errorMessage.innerHTML = ""
                }, 4000);
            }else{
                errorMessage.innerHTML = result.error
                setTimeout(() => {
                    errorMessage.innerHTML = ""
                }, 4000);
            }
        }
    } catch (error) {
        console.log("reset ", error.errorMessage);
    }
})