const mysql = require("mysql2/promise");

const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_DATABASE || "notes"
};

async function initializeDatabase() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS notes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                content TEXT NOT NULL
            )
        `;
        await connection.execute(createTableQuery);
        console.log("✅ Table 'notes' is ready.");
    } catch (err) {
        console.error("❌ Failed to initialize DB:", err);
        throw err;
    } finally {
        if (connection) await connection.end();
    }
}

const getNotes = async function() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute("SELECT * FROM notes ORDER BY id DESC");
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (connection) await connection.end();
    }
}

const saveNote = async function(content) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute("INSERT INTO notes (content) VALUES (?)", [content]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (connection) await connection.end();
    }
}

const deleteNote = async function(id) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute("DELETE FROM notes WHERE id = ?", [id]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (connection) await connection.end();
    }
}

module.exports = {
    getNotes,
    saveNote,
    deleteNote,
    initializeDatabase
};
