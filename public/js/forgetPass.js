const submitButn = document.querySelector("#forget_pass_submitBtn")
const form = document.getElementById("forgetPass_Form")

const errorMessage = document.querySelector("#forgetPass_Error")

submitButn.addEventListener("click", async (event)=>{

    event.preventDefault()
    const forgetForm = new FormData(form)

    const formEmail = Object.fromEntries(forgetForm)
    try {

                const email = document.getElementById("forget_email").value

                 const response = await axios.post("/forget_Password",formEmail);
                const result = response.data

                if(result.success === false){
                    errorMessage.innerHTML = response.data.error
                }
                else{
                    window.location.href = `forget_Password/otp/?email=${encodeURIComponent(email)}`

            }

        } catch (error) {
            console.log("errrrr");
        }
    })

    
    
    
    
    
    
    
    
    
    

    






