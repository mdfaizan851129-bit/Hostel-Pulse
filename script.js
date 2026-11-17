/* = DATA = */

let role = "student";

let complaints = [
    { id:1, title:"No water in bathrooms of Block 32", category:"Water Supply", sub:"Bathroom", block:"Block 32", priority:"Critical", status:"Pending", affected:180, assigned:"Maintenance Team" },
    { id:2, title:"Mess food quality is poor", category:"Mess", sub:"Food Quality", block:"Block 18", priority:"High", status:"In Progress", affected:120, assigned:"Mess Team" },
    { id:3, title:"Wi-Fi not working", category:"Internet", sub:"Wi-Fi", block:"Block 21", priority:"Medium", status:"Resolved", affected:45, assigned:"IT Team" },
    { id:4, title:"Room cleaning required", category:"Cleaning", sub:"Room Cleaning", block:"Block 10", priority:"Low", status:"Pending", affected:4, assigned:"Cleaning Team" }
];


/* = NAVIGATION = */

function showLogin() {
    document.getElementById("landing").classList.add("hidden");
    document.getElementById("login").classList.remove("hidden");
}

function selectRole(selected, button) {
    role = selected;
    document.querySelectorAll(".roles button").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    document.getElementById("email").value = selected + "@hostelpulse.demo";
}

function login() {
    document.getElementById("login").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");

    document.getElementById("roleName").innerText =
        role === "student" ? "STUDENT"
        : role === "admin" ? "ADMIN / WARDEN"
        : "MAINTENANCE / MESS STAFF";

    dashboardHome();
    showToast("Welcome to HOSTELPULSE!");
}

function logout() {
    document.getElementById("dashboard").classList.add("hidden");
    document.getElementById("landing").classList.remove("hidden");
}


/* = DASHBOARD = */

function dashboardHome() {
    if (role === "student") {
        studentDashboard();
    } else if (role === "admin") {
        adminDashboard();
    } else {
        staffDashboard();
    }
}


/* = STUDENT DASHBOARD = */

function studentDashboard() {

    document.getElementById("dashboardContent").innerHTML = `

<div class="page-head">
    <div>
        <div class="hero-tag">HOSTELPULSE</div>
        <h1>Student Dashboard</h1>
        <p>Track hostel services and make your voice count.</p>
    </div>
    <div class="active-status">● Service Pulse Active</div>
</div>

<div class="stats">
    <div class="stat"><p>MY ISSUES</p><h2>${complaints.length}</h2></div>
    <div class="stat"><p>PENDING</p><h2>${complaints.filter(c => c.status === "Pending").length}</h2></div>
    <div class="stat"><p>IN PROGRESS</p><h2>${complaints.filter(c => c.status === "In Progress").length}</h2></div>
    <div class="stat"><p>RESOLVED</p><h2>${complaints.filter(c => c.status === "Resolved").length}</h2></div>
</div>

<div class="grid">

    <div class="panel">
        <div class="panel-title">
            <h3>Report an Issue</h3>
            <span> AI Powered</span>
        </div>

        <textarea id="complaintText" placeholder="Example: No water in bathrooms of Block 32"></textarea>

        <div class="form-row">
            <select id="severity">
                <option>Low</option>
                <option>Medium</option>
                <option selected>High</option>
                <option>Critical</option>
            </select>

            <select id="block">
                <option>Block 32</option>
                <option>Block 18</option>
                <option>Block 21</option>
                <option>Block 10</option>
                <option>Block 07</option>
            </select>
        </div>

        <button class="primary" onclick="submitComplaint()">＋ Submit Complaint</button>

        <div id="aiResult"></div>
    </div>

    <div class="panel">
        <div class="panel-title"><h3>Recent Issues</h3></div>
        ${complaints.map(c => complaintHTML(c)).join("")}
    </div>

</div>
`;
}


/* =AI CLASSIFICATION= */

