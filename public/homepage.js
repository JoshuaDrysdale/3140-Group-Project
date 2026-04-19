document.querySelectorAll(".categories").forEach(btn =>{btn.addEventListener("click", (e) =>{
    console.log(e.target.id);
    window.location.href = "/sub-categories/"+e.target.id+".html";
})});