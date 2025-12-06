/* ===== SIDEBAR SUBMENU ===== */
function initSubmenu() {
    document.querySelectorAll(".has-submenu").forEach(submenuParent => {
        const menuItem = submenuParent.querySelector(".menu-item");
        if (!menuItem) return;
        
        menuItem.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle open class on parent
            submenuParent.classList.toggle("open");
            
            // Close other submenus
            document.querySelectorAll(".has-submenu").forEach(otherMenu => {
                if (otherMenu !== submenuParent && otherMenu.classList.contains("open")) {
                    otherMenu.classList.remove("open");
                }
            });
        });
        
        // Prevent link navigation if href is #
        const link = menuItem.querySelector("a");
        if (link && link.getAttribute("href") === "#") {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSubmenu);
} else {
    initSubmenu();
}

/* ===== WEEKLY CHART ===== */
const weeklyData = {
    labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    values: [30,45,50,40,60,20,35]
};

const wtx = document.getElementById("weeklyChart");
if (wtx) {
    const ctxWeekly = wtx.getContext("2d");
    new Chart(ctxWeekly, {
        type: "bar",
        data: {
            labels: weeklyData.labels,
            datasets: [{
                data: weeklyData.values,
                backgroundColor: (ctx) => {
                    const g = ctxWeekly.createLinearGradient(0,0,0,200);
                    g.addColorStop(0,"#ffd24a");
                    g.addColorStop(1,"#ff9f3a");
                    return g;
                },
                borderRadius: 10
            }]
        },
        options: {
            plugins: {legend: {display:false}},
            scales: {x:{grid:{display:false}}}
        }
    });
}

/* ===== MONTHLY CHART ===== */
const monthlyData = {
    labels: Array.from({length:31}, (_,i)=>i+1),
    values: [
        12,15,17,18,20,22,23,21,20,
        18,17,16,15,17,20,25,28,30,
        32,34,36,38,37,35,30,28,27,26,25,24,23
    ]
};

const mtx = document.getElementById("monthlyChart");
if (mtx) {
    const ctxMonthly = mtx.getContext("2d");
    let gradient = ctxMonthly.createLinearGradient(0,0,0,300);
    gradient.addColorStop(0,"rgba(255,80,80,0.35)");
    gradient.addColorStop(1,"rgba(255,80,80,0)");

    new Chart(ctxMonthly, {
        type: "line",
        data: {
            labels: monthlyData.labels,
            datasets: [{
                data: monthlyData.values,
                borderColor: "#ff5555",
                backgroundColor: gradient,
                borderWidth: 3,
                tension: 0.5,
                pointRadius: 0
            }]
        },
        options: {
            plugins: {legend:{display:false}},
            scales:{
                x:{grid:{display:false}},
                y:{grid:{color:"rgba(180,180,180,0.15)"}}
            }
        }
    });
}

/* ===== DROPDOWN MENU STORE ===== */
const storeBtn = document.getElementById("storeBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

if (storeBtn && dropdownMenu) {
    storeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", (e) => {
        if (!dropdownMenu.contains(e.target) && !storeBtn.contains(e.target)) {
            dropdownMenu.style.display = "none";
        }
    });
}

/* ===== ROW ACTION MENU ===== */
const rowMenu = document.getElementById("rowMenu");

document.querySelectorAll(".actions").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const rect = btn.getBoundingClientRect();
        rowMenu.style.top = (rect.bottom + window.scrollY) + "px";
        rowMenu.style.left = (rect.left + window.scrollX - 95) + "px"; // RTL adjustment
        rowMenu.style.display = "block";
    });
});

document.addEventListener("click", () => {
    if(rowMenu) rowMenu.style.display = "none";
});

/* ===== MOBILE SIDEBAR TOGGLE & OVERLAY ===== */
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const body = document.body;
const menuBtn = document.querySelector(".menu-btn");

if (menuToggle && sidebar) {
    let isMobile = window.innerWidth <= 996;
    let handleOutsideClick = null;

    // Function to toggle sidebar
    const toggleSidebar = (open) => {
        if (open) {
            sidebar.classList.add("sidebar-open");
            body.classList.add("sidebar-open");
            menuToggle.checked = true;
        } else {
            sidebar.classList.remove("sidebar-open");
            body.classList.remove("sidebar-open");
            menuToggle.checked = false;
        }
    };

    // Toggle sidebar class and body class for overlay
    menuToggle.addEventListener("change", () => {
        toggleSidebar(menuToggle.checked);
    });

    // Close sidebar when clicking outside (on mobile)
    handleOutsideClick = (e) => {
        // If sidebar is open and click is outside sidebar and menu button
        if (menuToggle.checked && 
            !sidebar.contains(e.target) && 
            !e.target.closest(".menu-btn") &&
            !e.target.closest("#menuToggle") &&
            !e.target.closest(".profile-avatar")) {
            toggleSidebar(false);
        }
    };

    // Close sidebar when clicking on overlay
    const overlayClick = (e) => {
        if (e.target === body.querySelector("::before") || 
            (menuToggle.checked && e.target.classList.contains("sidebar-overlay"))) {
            toggleSidebar(false);
        }
    };

    // Handle window resize
    const handleResize = () => {
        const wasMobile = isMobile;
        isMobile = window.innerWidth <= 996;

        if (!isMobile && wasMobile) {
            // Switched to desktop - reset sidebar
            toggleSidebar(false);
            if (handleOutsideClick) {
                document.removeEventListener("click", handleOutsideClick);
            }
        } else if (isMobile && !wasMobile) {
            // Switched to mobile - add listeners
            document.addEventListener("click", handleOutsideClick);
        }
    };

    // Initialize based on screen size
    if (isMobile) {
        document.addEventListener("click", handleOutsideClick);
    }

    // Add resize listener with debounce
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 150);
    });

    // Prevent body scroll when sidebar is open (mobile)
    const observer = new MutationObserver(() => {
        if (body.classList.contains("sidebar-open") && isMobile) {
            body.style.overflow = "hidden";
        } else {
            body.style.overflow = "";
        }
    });

    observer.observe(body, {
        attributes: true,
        attributeFilter: ["class"]
    });

    // Add smooth scroll behavior
    if (menuBtn) {
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    }
}