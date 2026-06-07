# QRCodeAttend
 A Dynamic Time and Proxy-Free Attendance Web Application
<body>
  <h1>QR-Based Attendance Management System</h1>

  <p>
    This is a modern web application that streamlines the process of recording and viewing attendance using QR codes. Designed with a clean and professional interface, the system provides a seamless experience for both administrators and participants. Built using the MERN (MongoDB, Express, React, Node.js) stack, it emphasizes efficiency, security, and user-friendliness.
  </p>

  <h2>Abstract</h2>
  <p>
    In traditional attendance systems, manual recording is time-consuming, error-prone, and vulnerable to proxy entries. This project presents an automated solution using QR codes that ensures fast, accurate, and secure attendance tracking. Each session generates a unique QR code, which users scan to mark their presence. Admins can view detailed reports with filtering and sorting capabilities. This reduces administrative overhead while improving reliability and data integrity.
  </p>

  <h2>Key Features</h2>
  <ul>
    <li>User Authentication: Secure login and registration for admins.</li>
    <li>Session Management: Create and manage attendance sessions.</li>
    <li>QR Code Generation: Unique QR code generated for each session.</li>
    <li>QR Scanning: Scan QR code via mobile/webcam to mark attendance.</li>
    <li>Attendance Reports: View all sessions and attendance status in a searchable and sortable table.</li>
    <li>Responsive Design: Clean UI styled using modern CSS, optimized for all devices.</li>
  </ul>

  <h2>Tech Stack</h2>
  <ul>
    <li><strong>Frontend:</strong> React 19, normal CSS (no Tailwind or external libraries)</li>
    <li><strong>Backend:</strong> Node.js, Express.js</li>
    <li><strong>Database:</strong> MongoDB with Mongoose ODM</li>
    <li><strong>QR Handling:</strong> qrcode and react-qr-reader libraries</li>
  </ul>

  <h2>Folder Structure</h2>
  <ul>
    <li><code>/client</code> – React frontend (login, dashboard, QR code scan, attendance view)</li>
    <li><code>/server</code> – Express backend (auth, session, attendance routes)</li>
    <li><code>/models</code> – MongoDB schema definitions</li>
    <li><code>/routes</code> – API route handlers</li>
  </ul>

  <h2>Getting Started</h2>
  <ol>
    <li>Clone the repository</li>
    <li>Install dependencies for both <code>client</code> and <code>server</code></li>
    <li>Set environment variables (MongoDB URI, JWT secret)</li>
    <li>Start backend: <code>npm run dev</code> inside <code>/server</code></li>
    <li>Start frontend: <code>npm start</code> inside <code>/client</code></li>
  </ol>

  <h2>Attendance Report UI</h2>
  <p>
    Attendance data is presented in a user-friendly table with options to:
  </p>
  <ul>
    <li>Search attendees by name</li>
    <li>Filter by session</li>
    <li>Sort by date or status</li>
  </ul>

  <h2>Security</h2>
  <ul>
    <li>All sensitive actions are protected by JWT authentication</li>
    <li>Data validation and sanitation on backend</li>
    <li>Secure session and attendance data management</li>
  </ul>

  <h2>Contributions</h2>
  <p>
    Contributions are welcome! If you find any bugs or would like to suggest new features, feel free to open an issue or a pull request.
  </p>

  <h2>License</h2>
  <p>This project is licensed under the MIT License.</p>
</body>
