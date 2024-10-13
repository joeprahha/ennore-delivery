export const getCartFromLocalStorage = () => {
    const storedCart = localStorage.getItem('cart');
    console.log(JSON.parse(storedCart))
    return storedCart ? JSON.parse(storedCart) :[];
};

export const setCartToLocalStorage = (newItem) => {
console.log("set",newItem)
    // Get the current cart from local storage
   
    // Save the updated cart back to local storage
    localStorage.setItem('cart', JSON.stringify(newItem));
};



export const getUserInfo = () => {
let user =localStorage.getItem('userInfo')
   return user ? JSON.parse(user) :{};
};


export const isValidCustomerDetails=()=>{

let user =localStorage.getItem('userInfo')
let {address1,local_area,phone}=user ? JSON.parse(user):{}
 if(address1 && local_area && phone){ return true}
return false
}
