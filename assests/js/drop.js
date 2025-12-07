
document.addEventListener("DOMContentLoaded", function () {

const storeBtn = document.getElementById("storeBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

storeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownMenu.style.display =
        dropdownMenu.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", (e) => {
    if (!dropdownMenu.contains(e.target) && !storeBtn.contains(e.target)) {
        dropdownMenu.style.display = "none";
    }
});

// Package Popup Functions
function closePackagePopup() {
    const popup = document.getElementById("packagePopup");
    if (popup) {
        popup.classList.remove("show");
        popup.style.display = "none";
    }
}

function openPackagePopup() {
    const popup = document.getElementById("packagePopup");
    if (popup) {
        popup.classList.add("show");
        popup.style.display = "flex";
    }
}

// Close popup when clicking outside
const packagePopup = document.getElementById("packagePopup");
if (packagePopup) {
    packagePopup.addEventListener("click", (e) => {
        if (e.target === packagePopup) {
            closePackagePopup();
        }
    });
}

// Make functions globally available
window.closePackagePopup = closePackagePopup;
window.openPackagePopup = openPackagePopup;

})