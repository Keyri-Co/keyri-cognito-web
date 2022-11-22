import React, { useEffect, useState } from 'react';

const Content = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userId, setUserId] = useState('');

  const handleQrLogin = async payload => {
    const jwt = payload.idToken.split('.')[1];
    const decodedJwt = JSON.parse(atob(jwt));

    localStorage.setItem('idToken', payload.idToken);
    localStorage.setItem('accessToken', payload.accessToken);

    setUserId(decodedJwt.username);
    setAuthenticated(true);
  };

  useEffect(() => {
    window.addEventListener('message', async evt => {
      if (evt.data.keyri && evt.data.data && document.location.origin == evt.origin) {
        const { data } = evt;
        if (!data.error) {
          let payload = data.data;
          await handleQrLogin(payload);
        }
      } else if (data.error) {
        console.log(`Keyri error: ${data.error}`);
      }
    });
  }, []);

  return (
    <div className="hero my-5 text-center">
      <h1 className="mb-4">Cognito + Keyri Sample Project</h1>
      {!authenticated && (
        <div>
          <p className="lead">Log in by scanning the QR code below with the example Keyri-Cognito mobile app</p>
          <iframe
            src="./KeyriQR.html"
            id="qr - frame"
            frameBorder={0}
            height={300}
            width={300}
            scrolling="no"
            style={{ borderWidth: 0 }}></iframe>
        </div>
      )}
      {authenticated && (
        <div>
          <p className="lead">Logged in! Your username is {userId}</p>
        </div>
      )}
    </div>
  );
};

export default Content;
