
const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();


app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
app.get('/ping', function (req, res) {
 return res.send('pong');
});

if(window.localStorage.getItem("tipo_usuario") === "desenvolvimento"){
  app.get('/entidade', function (req, res) {
    res.end();
  });
  console.log("adm");
}else{
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(port);
