const keys = require('./config/keys');
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg')

const pool = new Pool({
  host: keys.pgHost,
  port: keys.pgPort,
  user: keys.pgUser,
  password: keys.pgPassword,
  database: keys.pgDatabase
});


const app = express();
app.use(express.json());
app.use(cors());

async function main() {
  await pool.query('CREATE TABLE IF NOT EXISTS java(number INT)')

  pool.on('error', (e) => console.error(e));
  try {
    const client = await pool.connect();
    console.log('Connected');
    client.release();

    app.get('/values', async (req, res) => {
      try {
        const client = await pool.connect();
        const values = await client.query('SELECT * from java');
        client.release();
        res.send(values.rows);
      } catch (e) {
        console.error(e);
      }
    })

    app.post('/values', async (req, res) => {
      const { number } = req.body;
      try {
        const client = await pool.connect();
        const result = await client.query('INSERT INTO java (number) VALUES($1)', [number]);
        client.release();
        res.send({ number });
      } catch (e) {
        console.error(e);
      }
    })

    app.listen(5000);
  } catch (e) {
    console.log(e);
  }
}

main();