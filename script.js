// Global variables
let currentWindow = null
let windowZIndex = 100

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeDock()
  initializeTooltips()
  initializeCloseButtons()

  // Open home window by default after a short delay
  setTimeout(() => {
    openWindow("home")
  }, 1000)
})

// Initialize dock functionality
function initializeDock() {
  const dockItems = document.querySelectorAll(".dock-item")

  dockItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault()
      e.stopPropagation()

      const section = this.getAttribute("data-section")
      console.log("Dock item clicked:", section) // Debug log
      handleDockClick(section)
    })

    // Add hover effects
    item.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.2)"
    })

    item.addEventListener("mouseleave", function () {
      if (!this.classList.contains("active")) {
        this.style.transform = "scale(1)"
      }
    })
  })
}

// Handle dock item clicks
function handleDockClick(section) {
  console.log("Handling dock click for:", section) // Debug log

  // Handle different sections
  switch (section) {
    case "github":
      window.open("https://github.com/mahipatel233", "_blank")
      break
    case "linkedin":
      window.open("https://www.linkedin.com/in/mahi23032005/", "_blank")
      break
    default:
      // Close current window if it's different from the clicked one
      if (currentWindow && currentWindow !== section) {
        closeWindow(`${currentWindow}-window`)
      }
      
      // If clicking the same window, do nothing (keep it open)
      if (currentWindow === section) {
        return
      }
      
      // Open the selected window
      setTimeout(() => {
        openWindow(section)
      }, 100) // Small delay to ensure smooth transition
  }
}

// Update active dock item
function updateActiveDockItem(section) {
  const dockItems = document.querySelectorAll(".dock-item")
  dockItems.forEach((item) => {
    item.classList.remove("active")
    item.style.transform = "scale(1)"
  })

  const activeItem = document.querySelector(`[data-section="${section}"]`)
  if (activeItem && section !== "github" && section !== "linkedin") {
    activeItem.classList.add("active")
    activeItem.style.transform = "scale(1.1)"
  }
}

// Open window with animation - Modified to handle single window
function openWindow(windowId) {
  console.log("Opening window:", windowId) // Debug log

  const windowElement = document.getElementById(`${windowId}-window`)
  if (!windowElement) {
    console.error("Window not found:", `${windowId}-window`)
    return
  }

  // Set this as the current window
  currentWindow = windowId

  // Update active dock item
  updateActiveDockItem(windowId)

  // Show the window
  windowElement.style.display = "block"
  windowElement.style.zIndex = ++windowZIndex

  // Center the window
  windowElement.style.top = "50%"
  windowElement.style.left = "50%"
  windowElement.style.transform = "translate(-50%, -50%) scale(0.8)"
  windowElement.style.opacity = "0"

  // Trigger animation after a small delay
  setTimeout(() => {
    windowElement.style.transform = "translate(-50%, -50%) scale(1)"
    windowElement.style.opacity = "1"
    windowElement.classList.add("active")
    console.log("Window opened successfully:", windowId) // Debug log
  }, 50)

  // Add window dragging functionality
  makeWindowDraggable(windowElement)
}

// Close window with animation - Modified
function closeWindow(windowId) {
  console.log("Closing window:", windowId) // Debug log

  const windowElement = document.getElementById(windowId)
  if (!windowElement) return

  const windowName = windowId.replace("-window", "")

  // Clear current window if this is it
  if (currentWindow === windowName) {
    currentWindow = null
    updateActiveDockItem("")
  }

  // Animate window closing
  windowElement.style.transform = "translate(-50%, -50%) scale(0.8)"
  windowElement.style.opacity = "0"

  setTimeout(() => {
    windowElement.style.display = "none"
    windowElement.classList.remove("active")
  }, 300)
}

// Close all windows - Modified for single window mode
function closeAllWindows() {
  const windows = document.querySelectorAll(".window")
  windows.forEach((window) => {
    window.classList.remove("active")
    window.style.transform = "translate(-50%, -50%) scale(0.8)"
    window.style.opacity = "0"
    setTimeout(() => {
      window.style.display = "none"
    }, 300)
  })
  currentWindow = null
  updateActiveDockItem("")
}

