// const { default: axios } = require("axios")
// const Content = require("twilio/lib/rest/Content")



const categoryBtn = document.getElementById("category_submit_btn")
const subcategoryBtn = document.getElementById("sub-category_submit_btn")

const subcategoryArray = []
subcategoryBtn.addEventListener("click", async (event)=>{
    event.preventDefault()
   try {
      const subcategoryNameInput = document.getElementById("subcategoryName")
      const subcategoryName = subcategoryNameInput.value.trim()
      const subcatError = document.getElementById("subcatError")
      
      if(subcategoryName === ""){
          subcatError.innerHTML = "Provide Subcategory name"
          setTimeout(() => {
              subcatError.innerHTML = ""
            }, 4000);
        }else{
            subcategoryArray.push(subcategoryName)
            subcategoryNameInput.value = "" 
      } 
   } catch (error) {
    console.log("subCategory ",error);
   } 
})

categoryBtn.addEventListener("click", async (event)=>{
    event.preventDefault()
    const categoryImage = document.getElementById("categoryImage").files[0]
    const categoryName = document.getElementById("categoryName").value.trim()
    const subcategoryName = document.getElementById("subcategoryName").value.trim()
    if(subcategoryName){
        subcategoryArray.push(subcategoryName)
    }
    const categoryForm = new FormData()
    categoryForm.append("categoryImage",categoryImage)
    categoryForm.append("category",categoryName)
    categoryForm.append("subCategory",subcategoryArray)
    const errormsg = document.getElementById("errorMessage")
    try {
        if(categoryName === "" && !categoryImage){
            errormsg.innerHTML = "Provide Category details"
            setTimeout(() => {
                errormsg.innerHTML = ""
            }, 4000);
        }
        else if(categoryName === ""){
            errormsg.innerHTML = "Provide Category name"
            setTimeout(() => {
                errormsg.innerHTML = ""
            }, 4000);
        }
        else if(!categoryImage){
            errormsg.innerHTML = "Provide Category image"
            setTimeout(() => {
                errormsg.innerHTML = ""
            }, 4000);
        }else{
            const response = await axios.post("/admin/category/add_Category",categoryForm,{
                headers: {
                    "content-Type" : "multipart/form-data"
                }
            })
            
            const result = response.data

                const categoryInput = document.getElementById("categoryName")
                const subcategoryNameInput = document.getElementById("subcategoryName")
                const imageInput = document.getElementById("imagePreview")

                if(result.success){
                    if(result.allData){
                        errormsg.innerHTML = result.message
                        categoryInput.value = ""
                        subcategoryNameInput.value = ""
                        imageInput.src = ""
                        setTimeout(() => {
                            errormsg.innerHTML = ""
                        }, 4000);
                    }
                    else if(result.data){
                        errormsg.innerHTML = result.message
                        categoryInput.value = ""
                        imageInput.src = ""
                        subcategoryNameInput.value = ""
                        setTimeout(() => {
                            errormsg.innerHTML = ""
                        }, 4000);
                    }
                }else{
                    if(result.missingData){
                        errormsg.innerHTML = result.errorMsg
                        setTimeout(() => {
                            errormsg.innerHTML = ""
                        }, 4000);
                    }
                    else if(result.exist){
                        errormsg.innerHTML = result.errorMsg
                        setTimeout(() => {
                            errormsg.innerHTML = ""
                        }, 4000);
                    }
                }
        }
    } catch (error) {
        console.log("category fetch ",error.message);
    }
})

































// document.addEventListener("DOMContentLoaded", async ()=>{
//     try {
//         const subcategoryDropdown = document.getElementById("subcategory_list_icon")
//         const deleteButton = subcategoryDropdown.querySelectorAll(".bi-trash-fill")
//         deleteButton.forEach(dltbtn =>{
//             dltbtn.addEventListener("click",()=>{

//                 const listItem = dltbtn.closest("li")
//                 if(listItem){
//                     listItem.remove()
//                 }
//             })
//             })
        
//     } catch (error) {
//         console.error("Error adding event listener:", error);
//     }
// })