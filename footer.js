const foot = document.querySelector('.footer')
fetch('./footer.html')
.then(res=>res.text())
.then(data=>{
    foot.innerHTML = data;
})