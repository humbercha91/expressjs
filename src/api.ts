import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

export const app = express();

// MySQL Config
const dbConfig = {
  host: 'containers-us-west-62.railway.app',
  user: 'root',
  password: 'OsMtsiEe6Sy19CV1BgPP',
  database: 'PuntoDeVenta',
  port:5885
};

const pool = mysql.createPool(dbConfig);

app.use(cors({ origin: true }));
app.use(express.json());

// Add Pug as the view engine
app.set('view engine', 'pug');
app.set('views', './views'); // Assuming your pug files are in a directory named "views"

// Healthcheck endpoint
app.get('/', (req, res) => {
  res.status(200).send({ status: 'ok' });
});

const api = express.Router();

api.get('/hello', (req, res) => {
  res.status(200).send({ message: 'hello world' });
});

api.get('/products', async (req, res) => {
  const filterCriteria = req.query.filter || '';
  const connection = await pool.getConnection();
  const query = 'SELECT * FROM producto WHERE codigo LIKE ? OR Descripcion LIKE ? LIMIT 10';
  const [results] = await connection.query(query, [`%${filterCriteria}%`, `%${filterCriteria}%`]);
  connection.release();
  res.render('productList', { products: results });
});

// Version the api
app.use('/api/v1', api);
