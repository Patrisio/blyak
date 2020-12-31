(function(projectId) {
  const generateRandomHash = () => {
    const hash1 = Math.random().toString(36).substr(2, 8);
    const hash2 = Math.random().toString(36).substr(2, 8);
    const hash3 = Math.random().toString(36).substr(2, 8);
    const hash4 = Math.random().toString(36).substr(2, 8);

    return `${hash1}-${hash2}-${hash3}-${hash4}`;
  };

  const hasStorageClientChatData = () => {
    return JSON.parse(localStorage.getItem('chatSettings')) ? true : false;
  };

  const generateChatWidget = () => {
    const iframe = document.createElement('iframe');
    let clientId;
    let attributes;

    if (hasStorageClientChatData()) {
      const { clientId, projectId } = JSON.parse(localStorage.getItem('chatSettings'));

      const storageClientId = clientId;
      attributes = {
        'src': `http://localhost:3000/project/${projectId}/iframe/${storageClientId}`,
        'name': 'blyak_chat',
        'width': '400',
        'height': '550',
      };
    } else {
      clientId = generateRandomHash();
      attributes = {
        'src': `http://localhost:3000/project/${projectId}/iframe/${clientId}`,
        'name': 'blyak_chat',
        'width': '400',
        'height': '500',
      };
      localStorage.setItem('chatSettings', JSON.stringify({ clientId, projectId }));
    }

    for (let key in attributes) {
      iframe.setAttribute(key, attributes[key]);
    }

    return iframe;
  };

  const widget = generateChatWidget();

  document.body.appendChild(widget);
}(project_id));