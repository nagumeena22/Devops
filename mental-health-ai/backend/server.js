const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const analyzeRouter = require('./routes/analyze');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', analyzeRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`MindGuard backend running on port ${PORT}`));