function classify(text, severity) {

    let t = text.toLowerCase();

    let category = "General";
    let sub = "Other";

    if (t.includes("water") || t.includes("tap") || t.includes("bathroom")) {
        category = "Water Supply";
        sub = "Bathroom";
    }
    else if (t.includes("food") || t.includes("mess") || t.includes("taste") || t.includes("meal")) {
        category = "Mess";
        sub = "Food Quality";
    }
    else if (t.includes("wifi") || t.includes("wi-fi") || t.includes("internet")) {
        category = "Internet";
        sub = "Wi-Fi";
    }
    else if (t.includes("clean") || t.includes("garbage") || t.includes("dirty")) {
        category = "Cleaning";
        sub = "Cleanliness";
    }
    else if (t.includes("electric") || t.includes("fan") || t.includes("light")) {
        category = "Electricity";
        sub = "Electrical";
    }

    let priority = severity;

    if (category === "Water Supply" && severity !== "Low") {
        priority = "Critical";
    }

    return {
        category,
        sub,
        priority,
        sentiment: "Negative",
        impact:
            priority === "Critical" ? "Very High"
            : priority === "High" ? "High"
            : "Medium"
    };
}


/* = SUBMIT COMPLAINT = */

function submitComplaint() {

    let text = document.getElementById("complaintText").value;
    let severity = document.getElementById("severity").value;
    let block = document.getElementById("block").value;

    if (!text.trim()) {
        showToast("Please describe the issue.");
        return;
    }

    let ai = classify(text, severity);

    let newComplaint = {
        id: Date.now(),
        title: text,
        category: ai.category,
        sub: ai.sub,
        block: block,
        priority: ai.priority,
        status: "Pending",
        affected: 1,
        assigned: "Unassigned"
    };

    complaints.unshift(newComplaint);

    document.getElementById("complaintText").value = "";

    document.getElementById("aiResult").innerHTML = `

<div class="ai">
    <div class="ai-title"> AI CLASSIFICATION COMPLETE</div>

    <div class="ai-grid">
        <span>Category<b>${ai.category}</b></span>
        <span>Subcategory<b>${ai.sub}</b></span>
        <span>Sentiment<b>${ai.sentiment}</b></span>
        <span>Estimated Impact<b>${ai.impact}</b></span>
        <span>Priority
            <b><span class="priority ${ai.priority.toLowerCase()}">${ai.priority}</span></b>
        </span>
    </div>
</div>
`;

    showToast("Complaint submitted successfully!");

    studentDashboard();
}


/* = COMPLAINT HTML = */

function complaintHTML(c) {
    return `
<div class="complaint">
    <div class="complaint-info">
        <b>${c.title}</b>
        <small>${c.block} • ${c.category} • ${c.assigned}</small>
    </div>
    <span class="priority ${c.priority.toLowerCase()}">${c.priority}</span>
</div>
`;
}


/* = ADMIN DASHBOARD = */

function adminDashboard() {

    document.getElementById("dashboardContent").innerHTML = `

<div class="page-head">
    <div>
        <div class="hero-tag">HOSTELPULSE</div>
        <h1>Admin Command Center</h1>
        <p>Monitor hostel service performance in real time.</p>
    </div>
    <div class="active-status">● Service Pulse Active</div>
</div>

<div class="stats">
    <div class="stat"><p>TOTAL ISSUES</p><h2>126</h2></div>
    <div class="stat"><p>PENDING</p><h2>24</h2></div>
    <div class="stat"><p>IN PROGRESS</p><h2>18</h2></div>
    <div class="stat"><p>RESOLVED</p><h2>84</h2></div>
</div>

<div class="stats">
    <div class="stat"><p>SLA BREACHES</p><h2>7</h2></div>
    <div class="stat"><p>CRITICAL</p><h2>5</h2></div>
    <div class="stat"><p>SATISFACTION</p><h2>4.2/5</h2></div>
    <div class="stat"><p>AVG RESOLUTION</p><h2>7.4h</h2></div>
</div>

<div class="cluster">
    <div>
        <div class="hero-tag"> CRITICAL CLUSTER</div>
        <h3>BLOCK 32 — WATER SUPPLY ISSUE</h3>
        <p>47 reports • 180 estimated students affected • Recurring issue</p>
    </div>
    <span class="priority critical">CRITICAL</span>
</div>

<div class="grid">

    <div class="panel">
        <div class="panel-title"><h3>Complaints by Category</h3></div>
        ${bar("Water Supply", 38)}
        ${bar("Mess", 29)}
        ${bar("Cleaning", 22)}
        ${bar("Wi-Fi", 18)}
        ${bar("Electricity", 14)}
    </div>

    <div class="panel">
        <div class="panel-title"><h3>Problems by Hostel Block</h3></div>
        ${bar("Block 32", 47)}
        ${bar("Block 18", 31)}
        ${bar("Block 21", 24)}
        ${bar("Block 10", 17)}
        ${bar("Block 07", 12)}
    </div>

</div>
`;
}

