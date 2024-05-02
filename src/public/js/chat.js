// prompt

Swal.fire({
    title:"Welcome To our Chat",
    input:"text",
    text:"Input your Name",
    inputValidator: (value)=>{
        return !value && "You must enter a Name"
    },
    allowOutsideClick:false
}).then(datos=>{
    // console.log(datos)
    let name=datos.value
    document.title=name

    let inputmessage=document.getElementById("message")
    let divmessages=document.getElementById("messages")
    inputmessage.focus()
    
    const socket=io()
    
    socket.emit("id", name)

    socket.on("newUser", name=>{
        Swal.fire({
            text:`${name} is connected`,
            toast:true,
            position:"top-right"
        })
    })

    socket.on("previousMessage", messages=>{
        messages.forEach(m=>{
            divmessages.innerHTML+=`<span class="message"><strong>${m.name}</strong> says <i>${m.message}</i></span><br>`
            divmessages.scrollTop=divmessages.scrollHeight
        })
    })

    socket.on("userExit", name=>{
        divmessages.innerHTML+=`<span class="message"><strong>${name}</strong> has disconnected:(</span><br>`
        divmessages.scrollTop=divmessages.scrollHeight
    })

    inputmessage.addEventListener("keyup", e=>{
        e.preventDefault()
        if(e.code==="Enter" && e.target.value.trim().length>0){
            socket.emit("message", name, e.target.value.trim())
            e.target.value=""
            e.target.focus()
        }
    })

    socket.on("newMessage", (name, message)=>{
        divmessages.innerHTML+=`<span class="message"><strong>${name}</strong> says: <i>${message}</i></span><br>`
        divmessages.scrollTop=divmessages.scrollHeight
    })

})