//------------------------- FORGET PASSWORD - CLIENT SIDE ---------------------------------

const submitButn = document.querySelector("#forget_pass_submitBtn")
const form = document.getElementById("forgetPass_Form")
const errorMessage = document.querySelector("#forgetPass_Error")

submitButn.addEventListener("click", async(event)=>{
    event.preventDefault()
    const forgetForm = new FormData(form)
    const formEmail = Object.fromEntries(forgetForm)

    try {
        const response = await axios.post("/admin/forget_Password",formEmail)
        const result = response.data
            if(result.success){
                const forget_email = result.email
                    window.location.href = `/admin/verification?forget_email=${encodeURIComponent(forget_email)}`
            }else if(!result.success){
                errorMessage.innerHTML = result.error
                setTimeout(() => {
                    errorMessage.innerHTML = ""
                }, 4000);
            }
    } catch (error) {
        console.log("admin forget ",error.messsage);
    }
})