// Make window draggable
function makeWindowDraggable(windowElement) {
  const header = windowElement.querySelector(".window-header")
  let isDragging = false
  let currentX = 0
  let currentY = 0
  let initialX = 0
  let initialY = 0

  // Remove existing event listeners to prevent duplicates
  header.removeEventListener("mousedown", dragStart)
  document.removeEventListener("mousemove", drag)
  document.removeEventListener("mouseup", dragEnd)

  header.addEventListener("mousedown", dragStart)
  document.addEventListener("mousemove", drag)
  document.addEventListener("mouseup", dragEnd)

  function dragStart(e) {
    if (e.target.classList.contains("control-btn")) return

    const rect = windowElement.getBoundingClientRect()
    initialX = e.clientX - rect.left
    initialY = e.clientY - rect.top

    if (e.target === header || header.contains(e.target)) {
      isDragging = true
      windowElement.style.zIndex = ++windowZIndex
      header.style.cursor = "grabbing"
    }
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault()
      currentX = e.clientX - initialX
      currentY = e.clientY - initialY

      // Keep window within viewport bounds
      const maxX = window.innerWidth - windowElement.offsetWidth
      const maxY = window.innerHeight - windowElement.offsetHeight

      currentX = Math.max(0, Math.min(currentX, maxX))
      currentY = Math.max(0, Math.min(currentY, maxY))

      windowElement.style.left = currentX + "px"
      windowElement.style.top = currentY + "px"
      windowElement.style.transform = "none"
    }
  }

  function dragEnd() {
    isDragging = false
    header.style.cursor = "grab"
  }
}

// Handle contact form submission
function handleFormSubmit(event) {
  event.preventDefault()
  event.stopPropagation()

  const formData = new FormData(event.target)
  const name = formData.get("name")
  const email = formData.get("email")
  const message = formData.get("message")

  // Simulate form submission
  const submitBtn = event.target.querySelector(".submit-btn")
  const originalText = submitBtn.textContent

  submitBtn.textContent = "Sending..."
  submitBtn.disabled = true

  setTimeout(() => {
    alert(`Thank you ${name}! Your message has been sent successfully.`)
    event.target.reset()
    submitBtn.textContent = originalText
    submitBtn.disabled = false
  }, 2000)
}

// Handle resume download
function downloadResume() {
  // In a real application, this would download the actual resume file
  alert("Resume download would start here. Please add your actual resume PDF link.")
  // window.open('path/to/your/resume.pdf', '_blank');
}

// Add keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // ESC to close current window
  if (e.key === "Escape") {
    if (currentWindow) {
      closeWindow(`${currentWindow}-window`)
    }
  }

  // Alt + number keys for quick navigation
  if (e.altKey) {
    const shortcuts = {
      1: "home",
      2: "about",
      3: "projects",
      4: "contact",
      5: "resume",
    }

    if (shortcuts[e.key]) {
      e.preventDefault()
      handleDockClick(shortcuts[e.key])
    }
  }
})

// Add window minimize/maximize functionality
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("minimize")) {
    e.stopPropagation()
    const window = e.target.closest(".window")
    window.style.transform = "translate(-50%, 100%) scale(0.1)"
    window.style.opacity = "0"
    setTimeout(() => {
      window.style.display = "none"
      currentWindow = null
      updateActiveDockItem("")
    }, 300)
  }

  if (e.target.classList.contains("maximize")) {
    e.stopPropagation()
    const window = e.target.closest(".window")
    if (window.classList.contains("maximized")) {
      window.classList.remove("maximized")
      window.style.width = ""
      window.style.height = ""
      window.style.top = "50%"
      window.style.left = "50%"
      window.style.transform = "translate(-50%, -50%) scale(1)"
    } else {
      window.classList.add("maximized")
      window.style.width = "95%"
      window.style.height = "95%"
      window.style.top = "2.5%"
      window.style.left = "2.5%"
      window.style.transform = "none"
    }
  }
})

// Initialize tooltips for dock items
function initializeTooltips() {
  const dockItems = document.querySelectorAll(".dock-item")

  dockItems.forEach((item) => {
    const tooltip = document.createElement("div")
    tooltip.className = "tooltip"
    tooltip.textContent = item.getAttribute("title")
    tooltip.style.cssText = `
            position: absolute;
            left: 70px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1001;
            border: 1px solid rgba(255, 255, 255, 0.2);
        `

    item.appendChild(tooltip)

    item.addEventListener("mouseenter", () => {
      tooltip.style.opacity = "1"
    })

    item.addEventListener("mouseleave", () => {
      tooltip.style.opacity = "0"
    })
  })
}

// Prevent window from closing when clicking inside it
document.addEventListener("click", (e) => {
  if (e.target.closest(".window")) {
    e.stopPropagation()
  }
})

// Add event listeners for all close buttons
function initializeCloseButtons() {
  const closeButtons = document.querySelectorAll(".control-btn.close")

  closeButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()
      e.stopPropagation()

      const windowElement = this.closest(".window")
      if (windowElement) {
        closeWindow(windowElement.id)
      }
    })
  })
}

// Show welcome message when no windows are open
function showWelcomeMessage() {
  if (!currentWindow) {
    // You can add a welcome screen here if needed
    console.log("No windows open - showing desktop")
  }
}
