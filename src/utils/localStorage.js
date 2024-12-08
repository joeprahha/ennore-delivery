export const getCartFromLocalStorage = () => {
    const storedCart = localStorage.getItem('cart');
    
    return storedCart ? JSON.parse(storedCart||'{}') :{items:[]};
};

export const setCartToLocalStorage = (newItem) => {

    // Get the current cart from local storage
   
    // Save the updated cart back to local storage
    localStorage.setItem('cart', JSON.stringify(newItem));
};



export const getUserInfo = () => {
let user =localStorage.getItem('userInfo')
   return user ? JSON.parse(user) :{};
};

export const setUserInfo = (data) => {
localStorage.setItem('userInfo',JSON.stringify(data))

};


export const isValidCustomerDetails=()=>{

let user =localStorage.getItem('userInfo')
let {address1,phone}=user ? JSON.parse(user):{}
 if(address1 && phone){ return true}
return false
}
