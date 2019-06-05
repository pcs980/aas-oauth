const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const config = require('./config');

app.get('/conta/:id', (req, res) => {
  const id = req.params.id;
  console.log('GET CONTA', id);
  res.redirect(`https://www.facebook.com/v3.3/dialog/oauth?client_id=${id}&redirect_uri=http://localhost:3000/conta/cadastro/${id}&state=stateOauthAAS`)
});

app.get('/conta/cadastro/:id', (req, res) => {
  const id = req.params.id;
  const code = req.query.code;
  const state = req.query.state;
  res.redirect(`https://graph.facebook.com/v3.3/oauth/access_token?client_id=${id}&redirect_uri={REDIRECT_URI}&state=${state}&client_secret=${config.appSecretKey}&code=${code}`)
  res.status(200).send({id, code, state});
});

app.listen(3000, () => console.log('Aplicação pronta e usando a porta 3000.'));
