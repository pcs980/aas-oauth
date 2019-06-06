const express = require('express');
const axios = require('axios');
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

  // Esta aplicação não persiste o id do usuário
  // Para fins didáticos verificamos apenas se o
  // tamanho do id é maior do que 5.
  if (id.length > 5) {
    res.status(200).send({novo_id: id});
  } else {
    res.redirect(`https://www.facebook.com/v3.3/dialog/oauth?client_id=${config.appId}&redirect_uri=http://localhost:3000/conta/cadastro/${id}&state=stateOauthAAS`)
  }
});

app.get('/conta/cadastro/:id', (req, res) => {
  const id = req.params.id;
  const code = req.query.code;
  const state = req.query.state;
  axios.get(`https://graph.facebook.com/v3.3/oauth/access_token?client_id=${config.appId}&redirect_uri=http://localhost:3000/conta/cadastro/${id}&state=${state}&client_secret=${config.appSecretKey}&code=${code}`)
    .then(({data}) => {
      const token = data.access_token;
      axios.get(`https://graph.facebook.com/debug_token?input_token=${token}&access_token=${config.accessToken}`)
        .then(({data}) => {
          const userId = data.data.user_id;
          axios.get(`https://graph.facebook.com/${userId}/?access_token=${token}`)
            .then(({data}) => {
              return res.redirect(`http://localhost:3000/conta/${data.id}`);
            })
            .catch((erro) => {
              return res.status(400).send('erro');
            });
        });
    });
});

app.listen(3000, () => console.log('Aplicação pronta e usando a porta 3000.'));
