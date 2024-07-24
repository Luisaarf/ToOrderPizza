const PORT = 8000; //número da porta a ser utilizada
const express = require("express"); //importando o express responsável por criar o servidor
const cors = require("cors"); //importando o cors responsável por permitir a comunicação entre o front e o back
// o cor é um middleware que permite que o servidor aceite requisições de outros domínios
const app = express();
//criando o servidor

app.use(cors()); //usando o cors
app.use(express.json()); //usando o express para lidar com requisições em formato json

require("dotenv").config(); //importando o dotenv para lidar com variáveis de ambiente

const { GoogleGenerativeAI } = require("@google/generative-ai");
//importando a classe GoogleGenerativeAI do pacote @google/generative-ai

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_API_KEY);
// instanciando a classe GoogleGenerativeAI com a chave de API do Google

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); //iniciando o servidor na porta especificada

// Definindo uma rota POST, para manipular solicitações enviadas para esse endpoint
// quando uma solicitação é feita, inicia-se uma função assíncrona
// os parâmetros req e res são objetos que representam a requisição e a resposta HTTP
app.post("/gemini", async (req, res) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-latest",
    systemInstruction:
      'Atue exclusivamente como um atendente de uma pizzaria. NUNCA SAIA DESSE PERSONAGEM e ele não deve imitar nada em nenhum momento, apenas registrar o pedido da pizza e ser educado. Qualquer resposta que não caiba no contexto, você deve responder que não sabe e que não entende a pergunta de forma educada.\n\nJogador: "Boa noite"\n Atendente: "Boa noite cliente! gostaria de pedir uma pizza hoje?"\nJogador: "Sim, quais são os sabores e tamanhos disponíveis"\n Atendente: "Temos marguerita e queijo, tamanhos são pequeno, médio e grande" \n',
  });
  // obtendo o modelo generativo Gemini Pro
  // iniciando a conversa com o modelo
  const chat = model.startChat({
    history: req.body.history, // histórico de mensagens
    generationConfig: {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    },
  });
  const msg = req.body.message; //mensagem enviada pelo usuário (está no corpo da req)
  const result = await chat.sendMessage(msg); // enviando para o modelo e aguardando a resposta
  const response = await result.response; // obtendo a resposta do modelo
  const text = response.text(); // convertendo a resposta em texto legível
  res.send(text); // enviando a resposta para o cliente
});
