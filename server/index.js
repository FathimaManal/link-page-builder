require('dotenv').config();

if (process.platform === 'win32') {
  require('dns').setDefaultResultOrder('ipv4first');
  const net = require('net');
  const _orig = net.createConnection.bind(net);
  net.createConnection = (opts, ...rest) => {
    if (opts && typeof opts === 'object' && !opts.path) opts = { ...opts, family: 4 };
    return _orig(opts, ...rest);
  };
}

const express   = require('express');
const cors      = require('cors');
const connectDB = require('./config/db');

connectDB().catch((err) => {
  console.error('DB connection failed:', err.message);
  process.exit(1);
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth',   require('./routes/auth'));
app.use('/api/links',  require('./routes/links'));
app.use('/api/public', require('./routes/public'));

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
