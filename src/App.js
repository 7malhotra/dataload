import axios from 'axios';
import React, { useState } from 'react';
import './App.css';
import Papa from 'papaparse';
import './App.css';

// Allowed extensions for input file
const allowedExtensions = ['csv'];

function App() {
  // It will store the file uploaded by the user
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState('');

  const uploadRequest = () => {
    let arePropertySelected = true;
    Object.keys(data).forEach((col) => {
      if (data[col] === '') {
        arePropertySelected = false;
        return;
      }
    });
    if (!arePropertySelected) {
      setSuccess('Please select the property for all the columns!');
      return;
    }

    var formData = new FormData();
    formData.append('file', file);
    formData.append('json_data', JSON.stringify(data));
    axios
      .post('http://127.0.0.1:8000/file/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
  // This state will store the parsed data
  const [data, setData] = useState({});

  // It state will contain the error when
  // correct file extension is not used
  const [error, setError] = useState('');

  // This function will be called when
  // the file input changes
  const handleFileChange = (e) => {
    setError('');

    // Check if user has entered the file
    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      // Check the file extensions, if it not
      // included in the allowed extensions
      // we show the error
      const fileExtension = inputFile?.type.split('/')[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError('Please input a csv file');
        return;
      }

      // If input type is correct set the state
      setFile(inputFile);
    }
  };
  const handleParse = () => {
    // If user clicks the parse button without
    // a file we show a error
    if (!file) return setError('Enter a valid file');
    // Initialize a reader which allows user
    // to read any file or blob.
    const reader = new FileReader();

    // Event listener on reader when the file
    // loads, we parse it and set the data.
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      const parsedData = csv?.data;
      const columns = Object.keys(parsedData[0]);
      let dataToBeSaved = {};
      columns.forEach((col) => {
        dataToBeSaved[`${col}`] = '';
      });
      setData(dataToBeSaved);
    };
    reader.readAsText(file);
  };

  return (
    <div className="main_01">
      <h1>Data Load</h1>
      <div className="lable_01">
        <label htmlFor="csvInput" style={{ display: 'block' }}>
          Enter CSV File
        </label>
        <input
          onChange={handleFileChange}
          id="csvInput"
          name="file"
          type="File"
        />
      </div>
      <div className="button_01">
        <button onClick={handleParse}>Parse</button>
      </div>
      <div className="summary_01">
        <h3>
          {error
            ? error
            : Object.keys(data).length > 0
            ? 'Summary of the input data'
            : ''}
        </h3>
        {error
          ? error
          : Object.keys(data).map((key, idx) => {
              return (
                <div className="item_01" key={idx}>
                  <div>
                    <h4>{key}</h4>
                  </div>
                  <div>
                    <select
                      name={data[key]}
                      id={data[key]}
                      onChange={(e) =>
                        setData({ ...data, [`${key}`]: e.target.value })
                      }
                    >
                      <option value=""></option>
                      <option value="target">Target</option>
                      <option value="segmentation">Segmentation</option>
                      <option value="explanatory">Explanatory</option>
                    </select>
                  </div>
                </div>
              );
            })}
      </div>
      <div className="button_01">
        <button onClick={uploadRequest}>Upload</button>
        <h4>{success}</h4>
      </div>
    </div>
  );
}

export default App;
