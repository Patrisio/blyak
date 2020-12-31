import React, { useState, useEffect, useContext } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
// import { addMessage } from '../actions';

export default function Chat() {
  let { clientId, projectId } = useParams();
  const { socket } = useContext(AuthContext);
  let pressed = new Set();
  const [messages, addNewMessage] = useState([]);
  // const dispatch = useDispatch();

  useEffect(() => {
    const getMessagesHistory = async function() {
      console.log(socket);
      const response = await fetch(`http://localhost:3000/project/${projectId}/chat/${clientId}/getMessagesHistory`);
      return await response.json();
    };

    const messagesHistory = getMessagesHistory();
    messagesHistory.then((res, rej) => {
      addNewMessage(prev => [...prev, ...res]);
    });

    // socket.on('chatMessage', msg => {
    //   const welcomeMessage = { username: 'anonym', msg };
    //   addNewMessage(prev => [...prev, welcomeMessage]);
    // });
  }, []);

  const runOnKeys = (event, func, ...codes) => {
    const inputArea = event.target;
    pressed.add(event.which);

    if (pressed.has(16)) {
      return;
    }

    if (pressed.has(13) && pressed.size === 1 && inputArea.textContent !== '') {
      func(inputArea);
    }
    
    pressed.clear();

    document.addEventListener('keyup', function(event) {
      pressed.delete(event.which);
    });
  }

  // const getChatSettings = () => {
  //   return localStorage.getItem('chatSettings');
  // };

  const send = (inputArea) => {
    const msg = inputArea.innerHTML;
    const newMessage = {
      clientId,
      username: 'anonym',
      msg
    };
    // const { clientId, projectId } = getChatSettings();
    addNewMessage(prevMessages => [...prevMessages, newMessage]);
    fetch(`http://localhost:3000/chat/${clientId}/${projectId}/message`, {
      method: 'POST',
      body: JSON.stringify(newMessage),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    socket.emit('chatMessage', newMessage);
    // addMessage(newMessage);
    // dispatch(addMessage(newMessage));
    inputArea.innerHTML = '';
    clearInputArea(inputArea);
  };

  const clearInputArea = (inputArea) => {
    setTimeout(() => {
      for (let i = 0; i < inputArea.children.length; i++) {
        inputArea.children[i].remove();
      }
    }, 0)
  };

  const hasMessages = () => messages.length !== 0;
  return (
    <ChatWrapper>
      <Header>
      </Header>
      
      <MessagesArea>
        {
          hasMessages() &&
          messages.map((message, idx) => (
            <div
              key={idx}
              dangerouslySetInnerHTML={{__html: message.msg}}
            />
          ))
        }
      </MessagesArea>

      <InputArea
        onKeyDown={(e) => runOnKeys(e, send, 13, 16)}
        contentEditable
      >
      </InputArea>
    </ChatWrapper>
  );
}

const ChatWrapper = styled.div`
  position: absolute;
  width: 300px;
  height: 500px;
  right: 0;
  bottom: 0;
  border: 3px solid blue;
`;

const Header = styled.div`

`;

const MessagesArea = styled.div`

`;

const InputArea = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  border: 2px solid red;
  width: 100%;
`;