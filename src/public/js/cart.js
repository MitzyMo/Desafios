const cid = document.getElementById("cartValue").value;
console.log('Cart',cid);

const purchase = async() => {
    console.log('Product',cid);
    let response=await fetch(`/api/carts/${cid}/purchase`,{
        method:"post"
    })
    let data = await response.json()
    let formattedDate=null
    let formattedTime=null
    if(data.ticket){
        const date = new Date(data.ticket.purchase_datetime)
        const dateInArgentina = new Date(date.getTime() - 3 * 60 * 60 * 1000)
        formattedDate = dateInArgentina.toISOString().split('T')[0];
        formattedTime = dateInArgentina.toISOString().split('T')[1].split('.')[0];
    }
    if(response.status===200){
        
        const product = (products) => {
            return products.map(prod => `<li>${prod.title} - Cantidad: ${prod.quantity} - Precio: $${prod.price} - Subtotal: $${prod.subTotal}</li>`).join('');
        }

        const htmlConten = () => {
            let html = `<p><b>${data.message}</b></p>`;
    
            if (data.status === 'success') {
                html += `   </br>
                            <p><b>Tickets de Compra:</b><p>
                            <p>Operación: ${data.ticket.code}</p>
                            <p>Fecha y hora: ${formattedDate} - ${formattedTime}</p>
                            <p>Total de la compra: $${data.ticket.amount}</p>
                            <p>Email: ${data.ticket.purchaser}</p>
                            </br>
                            <p><strong>Productos comprados:</strong></p>
                            <ul>${product(data.confirmed)}</ul>`
            } 
            if (data.status === 'partial_success') {
                html += `   </br>
                            <p><b>Tickets de Compra:</b><p>
                            <p>Operación: ${data.ticket.code}</p>
                            <p>Fecha y hora: ${formattedDate} - ${formattedTime}</p>
                            <p>Total de la compra: $${data.ticket.amount}</p>
                            <p>Email: ${data.ticket.purchaser}</p>
                            </br>
                            <p><strong>Productos comprados:</strong></p>
                            <ul>${product(data.confirmed)}</ul>
                            </br>
                            <p><strong>Productos rechazados:</strong></p>
                            <ul>${product(data.rejected)}</ul>`
            } 
            if (data.status === 'fail') {
                html += `   </br>
                            <p><strong>Productos rechazados:</strong></p>
                            <ul>${product(data.rejected)}</ul>`
            } 
            return html;
        }

        Swal.fire({
            html: htmlConten(),
            icon: data.status==='success'?'success':data.status==='fail'?'error':'warning',
            position: 'top',
            width: '80%',
            showClass:{popup:'animate__animated animate__fadeInDown'},
            hideClass:{pupup:'animate__animated animate__fadeOutUp'},
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload()
            }
        })
    }
}

function decreaseProd(pid) {
    const cartId = document.getElementById("cartValue").value;
    const currentQuantityElement = document.getElementById(`prodQuantity-${pid}`);
    let currentQuantity = parseInt(currentQuantityElement.innerText);
    
    if (currentQuantity > 1) {
        fetch(`/api/carts/${cartId}/product/${pid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: currentQuantity - 1 })
        })
        .then(response => response.json())
        .then(data => {
            currentQuantityElement.innerText = currentQuantity - 1;
        })
        .catch(error => console.error('Error:', error));
    }
}

function increaseProd(pid) {
    const cartId = document.getElementById("cartValue").value;
    const currentQuantityElement = document.getElementById(`prodQuantity-${pid}`);
    let currentQuantity = parseInt(currentQuantityElement.innerText);
    
    fetch(`/api/carts/${cartId}/product/${pid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: currentQuantity + 1 })
    })
    .then(response => response.json())
    .then(data => {
        currentQuantityElement.innerText = currentQuantity + 1;
    })
    .catch(error => console.error('Error:', error));
}

function deleteProd(pid) {
    const cartId = document.getElementById("cartValue").value;

    fetch(`/api/carts/${cartId}/product/${pid}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        location.reload(); // Reload the page to reflect the changes
    })
    .catch(error => console.error('Error:', error));
}

function clearCart(cartId) {
    fetch(`/api/carts/${cartId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        location.reload(); // Reload the page to reflect the empty cart
    })
    .catch(error => console.error('Error:', error));
}