function bar(name, value) {

    let width = value * 1.8;

    return `
<div class="bar">
    <div class="bar-label">
        <span>${name}</span>
        <b>${value}</b>
    </div>
    <div class="bar-bg">
        <div class="bar-fill" style="width:${width}%"></div>
    </div>
</div>
`;
}


/* = COMPLAINTS PAGE = */

function complaintsPage() {

    document.getElementById("dashboardContent").innerHTML = `

<div class="page-head">
    <div>
        <div class="hero-tag">ISSUE MANAGEMENT</div>
        <h1>All Complaints</h1>
        <p>Assign, update and escalate service issues.</p>
    </div>
</div>

<div class="panel">

${complaints.map((c, index) => `

<div class="admin-issue">

    <div class="admin-top">
        <div>
            <h3>${c.title}</h3>
            <p>${c.category} • ${c.sub}</p>
        </div>
        <span class="priority ${c.priority.toLowerCase()}">${c.priority}</span>
    </div>

    <div class="meta">
        <span> ${c.block}</span>
        <span> ${c.affected} affected</span>
        <span> ${c.assigned}</span>
        <span>Status: ${c.status}</span>
    </div>

    <div class="actions">
        <button onclick="startIssue(${c.id})"> Start</button>
        <button onclick="resolveIssue(${c.id})">✓ Resolve</button>
        <button class="escalate" onclick="escalateIssue(${c.id})">⚠ Escalate</button>
    </div>

</div>

`).join("")}

</div>
`;
}


/* = ADMIN ACTIONS = */

function startIssue(id) {
    let c = complaints.find(x => x.id === id);

    if (c) {
        c.status = "In Progress";
        c.assigned = "Maintenance Team";
    }

    complaintsPage();
    showToast("Issue assigned and started.");
}

function resolveIssue(id) {
    let c = complaints.find(x => x.id === id);

    if (c) {
        c.status = "Resolved";
        c.assigned = "Maintenance Team";
    }

    complaintsPage();
    showToast("Resolution proof recorded. Issue resolved.");
}

function escalateIssue(id) {
    let c = complaints.find(x => x.id === id);

    if (c) {
        c.priority = "Critical";
        c.status = "Escalated";
    }

    complaintsPage();
    showToast("Issue escalated to administration.");
}


/* = STAFF DASHBOARD = */

function staffDashboard() {

    let assigned = complaints.filter(c => c.assigned !== "Unassigned");

    document.getElementById("dashboardContent").innerHTML = `

<div class="page-head">
    <div>
        <div class="hero-tag">STAFF WORKSPACE</div>
        <h1>Assigned Issues</h1>
        <p>Manage assigned problems and update progress.</p>
    </div>
</div>

<div class="stats">
    <div class="stat"><p>ASSIGNED</p><h2>${assigned.length}</h2></div>
    <div class="stat"><p>IN PROGRESS</p><h2>${assigned.filter(c => c.status === "In Progress").length}</h2></div>
    <div class="stat"><p>RESOLVED</p><h2>${assigned.filter(c => c.status === "Resolved").length}</h2></div>
    <div class="stat"><p>CRITICAL</p><h2>${assigned.filter(c => c.priority === "Critical").length}</h2></div>
</div>

<div class="panel">

${assigned.map(c => `

<div class="admin-issue">

    <div class="admin-top">
        <div>
            <span class="priority ${c.priority.toLowerCase()}">${c.priority}</span>
            <h3 style="margin-top:8px">${c.title}</h3>
            <p>${c.block} • ${c.category} • ${c.affected} affected</p>
        </div>
    </div>

    <div class="actions">
        <button onclick="startIssue(${c.id});staffDashboard()">✓ Accept</button>
        <button onclick="resolveIssue(${c.id});staffDashboard()">✓ Resolve</button>
    </div>

</div>

`).join("")}

</div>
`;
}


