// App JS for Sundar's Space Portfolio

document.addEventListener("DOMContentLoaded", () => {
  // Initialize systems
  initMobileMenu();
  initSpaceCanvas();
  initCustomCursor();
  initProjectTabs();
  initTodoApp();
  initCalculator();
  initTerminal();
  initPhoneScroll();
});

/* =========================================================================
   1. Mobile Menu Toggling
   ========================================================================= */
function initMobileMenu() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("show");
      });
    });
  }

  // Active navigation link highlighting on scroll
  const sections = document.querySelectorAll("section");
  const navItems = document.querySelectorAll(".nav-links a");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });

    navItems.forEach(item => {
      item.classList.remove("active");
      if (item.getAttribute("href") === `#${current}`) {
        item.classList.add("active");
      }
    });
  });
}

function initPhoneScroll() {
  const phoneLinks = document.querySelectorAll(".phone-link");
  phoneLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
        // Focus the name input field in the contact form to encourage messaging
        setTimeout(() => {
          const nameInput = document.getElementById("contact-name");
          if (nameInput) nameInput.focus();
        }, 800);
      }
    });
  });
}

/* =========================================================================
   2. Space Solar System Background Canvas
   ========================================================================= */
function initSpaceCanvas() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let stars = [];
  let planets = [];
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Resize handler
  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    generateStars();
  });

  // Generate background stars
  function generateStars() {
    stars = [];
    const count = Math.floor((width * height) / 4000); // Proportional to screen size
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5,
        opacity: Math.random(),
        twinkleSpeed: 0.005 + Math.random() * 0.015,
        direction: Math.random() > 0.5 ? 1 : -1
      });
    }
  }

  // Define planets orbiting a central Sun
  function generatePlanets() {
    planets = [
      // Mercury-like
      {
        name: "Mercury",
        orbitRadius: 100,
        radius: 4,
        color: "#9e9e9e",
        speed: 0.015,
        angle: Math.random() * Math.PI * 2
      },
      // Venus-like
      {
        name: "Venus",
        orbitRadius: 160,
        radius: 8,
        color: "#e0a96d",
        speed: 0.01,
        angle: Math.random() * Math.PI * 2
      },
      // Earth-like
      {
        name: "Earth",
        orbitRadius: 240,
        radius: 9,
        color: "#00b0ff",
        speed: 0.007,
        angle: Math.random() * Math.PI * 2,
        hasMoon: true,
        moonAngle: 0,
        moonSpeed: 0.08
      },
      // Mars-like
      {
        name: "Mars",
        orbitRadius: 320,
        radius: 7,
        color: "#ff5252",
        speed: 0.005,
        angle: Math.random() * Math.PI * 2
      },
      // Jupiter-like
      {
        name: "Jupiter",
        orbitRadius: 420,
        radius: 18,
        color: "#ffb74d",
        speed: 0.002,
        angle: Math.random() * Math.PI * 2,
        hasRings: true
      }
    ];
  }

  generateStars();
  generatePlanets();

  function animate() {
    // Semi-transparent background clear for minor celestial trailing effect
    ctx.fillStyle = "rgba(3, 7, 18, 0.25)";
    ctx.fillRect(0, 0, width, height);

    // Draw background stars
    stars.forEach(star => {
      star.opacity += star.twinkleSpeed * star.direction;
      if (star.opacity >= 1) {
        star.opacity = 1;
        star.direction = -1;
      } else if (star.opacity <= 0.1) {
        star.opacity = 0.1;
        star.direction = 1;
      }
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    });

    // Orbital center (Offset to left side on desktops, center on mobile)
    const centerX = width > 992 ? width * 0.25 : width / 2;
    const centerY = height / 2;

    // Draw Central Sun
    const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 45);
    sunGradient.addColorStop(0, "#fffde7");
    sunGradient.addColorStop(0.2, "#ffd54f");
    sunGradient.addColorStop(0.8, "rgba(255, 112, 67, 0.2)");
    sunGradient.addColorStop(1, "rgba(255, 112, 67, 0)");
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 45, 0, Math.PI * 2);
    ctx.fillStyle = sunGradient;
    ctx.fill();

    // Draw Planets and Orbits
    planets.forEach(planet => {
      // Draw Orbit Lines
      ctx.beginPath();
      ctx.arc(centerX, centerY, planet.orbitRadius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0, 229, 255, 0.04)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Update position angle
      planet.angle += planet.speed;

      // Coordinate offset
      const px = centerX + Math.cos(planet.angle) * planet.orbitRadius;
      const py = centerY + Math.sin(planet.angle) * planet.orbitRadius;

      // Draw glowing planetary body
      ctx.shadowBlur = 10;
      ctx.shadowColor = planet.color;
      
      ctx.beginPath();
      ctx.arc(px, py, planet.radius, 0, Math.PI * 2);
      ctx.fillStyle = planet.color;
      ctx.fill();
      
      // Reset shadow mapping
      ctx.shadowBlur = 0;

      // Draw planetary details (Rings for Jupiter)
      if (planet.hasRings) {
        ctx.beginPath();
        ctx.ellipse(px, py, planet.radius * 1.6, planet.radius * 0.4, -0.2, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 183, 77, 0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw minor orbiting body (Moon for Earth)
      if (planet.hasMoon) {
        planet.moonAngle += planet.moonSpeed;
        const mx = px + Math.cos(planet.moonAngle) * (planet.radius * 1.8);
        const my = py + Math.sin(planet.moonAngle) * (planet.radius * 1.8);
        ctx.beginPath();
        ctx.arc(mx, my, planet.radius * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = "#e0e0e0";
        ctx.fill();
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* =========================================================================
   3. Custom Rocket Cursor
   ========================================================================= */
function initCustomCursor() {
  const cursor = document.getElementById("custom-cursor");
  if (!cursor) return;

  // Track coordinates
  let mouseX = 0, mouseY = 0;   // Where the mouse is
  let cursorX = 0, cursorY = 0; // Where the rocket icon is (interpolated)
  let lastX = 0, lastY = 0;     // Last frame position
  let isMoving = false;
  let moveTimeout;

  // Show custom cursor on mouse movement
  document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (cursor.style.display !== "block") {
      cursor.style.display = "block";
      cursorX = mouseX;
      cursorY = mouseY;
      lastX = mouseX;
      lastY = mouseY;
    }

    isMoving = true;
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(() => {
      isMoving = false;
    }, 100);
  });

  // Hide cursor when leaving page
  document.addEventListener("mouseleave", () => {
    cursor.style.display = "none";
  });

  // Animate custom cursor position with interpolation (lerp)
  function updateCursor() {
    // Interpolation for smooth gliding behavior
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    cursorX += dx * 0.15;
    cursorY += dy * 0.15;

    // Calculate motion vector and rotation angle
    const vx = cursorX - lastX;
    const vy = cursorY - lastY;
    const speed = Math.sqrt(vx * vx + vy * vy);

    let angle = 0;
    if (speed > 0.5) {
      // Calculate angle in degrees, add 90 deg offset to match vertical SVG structure
      angle = Math.atan2(vy, vx) * (180 / Math.PI) + 90;
    } else {
      angle = 0; // point upward when static
    }

    // Apply translate and rotation transformations
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) rotate(${angle}deg)`;

    // Keep track of positions
    lastX = cursorX;
    lastY = cursorY;

    requestAnimationFrame(updateCursor);
  }

  updateCursor();
}

/* =========================================================================
   4. Project Tabs Navigation
   ========================================================================= */
function initProjectTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");

      tabBtns.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      const targetContent = document.getElementById(tabId);
      if (targetContent) {
        targetContent.classList.add("active");
      }
      
      // Auto-focus terminal if the bank simulation is selected
      if (tabId === "tab-bank") {
        setTimeout(() => {
          const termInput = document.getElementById("terminal-input");
          if (termInput) termInput.focus();
        }, 100);
      }
    });
  });

  // Toggle C source code viewer
  const cToggleBtn = document.getElementById("toggle-c-code-btn");
  const codeViewer = document.getElementById("c-code-viewer");

  if (cToggleBtn && codeViewer) {
    cToggleBtn.addEventListener("click", () => {
      codeViewer.classList.toggle("hidden");
      if (codeViewer.classList.contains("hidden")) {
        cToggleBtn.innerHTML = '<i class="fas fa-code"></i> Show C Code';
      } else {
        cToggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Hide C Code';
      }
    });
  }
}

/* =========================================================================
   5. Static Todo App Logic (LocalStorage)
   ========================================================================= */
function initTodoApp() {
  const todoInput = document.getElementById("todo-task-input");
  const todoAddBtn = document.getElementById("todo-add-btn");
  const todoList = document.getElementById("todo-list-container");

  if (!todoInput || !todoAddBtn || !todoList) return;

  let todos = JSON.parse(localStorage.getItem("portfolio_todos")) || [
    { id: 1, task: "Solve 5 LeetCode DSA Problems", completed: true },
    { id: 2, task: "Implement Spring Security JWT authorization", completed: false },
    { id: 3, task: "Revise Java Multi-threading structures", completed: false }
  ];

  function saveTodos() {
    localStorage.setItem("portfolio_todos", JSON.stringify(todos));
    renderTodos();
  }

  function renderTodos() {
    todoList.innerHTML = "";
    if (todos.length === 0) {
      todoList.innerHTML = '<div class="todo-empty">No missions scheduled. Add one above!</div>';
      return;
    }

    todos.forEach(todo => {
      const todoItem = document.createElement("div");
      todoItem.className = "todo-item";
      todoItem.innerHTML = `
        <div class="todo-left">
          <input type="checkbox" ${todo.completed ? "checked" : ""} data-id="${todo.id}" class="todo-check" />
          <span class="${todo.completed ? "completed" : ""}">${todo.task}</span>
        </div>
        <div class="todo-actions">
          <button class="btn-edit" data-id="${todo.id}" title="Edit Task"><i class="fas fa-edit"></i></button>
          <button class="btn-delete" data-id="${todo.id}" title="Delete Task"><i class="fas fa-trash"></i></button>
        </div>
      `;
      todoList.appendChild(todoItem);
    });

    // Wire up events
    todoList.querySelectorAll(".todo-check").forEach(chk => {
      chk.addEventListener("change", (e) => {
        const id = parseInt(e.target.getAttribute("data-id"));
        const todo = todos.find(t => t.id === id);
        if (todo) {
          todo.completed = e.target.checked;
          saveTodos();
        }
      });
    });

    todoList.querySelectorAll(".btn-delete").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const button = e.target.closest("button");
        const id = parseInt(button.getAttribute("data-id"));
        todos = todos.filter(t => t.id !== id);
        saveTodos();
      });
    });

    todoList.querySelectorAll(".btn-edit").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const button = e.target.closest("button");
        const id = parseInt(button.getAttribute("data-id"));
        const todo = todos.find(t => t.id === id);
        if (todo) {
          const newTask = prompt("Edit task payload:", todo.task);
          if (newTask && newTask.trim() !== "") {
            todo.task = newTask.trim();
            saveTodos();
          }
        }
      });
    });
  }

  todoAddBtn.addEventListener("click", () => {
    const text = todoInput.value.trim();
    if (text) {
      todos.push({
        id: Date.now(),
        task: text,
        completed: false
      });
      todoInput.value = "";
      saveTodos();
    }
  });

  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      todoAddBtn.click();
    }
  });

  renderTodos();
}

/* =========================================================================
   6. Calculator Engine
   ========================================================================= */
let calcDisplayVal = "0";

function initCalculator() {
  // Bind display update
  updateCalcDisplay();
}

function updateCalcDisplay() {
  const display = document.getElementById("calc-display");
  if (display) {
    display.textContent = calcDisplayVal;
  }
}

window.clearCalc = function() {
  calcDisplayVal = "0";
  updateCalcDisplay();
};

window.backspaceCalc = function() {
  if (calcDisplayVal.length > 1) {
    calcDisplayVal = calcDisplayVal.slice(0, -1);
  } else {
    calcDisplayVal = "0";
  }
  updateCalcDisplay();
};

window.inputDigit = function(digit) {
  if (calcDisplayVal === "0") {
    calcDisplayVal = digit;
  } else {
    calcDisplayVal += digit;
  }
  updateCalcDisplay();
};

window.inputDecimal = function(dot) {
  // Avoid duplicate decimals in a single number block
  const segments = calcDisplayVal.split(/[\+\-\*\/%]/);
  const currentSegment = segments[segments.length - 1];
  if (!currentSegment.includes(dot)) {
    calcDisplayVal += dot;
    updateCalcDisplay();
  }
};

window.inputOperator = function(op) {
  const lastChar = calcDisplayVal.slice(-1);
  if (["+", "-", "*", "/", "%"].includes(lastChar)) {
    // Replace last operator
    calcDisplayVal = calcDisplayVal.slice(0, -1) + op;
  } else {
    calcDisplayVal += op;
  }
  updateCalcDisplay();
};

window.evaluateCalc = function() {
  try {
    // Simple expression evaluation safely using Math operations
    // Replacing UI display times character (if present, though we write * in JS)
    const result = eval(calcDisplayVal);
    if (result === undefined || isNaN(result) || !isFinite(result)) {
      calcDisplayVal = "Error";
    } else {
      calcDisplayVal = String(Number(result.toFixed(6))); // round to prevent floating point inaccuracies
    }
  } catch (e) {
    calcDisplayVal = "Error";
  }
  updateCalcDisplay();
};

/* =========================================================================
   7. C Banking Simulator (JavaScript Console Terminal Emulator)
   ========================================================================= */
function initTerminal() {
  const termInput = document.getElementById("terminal-input");
  const termBody = document.getElementById("terminal-body");
  const termLog = document.getElementById("terminal-log");

  if (!termInput || !termBody || !termLog) return;

  // Mock accounts ledger state
  let bankAccounts = [
    { accountNumber: 1001, name: "Sundar", balance: 5000.00 }
  ];
  let accountCount = 2; // Next count index

  // Terminal States
  // 'MENU' | 'CREATE_NAME' | 'DEPOSIT_ID' | 'DEPOSIT_AMOUNT' | 'WITHDRAW_ID' | 'WITHDRAW_AMOUNT' | 'BALANCE_ID'
  let termState = 'MENU';
  let tempAccountId = null; // Buffer to hold account target between inputs

  // Listen for terminal click to focus input
  termBody.addEventListener("click", () => {
    termInput.focus();
  });

  // Form submission command
  termInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const cmd = termInput.value.trim();
      termInput.value = "";
      
      // Echo user entry
      printRow(`<span class="prompt">c:\\users\\sundar\\bank&gt;</span> ${cmd}`, "text-green");
      
      processCommand(cmd);
      termBody.scrollTop = termBody.scrollHeight; // Scroll terminal to bottom
    }
  });

  function printRow(text, className = "") {
    const row = document.createElement("div");
    row.className = "terminal-row " + className;
    row.innerHTML = text;
    termLog.appendChild(row);
  }

  function printMenu() {
    printRow("---------------------------------------------------");
    printRow("1. Create Account");
    printRow("2. Deposit Money");
    printRow("3. Withdraw Money");
    printRow("4. Check Balance");
    printRow("5. Exit Console");
    printRow("---------------------------------------------------");
    printRow("Enter option number (1-5):");
  }

  function processCommand(val) {
    if (termState === 'MENU') {
      switch (val) {
        case '1':
          termState = 'CREATE_NAME';
          printRow("Executing function createAccount()...");
          printRow("Enter owner name:");
          break;
        case '2':
          termState = 'DEPOSIT_ID';
          printRow("Executing function deposit()...");
          printRow("Enter Account ID:");
          break;
        case '3':
          termState = 'WITHDRAW_ID';
          printRow("Executing function withdraw()...");
          printRow("Enter Account ID:");
          break;
        case '4':
          termState = 'BALANCE_ID';
          printRow("Executing function checkBalance()...");
          printRow("Enter Account ID:");
          break;
        case '5':
          printRow("Executing exit(0)... Disconnecting session.");
          printRow("Terminal terminated. Reload page or click tab to reopen.");
          termInput.disabled = true;
          break;
        default:
          printRow("Error: Invalid choice. Choose a standard protocol (1-5).", "text-red");
          printMenu();
          break;
      }
    } 
    // Create Account Name input
    else if (termState === 'CREATE_NAME') {
      if (!val) {
        printRow("Error: Name cannot be empty. Re-enter owner name:", "text-red");
        return;
      }
      const newId = 1000 + accountCount;
      bankAccounts.push({
        accountNumber: newId,
        name: val,
        balance: 500.0 // Starting minimum balance
      });
      accountCount++;
      printRow(`Account successfully compiled inside ledger!`, "text-green");
      printRow(`Account ID: <strong>${newId}</strong>`);
      printRow(`Owner Name: ${val}`);
      printRow(`Initial Balance: $500.00 (Minimum Required)`);
      termState = 'MENU';
      printMenu();
    } 
    // Deposit: Account ID check
    else if (termState === 'DEPOSIT_ID') {
      const id = parseInt(val);
      const acc = bankAccounts.find(a => a.accountNumber === id);
      if (!acc) {
        printRow(`Error: Account #${val} not found. Returning to Main Menu.`, "text-red");
        termState = 'MENU';
        printMenu();
      } else {
        tempAccountId = id;
        termState = 'DEPOSIT_AMOUNT';
        printRow(`Account verified. Owner: ${acc.name}. Current Balance: $${acc.balance.toFixed(2)}`);
        printRow("Enter Deposit Amount ($):");
      }
    } 
    // Deposit: Amount input
    else if (termState === 'DEPOSIT_AMOUNT') {
      const amt = parseFloat(val);
      if (isNaN(amt) || amt <= 0) {
        printRow("Error: Deposit amount must be a positive number. Re-enter amount:", "text-red");
        return;
      }
      const acc = bankAccounts.find(a => a.accountNumber === tempAccountId);
      acc.balance += amt;
      printRow(`Success: $${amt.toFixed(2)} deposited.`, "text-green");
      printRow(`New Ledger Balance: $${acc.balance.toFixed(2)}`);
      tempAccountId = null;
      termState = 'MENU';
      printMenu();
    } 
    // Withdraw: Account ID check
    else if (termState === 'WITHDRAW_ID') {
      const id = parseInt(val);
      const acc = bankAccounts.find(a => a.accountNumber === id);
      if (!acc) {
        printRow(`Error: Account #${val} not found. Returning to Main Menu.`, "text-red");
        termState = 'MENU';
        printMenu();
      } else {
        tempAccountId = id;
        termState = 'WITHDRAW_AMOUNT';
        printRow(`Account verified. Owner: ${acc.name}. Current Balance: $${acc.balance.toFixed(2)}`);
        printRow("Enter Withdrawal Amount ($):");
      }
    } 
    // Withdraw: Amount check
    else if (termState === 'WITHDRAW_AMOUNT') {
      const amt = parseFloat(val);
      if (isNaN(amt) || amt <= 0) {
        printRow("Error: Withdrawal amount must be a positive number. Re-enter amount:", "text-red");
        return;
      }
      const acc = bankAccounts.find(a => a.accountNumber === tempAccountId);
      if (acc.balance - amt < 500.00) {
        printRow(`Transaction Aborted: Insufficient funds. Accounts must maintain $500.00 minimum balance. Limit: $${(acc.balance - 500.00).toFixed(2)}.`, "text-red");
        printRow("Re-enter smaller amount (or type Menu choice after entering 0):");
        return;
      }
      acc.balance -= amt;
      printRow(`Success: $${amt.toFixed(2)} withdrawn.`, "text-green");
      printRow(`Remaining Balance: $${acc.balance.toFixed(2)}`);
      tempAccountId = null;
      termState = 'MENU';
      printMenu();
    } 
    // Check Balance: Account ID check
    else if (termState === 'BALANCE_ID') {
      const id = parseInt(val);
      const acc = bankAccounts.find(a => a.accountNumber === id);
      if (!acc) {
        printRow(`Error: Account #${val} not found.`, "text-red");
      } else {
        printRow("---------------------------------------------------");
        printRow(`Ledger balance query for Account #${id}:`);
        printRow(`Account Owner: ${acc.name}`);
        printRow(`Available Balance: <strong>$${acc.balance.toFixed(2)}</strong>`, "text-green");
        printRow("---------------------------------------------------");
      }
      termState = 'MENU';
      printMenu();
    }
  }
}

/* =========================================================================
   8. Portfolio Contact Form Real Transaction
   ========================================================================= */
window.handleContactSubmit = async function(event) {
  event.preventDefault();
  
  const name = document.getElementById("contact-name").value.trim();
  const email = document.getElementById("contact-email").value.trim();
  const subject = document.getElementById("contact-subject").value.trim();
  const message = document.getElementById("contact-message").value.trim();
  const feedback = document.getElementById("form-feedback-message");

  if (!name || !email || !subject || !message) {
    feedback.className = "error";
    feedback.classList.remove("hidden");
    feedback.textContent = "Please fill in all transmission details.";
    return;
  }

  feedback.className = "success";
  feedback.classList.remove("hidden");
  feedback.textContent = "Opening your email client to transmit the signal...";

  try {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      email,
      subject,
      message
    })
  });

  const data = await response.json();

  if (response.ok) {
    feedback.textContent = "Transmission successful! Message received. 🚀";
    feedback.classList.remove("hidden");

    document
      .getElementById("portfolio-contact-form")
      .reset();
  } else {
    feedback.textContent =
      data.message || "Transmission failed. Please try again.";
    feedback.classList.remove("hidden");
  }

} catch (error) {
  console.error("Contact form error:", error);

  feedback.textContent =
    "Unable to connect to the transmission server.";
  feedback.classList.remove("hidden");
}
};
