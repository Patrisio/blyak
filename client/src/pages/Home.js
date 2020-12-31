import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useHttp } from '../hooks/http.hook';
import useAuth from '../hooks/auth.hook';
import { AuthContext } from '../context/AuthContext';

import { addMessage } from '../actions';

export default function Home() {
  const [data, setData] = useState(null);
  const [clients, setClients] = useState([]);
  const [messages, setNewMessage] = useState([]);
  const [selectedClient, selectClient] = useState({});
  let { projectId } = useParams();
  const { socket } = useContext(AuthContext);
  const dispatch = useDispatch();
  const Gclients = useSelector(({ chatMessages }) => chatMessages.clients);

  // socket.on('notifyAboutNewMessage', msg => {
  //   console.log(msg, '===HOME===');
  //   console.log(clients);
  //   if (clients.length > 0) {
  //     const currentClient = clients.find(client => client.client_id === msg.clientId);
  //     console.log(currentClient);
  //     const currentClientIndex = clients.findIndex(client => client.client_id === msg.clientId);
  //     currentClient.messages_history.push(msg);
  //     setClients(prev => prev.splice(currentClientIndex, 1, currentClient));
  //   }
  // });

  // const dispatch = useDispatch();
  // const clients = useSelector(({ chatMessages }) => {
  //   return chatMessages.clients;
  // });

  // console.log(socket);
  // const messages = useSelector(({ chatMessages }) => chatMessages);

  const auth = useContext(AuthContext);
  const { request } = useHttp();
  const { logout } = useAuth();

  useEffect(() => {
    async function getData() {
      const getClients = async function() {
        const response = await fetch(`http://localhost:3000/project/${projectId}/getMessagesHistoryByProject`);
        return await response.json();
      };
  
      const clients = await getClients();
      console.log(clients);
      dispatch(addMessage(clients));
      setClients(prev => [...prev, ...clients]);

      const firstClient = clients[0];
      selectClient(firstClient);

      const data = await request('/home', 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      });

      setData(data);

      if (data.status !== 'success') {
        logout();
        window.location.href = '/login';
      }
    }
    
    getData();

    socket.on('notifyAboutNewMessage', msg => {
      console.log(Gclients);
      if (Gclients.length > 0) {
        const currentClient = Gclients.find(client => client.client_id === msg.clientId);
        const currentClientIndex = Gclients.findIndex(client => client.client_id === msg.clientId);
        currentClient.messages_history.push(msg);
        setClients(prev => prev.splice(currentClientIndex, 1, currentClient));
      }
    });
  }, [request, logout, auth.token, dispatch]);

  

  // useEffect(() => {
  //   socket.on('notifyAboutNewMessage', msg => {
  //     console.log(selectedClient);
  //     if (clients.length > 0) {
  //       const currentClient = clients.find(client => client.client_id === msg.clientId);
  //       const currentClientIndex = clients.findIndex(client => client.client_id === msg.clientId);
  //       currentClient.messages_history.push(msg);
  //       setClients(prev => prev.splice(currentClientIndex, 1, currentClient));
  //     }
  //   });
    
  //   // return () => socket.disconnect();
  // }, [socket]);

  // if (data) {
  //   auth.login(data.token, data.userId);
  // }

  const hasData = data => data.length !== 0;

  const renderClients = () => {
    return clients.map((client, idx) => {
      return (
        <MessageTab
          key={idx}
          onClick={() => selectClient(client)}
        >
          { client.messages_history[0].username }
        </MessageTab>
      );
    });
  };

  const renderMessages = () => {
    return selectedClient.messages_history.map((message, idx) => {
      return (
        <div
          key={idx}
          dangerouslySetInnerHTML={{ __html: message.msg }}
        />
      );
    });
  };

  return (
    <HomeWrapper>
      <div>
        <h1>Home page</h1>
        <button onClick={logout}>Выйти</button>
        <Link to={`/project/${projectId}/chat/settings`}>Chat Settings</Link>

        <MessagesArea>
          {
            hasData(clients) &&
            renderClients()
          }
        </MessagesArea>
      </div>

      <div>
        <MessagesArea>
          {
            selectedClient && hasData(Object.keys(selectedClient)) &&
            renderMessages()
          }
        </MessagesArea>
      </div>
    </HomeWrapper>
  );
}

const HomeWrapper = styled.div`
  display: flex;

`;

const MessagesArea = styled.div`

`;

const MessageTab = styled.div`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background: #ccc;
  }
`;