/* = MESS PAGE = */

function messPage() {

    document.getElementById("dashboardContent").innerHTML = `

<div class="page-head">
    <div>
        <div class="hero-tag">MESS SERVICES</div>
        <h1>Mess Rating</h1>
        <p>Measure today's dining experience.</p>
    </div>
</div>

<div class="grid">

    <div class="panel">
        <h3>Today's Mess Rating</h3>

        ${rating("Taste")}
        ${rating("Quality")}
        ${rating("Quantity")}
        ${rating("Cleanliness")}
        ${rating("Menu Satisfaction")}

        <br>

        <button class="primary" onclick="showToast('Mess rating submitted!')">Submit Rating</button>
    </div>

    <div class="panel">
        <h3>Mess Performance</h3>
        <br>

        <div class="analytics-card">
            <span>Today's Score</span>
            <strong>4.1 </strong>
            <small>Good satisfaction</small>
        </div>

        <br>

        <div class="analytics-card">
            <span>Weekly Score</span>
            <strong>3.8 </strong>
        </div>

        <br>

        <div class="analytics-card">
            <span>Monthly Score</span>
            <strong>3.9 </strong>
        </div>
    </div>

</div>
`;
}

function rating(name) {
    return `
<div class="rating">
    <span>${name}</span>
    <div class="stars">
        <button onclick="rate(this)"></button>
        <button onclick="rate(this)"></button>
        <button onclick="rate(this)"></button>
        <button onclick="rate(this)"></button>
        <button onclick="rate(this)"></button>
    </div>
</div>
`;
}

function rate(button) {
    let parent = button.parentElement;
    let buttons = parent.querySelectorAll("button");
    let index = [...buttons].indexOf(button);

    buttons.forEach((b, i) => {
        b.classList.toggle("active", i <= index);
    });
}


/* = ANALYTICS = */

function analyticsPage() {

    document.getElementById("dashboardContent").innerHTML = `

<div class="page-head">
    <div>
        <div class="hero-tag">SERVICE INTELLIGENCE</div>
        <h1>Analytics</h1>
        <p>Identify recurring problems and measure service performance.</p>
    </div>
</div>

<div class="analytics">
    <div class="analytics-card"><span>Resolution Rate</span><strong>86%</strong><small>↑ 12% this month</small></div>
    <div class="analytics-card"><span>Average Resolution</span><strong>7.4h</strong><small>↓ 2.1h improvement</small></div>
    <div class="analytics-card"><span>Student Satisfaction</span><strong>4.2/5</strong><small>↑ 0.4 this month</small></div>
    <div class="analytics-card"><span>Recurring Issues</span><strong>31</strong><small>Problems identified</small></div>
</div>

<div class="grid">

    <div class="panel">
        <h3>Complaint Trends</h3>
        <br>
        ${bar("Water Supply", 82)}
        ${bar("Mess", 67)}
        ${bar("Cleaning", 51)}
        ${bar("Wi-Fi", 42)}
        ${bar("Electricity", 31)}
    </div>

    <div class="panel">
        <h3>Recurring Problems</h3>
        <br>

        <div class="complaint">
            <div class="complaint-info"><b> Water Supply</b><small>Block 32 • 47 reports</small></div>
            <span class="priority critical">CRITICAL</span>
        </div>

        <div class="complaint">
            <div class="complaint-info"><b> Mess Quality</b><small>Block 18 • 31 reports</small></div>
            <span class="priority high">HIGH</span>
        </div>

        <div class="complaint">
            <div class="complaint-info"><b> Wi-Fi</b><small>Block 21 • 24 reports</small></div>
            <span class="priority medium">MEDIUM</span>
        </div>
    </div>

</div>
`;
}


/* = TOAST = */

function showToast(message) {
    let toast = document.getElementById("toast");

    toast.innerText = message;
    toast.classList.remove("hidden");

    setTimeout(() => {
        toast.classList.add("hidden");
    }, 2500);
}