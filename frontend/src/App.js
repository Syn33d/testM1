import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:3001";

function App() {
  // Conversion
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("EUR");
  const [to, setTo] = useState("USD");
  const [conversionResult, setConversionResult] = useState(null);

  // TTC
  const [ht, setHt] = useState(100);
  const [tva, setTva] = useState(20);
  const [ttcResult, setTtcResult] = useState(null);

  // Remise
  const [prix, setPrix] = useState(100);
  const [remise, setRemise] = useState(10);
  const [remiseResult, setRemiseResult] = useState(null);
  const [prixInitial] = useState(prix);
  const [pourcentage] = useState(remise);

  const handleConvert = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/convert?amount=${amount}&from=${from}&to=${to}`);
    const data = await res.json();
    setConversionResult(data ||data.error);
  };

  const handleTtc = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/tva?ht=${ht}&tva=${tva}`);
    const data = await res.json();
    setTtcResult(data.ttc || data.error);
  };

  const handleRemise = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/remise?prix=${prix}&remise=${remise}`);
    const data = await res.json();
    setRemiseResult(data.prixFinal || data.error);
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>Test API Conversion</h2>

      {/* Bloc Conversion */}
      <div style={{ border: "1px solid #ccc", padding: 16, marginBottom: 24 }}>
        <h3>Conversion de devise</h3>
        <form onSubmit={handleConvert}>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} step="any" min="0" data-cy="conversion"/>
          <select value={from} onChange={e => setFrom(e.target.value)} data-cy="from">
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
          <span>→</span>
          <select value={to} onChange={e => setTo(e.target.value)} data-cy="to">
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </select>
          <button type="submit">Convertir</button>
        </form>
        {conversionResult && !conversionResult.error && (
          <div>
            <div data-cy="conversionResult">Résultat : <b>{conversionResult.convertedAmount}</b></div>
            <div>
              {conversionResult.originalAmount} {conversionResult.from} → {conversionResult.to}
            </div>
          </div>
        )}
        {conversionResult && conversionResult.error && (
          <div style={{ color: "red" }}>{conversionResult.error}</div>
        )}
      </div>

      {/* Bloc TTC */}
      <div style={{ border: "1px solid #ccc", padding: 16, marginBottom: 24 }}>
        <h3>Calcul TTC</h3>
        <form onSubmit={handleTtc}>
          <input type="number" value={ht} onChange={e => setHt(e.target.value)} placeholder="HT" data-cy="ht"/>
          <input type="number" value={tva} onChange={e => setTva(e.target.value)} placeholder="TVA (%)" data-cy="tva"/>
          <button type="submit">Calculer TTC</button>
        </form>
        {ttcResult && !ttcResult.error && (
          <div>
            <div data-cy="ttcResult">Montant TTC : <b>{ttcResult}</b></div>
            <div data-cy="calculValues">HT : {ht}, TVA : {tva}%</div>
          </div>
        )}
        {ttcResult && ttcResult.error && (
          <div style={{ color: "red" }}>{ttcResult.error}</div>
        )}
      </div>

      {/* Bloc Remise */}
      <div style={{ border: "1px solid #ccc", padding: 16 }}>
        <h3>Application Remise</h3>
        <form onSubmit={handleRemise}>
          <input type="number" value={prix} onChange={e => setPrix(e.target.value)} placeholder="Prix" data-cy="prix"/>
          <input type="number" value={remise} onChange={e => setRemise(e.target.value)} placeholder="Remise (%)" data-cy="remise"/>
          <button type="submit">Appliquer Remise</button>
        </form>
        {remiseResult && !remiseResult.error && (
          <div>
            <div data-cy="remiseResult">Prix après remise : <b>{remiseResult}</b></div>
            <div data-cy="remiseValues">Prix initial : {prixInitial}, Remise : {pourcentage}%</div>
          </div>
        )}
        {remiseResult && remiseResult.error && (
          <div style={{ color: "red" }}>{remiseResult.error}</div>
        )}
        </div>
    </div>
  );
}

export default App;
