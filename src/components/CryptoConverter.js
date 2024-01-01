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
  const apiPath = "https://crypto-converter-backend.vercel.app";

  useEffect(() => {
    axios
      .get(`${apiPath}/api/currency-list`)
      .then((response) => {
        setCurrencyList(response.data.filter((item) => item !== "inr"));
      })
      .catch((error) => notifyFailure(error));
    // Fetch the list of cryptocurrencies
    axios
      .get(`${apiPath}/api/currencies`)
      .then((response) => {
        setCurrencies(response.data);
        setSourceCurrency(response.data[0]?.id || "");
      })
      .catch((error) => notifyFailure(error));
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
        setConvertedAmount(response.data.convertedAmount);
        setLoader(false);
      })
      .catch((error) => {
        notifyFailure(error);
        setLoader(false);
      });
  };

  const notifyFailure = (value) => {
    toast.error(value);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-3xl font-semibold text-center">Crypto Currency Converter</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto mt-8 p-4">
        {loader && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <Loader />
          </div>
        )}

        <div className={`flex flex-col md:justify-center space-y-4 md:flex-row md:space-x-4 md:space-y-0 ${loader ? 'blur' : ''}`}>
          <ReactSelect
            className="w-full md:w-64" // Adjust the width as needed
            required
            options={currencies?.map((currency) => ({
              value: currency.id,
              label: (
                <div className="flex items-center">
                  <img
                    src={currency.image}
                    alt={currency.name}
                    className="w-6 h-6 mr-2"
                  />
                  {currency.name} ({currency.price} INR)
                </div>
              ),
            }))}
            onChange={(selectedOption) =>
              setSourceCurrency(selectedOption.value)
            }
          />

          <input
            type="number"
            className="p-2 border rounded"
            placeholder="Enter amount"
            value={amount}
            required
            onChange={(e) => {
              setAmount(e.target.value);
              setConvertedAmount(null);
            }}
          />

          <select
            className="p-2 border rounded"
            value={targetCurrency}
            required
            placeholder="currency"
            onChange={(e) => {
              setTargetCurrency(e.target.value);
              setConvertedAmount(null);
            }}
          >
            <option value="" disabled>
              Currency
            </option>
            {currencyList?.map((item) => (
              <option key={item} value={item} className="uppercase">
                {item}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full md:w-auto"
            onClick={handleConvert}
          >
            Convert
          </button>
        </div>

        {error && <div className="text-red-500 mt-2">{error}</div>}

        {convertedAmount !== null && (
          <div className="mt-10 font-bold text-center">
            <p className="mb-2">Converted Amount:</p>
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
