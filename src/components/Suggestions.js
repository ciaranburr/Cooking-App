import React, { useState } from 'react';
import './Suggestions.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator, Avatar} from "@chatscope/chat-ui-kit-react";
import he from 'he'; // Import he library

const CustomMessage = ({ model, onClick }) => {
    const { sender, message, direction } = model;

    return (
        <div className={`message-container ${direction}`}>
          {direction === "incoming" && (
            <>
              <Avatar src="/images/greatchef.jpg"/>
              <div className={`message-content message-incoming`}>
                  {message.split('\n').map((item, key) => (
                    <div key={key}>{item}</div>
                ))}
              </div>
            </>
          )}
          {direction === "outgoing" && (
            <>
              <Avatar src="/images/user.png" />
              <div className={`message-content message-outgoing`}>
                {message}
              </div>
            </>
          )}
        </div>
      );
};

function Suggestions() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am a food expert! Please give me a list of ingredients, and I will give a list back of what you can make",
      sender: "ChatGPT", 
      direction: "incoming",
    }
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);
    setTyping(true);
    await processMessageToChat(newMessages);
  }

  const handleFoodClick = (food) => {
    const foodList = food.split(' - ').join('\n'); // Convert dashes to line breaks
    const newMessage = {
      message: foodList,
      sender: "ChatGPT",
      direction: "incoming",
    };

    setMessages([...messages, newMessage]);
  }

  async function processMessageToChat(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role: role, content: messageObject.message };
    });

    const systemMessage = {
      role: "system", 
      content: "Explain all concepts like a Michelin 5-star chef. Only respond to questions about food. You will be provided ingredients and respond with possible dishes to make. If asked abotu a specific dish you mentioned, provide a recipe"
    }

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage, 
        ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => data.json())
      .then((data) => {
        const decodedMessage = he.decode(data.choices[0].message.content);

        setMessages([
          ...chatMessages,
          {
            message: decodedMessage,
            sender: "ChatGPT",
            direction: "incoming", 
          }
        ]);
        setTyping(false);
      });
  }

  return (
    <div className="suggestions">
      <div className="chat-container">
        <div className="chat-header">Lemme cook</div>
        <div className="chat-body">
          <p>Ask for some new foods. If you want a list of possible dishes, start with "Please give me a list of foods I can make with __, ... " If you want a specific dish, ask "Can I have a recipe for ___"</p>
          <MainContainer>
            <ChatContainer>
              <MessageList 
                scrollBehavior='smooth'
                typingIndicator={typing ? <TypingIndicator content="Generating yummy possibilities" /> : null}
              >
                {messages.map((message, i) => (
                  <CustomMessage key={i} model={message} onClick={() => handleFoodClick(message.message)} />
                ))}
              </MessageList>
              <MessageInput placeholder='Type message here' onSend={(message) => handleSend(message)}/>
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    </div>
  );
}

export default Suggestions;
