const addToCart = async (pid) => {
    console.log(pid);
    let cid = '6639237073f4746593a0ba96'; // Hardcoded cart ID
    console.log(`Product ID: ${pid}, Cart ID: ${cid}`);
  
    try {
      let response = await fetch(`/api/carts/${cid}/product/${pid}`, {
        method: "POST"
      });
      if (response.status === 200) {
        let data = await response.json();
        console.log(data);
        alert("Product successfully added");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Error adding product to cart. Please try again later.");
    }
  };


