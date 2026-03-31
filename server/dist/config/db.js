import "dotenv/config";
import { Pool } from 'pg';
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT)
});
pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(res.rows[0]);
    }
});
export default pool;
//# sourceMappingURL=db.js.map