const submitbtn = document.getElementById("reset_submit")
const form = document.getElementById("resetForm")
const errorMessage = document.getElementById("resetError")

const urlParams = new URLSearchParams(window.location.search)
const email = urlParams.get('email')
console.log(email);

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
        }
        else{
            
            errorMessage.innerHTML = result.error
        }
    } catch (error) {
        console.log("reset ", error.errorMessage);
    }
})