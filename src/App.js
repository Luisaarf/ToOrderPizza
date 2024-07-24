import { useState } from "react"; //importa o hook useState do pacote react
import pizzaChef from "./assets/pizzaChefAnim.gif"; //importa a imagem do chef
import "./index.css";

function App() {
  const [valueInput, setValueInput] = useState(""); // gerenciamento de estado
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  // função assíncrona que faz uma requisição POST para o servidor
  const getResponse = async (message) => {
    if (!valueInput) {
      //se o valor do input for vazio
      setError("Please enter a message"); //exibe a mensagem de erro
      return; //encerra a função com um retorno
    }
    try {
      //tenta executar o bloco de código

      const options = {
        //opções da requisição
        method: "POST", //método POST
        body: JSON.stringify({
          //corpo da requisição com:
          history: chatHistory, //histórico de chat
          message: valueInput, //mensagem
        }),
        headers: {
          //cabeçalho da requisição
          "Content-Type": "application/json", //tipo de conteúdo é JSON
        },
      };
      //faz a requisição para o servidor enviando a url e o objeto options
      const response = await fetch("http://localhost:8000/gemini", options);
      const data = await response.text(); //espera a resposta e converte para texto
      console.log("data:", data);
      //atualiza o estado do chatHistory adicionando novos valores e zera o input
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        { role: "user", parts: [{ text: valueInput }] },
        { role: "model", parts: [{ text: data }] },
      ]);
      setValueInput("");
    } catch (error) {
      //captura um erro
      console.error("error:", error);
      setError("Something went wrong :( Please try again later.");
    }
  };

  const clear = () => {
    setValueInput("");
    setError("");
    setChatHistory([]);
  };
  //retorna o JSX
  return (
    <div className="App">
      <div className="chef">
        <img src={pizzaChef} alt="chef" />
      </div>
      <div className="chat-container">
        <p>Chat with me</p>
        <div className="input-container">
          <input
            value={valueInput}
            type="text"
            placeholder="Hello there!"
            onChange={(e) => setValueInput(e.target.value)}
          />
          {!error && <button onClick={getResponse}>Send</button>}
          {error && <button onClick={clear}>Clear</button>}
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="search-result">
          {chatHistory.map((chatItem, _index) => {
            {
              console.log("chatItem:", chatItem);
              console.log("chatItem.role:", chatItem.role);
              console.log("chatItem.parts[0].text:", chatItem.parts[0].text);
            }
            return (
              <div key={_index}>
                <p className="answer">
                  {chatItem.role} : {chatItem.parts[0].text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
