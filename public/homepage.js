// homepage.js

document.addEventListener('DOMContentLoaded', async () => {
    await loadCategories();
});

async function loadCategories() {
    const container = document.getElementById("category-container");

    // Fetch categories
    const { data: categories, error } = await window.supabase
        .from('categories')
        .select('*');

    if (error) {
        console.error("Error loading categories:", error);
        return;
    }

    // Populate buttons
    container.innerHTML = categories.map(cat => `
        <button id="${cat.name.toLowerCase()}" data-id="${cat.id}">
            ${cat.name}
        </button>
    `).join('');

    // Attach listeners
    attachButtonListeners();
}

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