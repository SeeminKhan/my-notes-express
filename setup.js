require('dotenv').config();
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_DATABASE || "notes"
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL');

  const tableName = 'notes';
  const checkTableQuery = `SHOW TABLES LIKE ?`;

  db.query(checkTableQuery, [tableName], (err, results) => {
    if (err) {
      console.error('Error checking table:', err);
      return;
    }

    if (results.length > 0) {
      console.log(`Table '${tableName}' already exists.`);
      db.end();
    } else {
      console.log(`Table '${tableName}' does not exist. Creating...`);
      createTable(tableName);
    }
  });
});

function createTable(tableName) {
  const createTableQuery = `
    CREATE TABLE ${tableName} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating table:', err);
      return;
    }
    console.log('Table created successfully.');
    db.end();
  });
}
