// src/components/CryptoConverter.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactSelect from "react-select";
import toast from "react-hot-toast";
import Loader from "./loader";

const CryptoConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [sourceCurrency, setSourceCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [targetCurrency, setTargetCurrency] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);
  //   const apiPath = "http://localhost:5000"
  const apiPath = "https://crypto-converter-backend.vercel.app";

  useEffect(() => {
    axios
      .get(`${apiPath}/api/currency-list`)
      .then((response) => {
        setCurrencyList(response?.data?.filter((item) => item !== "inr"));
        //   setSourceCurrency(response.data[0] || '');
      })
      .catch(error => 

      console.log(error)
        // notifyFailure(error.message)
        );
    // Fetch the list of cryptocurrencies
    axios
      .get(`${apiPath}/api/currencies`)
      .then((response) => {
        setCurrencies(response.data);
        setSourceCurrency(response.data[0]?.id || "");
      })
      .catch(error => 
      console.log(error));
  }, []);

  const handleConvert = () => {
    // Make the currency conversion request
    if (!sourceCurrency || !amount || !targetCurrency) {
      setError("All fields are required");
      return;
    }
    setLoader(true);
    axios
      .get(`${apiPath}/api/convert`, {
        params: {
          sourceCurrency,
          amount,
          targetCurrency,
        },
      })
      .then((response) => {
        setConvertedAmount(response?.data?.convertedAmount);
        setLoader(false);
      })
      .catch(error => {
        notifyFailure(error.response.data.error);
        setLoader(false);
      });
  };

  const notify = (value) => {
    toast.success(value);
    // simulate authentication success
  };
  const notifyFailure = (value) => {
    toast.error(value);
    // simulate authentication failure
  };
  console.log(sourceCurrency);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-3xl font-semibold">Crypto Currency Converter</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto mt-8 p-4">
        {loader && 

         <Loader />
       
         }
         <div className={`${loader ? 'blur' : ''}`}>

        <div className="flex space-x-2 justify-center">
          <ReactSelect
            className="w-64 h-[38px]" // Adjust the width as needed
            required
            options={currencies?.map((currency) => ({
                value: currency?.id,
                label: (
                    <div className="flex items-center">
                  <img
                    src={currency?.image}
                    alt={currency?.name}
                    className="w-6 h-6 mr-2"
                    />
                  {currency?.name} ({currency?.price} INR)
                </div>
              ),
            }))}
            // value={currencies.find(currency => currency.id === sourceCurrency)}
            onChange={(selectedOption) =>
                setSourceCurrency(selectedOption.value)
            }
            />

          <input
            type="number"
            className="p-2 border rounded h-[38px]"
            placeholder="Enter amount"
            value={amount}
            required
            onChange={(e) => {
                setAmount(e.target.value);
                setConvertedAmount(null);
            }}
            />

          <select
            className="p-2 border rounded h-[38px]"
            value={targetCurrency}
            required
            placeholder="currency"
            onChange={(e) => {
                setTargetCurrency(e.target.value);
                setConvertedAmount(null);
            }}
            >
            <option value="" selected disabled>
              Currency
            </option>
            {currencyList?.map((item) => (
                <option value={item} className="uppercase">
                {item}
              </option>
            ))}
          </select>
              </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded h-[38px] mt-10"
          onClick={handleConvert}
          >
          Convert
        </button>
        </div>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {convertedAmount !== null && (
          <div className="mt-10 font-bold">
            <p className=" mb-10">Converted Amount:</p>
            <span className="bg-gray-500 text-white px-4 py-3 rounded-md">
              {amount} x {sourceCurrency.toLowerCase()} ={" "}
              {convertedAmount.toFixed(2)} {targetCurrency.toUpperCase()}
            </span>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-blue-500 text-white p-4 text-center">
        <p>&copy; 2023 Crypto Converter. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CryptoConverter;
