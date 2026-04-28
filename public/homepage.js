// homepage.js
document.addEventListener("DOMContentLoaded", async () => {
  const statusMessage = document.getElementById("status-message");
  
  statusMessage.textContent = "Loading categories...";
  
  try{
    const res = await fetch("/api/categories");

    if(!res.ok){
      throw new Error("Failed Request"); 
    }
  const categories = await res.json();
  console.log(categories)

  const container = document.getElementById("category-container");

  container.innerHTML = categories.map(cat => `
    <button id="${cat.name.toLowerCase()}" data-id="${cat.id}">
      ${cat.name}
    </button>
  `).join("");

  attachButtonListeners();
  } catch(error){
    console.error(error);
    statusMessage.textContent = "Unable to load categories right now."; 
  }
});

function attachButtonListeners() {
    document.querySelectorAll("#category-container button").forEach(btn => {
        btn.addEventListener("click", (e) => {
            // Get the name of the button (e.g., "Pencils")
            const categoryName = e.target.innerText.trim().toLowerCase();
            
            // Redirect the user to the specific page
            // Make sure you have a folder named 'sub-categories' 
            // and your files are named exactly like: pencils.html, pens.html, etc.
            window.location.href = `/sub-categories/${categoryName}.html`;
        });
    });
}