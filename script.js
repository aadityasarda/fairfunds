const nav = document.querySelector('.container')
fetch('./header.html')
.then(res=>res.text())
.then(data=>{
    nav.innerHTML = data
})