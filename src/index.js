import React from 'react'; //importa o React do pacote react 
import ReactDOM from 'react-dom/client'; //importa o ReactDOM do pacote react-dom
import App from './App'; //importa o componente App do arquivo App.js

//cria um elemento root e renderiza o componente App dentro dele
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
