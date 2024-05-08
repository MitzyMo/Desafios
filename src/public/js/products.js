const addToCart =async(productId)=>{
    console.log(productId);
    let cart=document.getElementById("cart")
    let cid=cart.value
    console.log(`Product ID: ${productId}, Codigo Carrito: ${cid}`)

    let response=await fetch(`/api/carts/${cid}/product/${productId}`,{
        method:"post"
    })
    if(response.status===200){
        let data=await response.json()
        console.log(data)
        alert("Product succesfully added")
    }
};