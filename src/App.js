import logo from './logo.svg';
import axios from 'axios';
import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState();
  const [jsonData, setJsonData] = useState([
    { name: 'Ishwar', value: 'Jangid' },
    { name: 'Gaurav', value: 'Malhotra' },
  ]);
  const [success, setSuccess] = useState('');

  const uploadRequest = () => {
    axios
      .post('http://127.0.0.1:8000/file/upload/', {
        file: file,
        json_data: jsonData,
      })
      .then(function (response) {
        console.log(response);
        setSuccess('Uploaded!');
      })
      .catch(function (error) {
        console.log(error);
        setSuccess('Error Occured');
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Data load</p>
      </header>
      <div>
        <input type="file" onChange={(e) => setFile(e.target.files[0])}></input>
        <button onClick={uploadRequest}>Send</button>
        <p>{success}</p>
      </div>
    </div>
  );
}

export default App;
