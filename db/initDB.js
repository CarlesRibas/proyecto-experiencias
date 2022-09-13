require('dotenv').config();

const getDB = require('./getDB');

async function main() {
    let connection;

    try {
        connection = await getDB();

        console.log('Borrando las tablas existentes');
        await connection.query(`DROP TABLE IF EXISTS voto`);
        await connection.query(`DROP TABLE IF EXISTS comentarios`);
        await connection.query(`DROP TABLE IF EXISTS recomendaciones`);
        await connection.query(`DROP TABLE IF EXISTS users`);

        console.log('Tablas borradas');

        console.log('Creando nuevas Tablas');

        await connection.query(`
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(50) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            avatar VARCHAR(100)
            
        )
        `);
        console.log('tabla users creada');

        await connection.query(`
        CREATE TABLE recomendaciones (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            users_id INTEGER NOT NULL,
            FOREIGN KEY (users_id) REFERENCES users(id),
            entry VARCHAR(200),
            category VARCHAR(100),
            title VARCHAR(100) NOT NULL,
            text TEXT,
            image VARCHAR(255),
            place VARCHAR(100) NOT NULL, 
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            stars INTEGER
        );
        
        `);

        console.log('tabla recomendaciones creada');

        await connection.query(`
        CREATE TABLE comentarios (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            id_recomendaciones INTEGER NOT NULL,
            FOREIGN KEY (id_recomendaciones) REFERENCES recomendaciones(id),
            id_users INTEGER NOT NULL,
            FOREIGN KEY (id_users) REFERENCES users(id),
            text TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            stars INTEGER
        );
        
        `);

        console.log('tabla comentarios creada');

        await connection.query(`
        CREATE TABLE voto (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            id_users INTEGER NOT NULL,
            FOREIGN KEY (id_users) REFERENCES users(id),
            id_recomendaciones INTEGER NOT NULL,
            FOREIGN KEY (id_recomendaciones) REFERENCES recomendaciones(id),
            likes BOOLEAN
        );
        
        `);

        console.log('tabla voto creada');

        console.log('Tablas creadas con exito');
    } catch (error) {
        console.error(error);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
}

main();
