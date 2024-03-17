//------------------------- ADMIN LOGIN SECTION - CLIENT SIDE ---------------------------------

const submitbtn = document.querySelector(".login_submit")
const form = document.getElementById("loginForm")
const errorMessage = document.getElementById("loginError")

submitbtn.addEventListener("click", async (event)=>{
    event.preventDefault()

    const loginForm = new FormData(form)
    const formDetails = Object.fromEntries(loginForm)
    try {
        const url = "/admin/login"
        const response = await axios.post(url,formDetails)
        const result = response.data

        if(result.success){
            if(result.admin){
                window.location.href = "/admin/home"
            }
            else if(result.verification){
                const email = result.email
                window.location.href = `/admin/verification?email=${encodeURIComponent(email)}`
            }
        }
        else{
             if(result.invalidPass){
                errorMessage.innerHTML = result.error
                setTimeout(() => {
                    errorMessage.innerHTML = ""
                }, 4000);
            }
            else if(result.noAdmin){
                errorMessage.innerHTML = result.error
                setTimeout(() => {
                    errorMessage.innerHTML = ""
                }, 4000);
            }
        }
    } catch (error) {
        console.log("admin login ", error.message);
    }
}) 