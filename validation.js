//Server-side form validation for SECURITY
//Client-side validation can be disabled
export function validateForm(data){
    console.log("Validating")
    console.log(data)
    // Errors array
    const errors = [];
    // Validate first name
    if(!data.fname || data.fname.trim() === ""){
        errors.push("First name is required");
    }
    // Validate last name
    if(!data.lname || data.lname.trim() === ""){
        errors.push("Last name is required")
    }
    // Validate method
    const validMethods = ["pickup", "delivery"];
    if(!validMethods.includes(data.method)){
        errors.push("Method is invalid")
    }
    // Validate pizza size
    const validSizes = ["small", "medium","large"];
    if(!validSizes.includes(data.size)){
        errors.push("Size is invalid");
    }
    // Validate pizza toppings
    const validToppings = ['small','medium','large'];
    if(data.toppings){
        // If a single topping is selected, turn it into an array
        const toppings = Array.isArray(data.toppings) ?
        data.toppings :
        [data.toppings];

        // Make sure all toppings are valid
        for(let topping of toppings) {
            if(!validToppings.includes(topping)){
                errors.push("Invalid toppings selected")
            }
        }
    }
    // Return an object with two properties:
    // A boolean isValid, and an array of error messages
    return {
        isValid: errors.length === 0,
        errors: errors
    }
}