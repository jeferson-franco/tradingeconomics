import React, { useState, useCallback } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Scale } from "lucide-react";
import styles from "./CountryComparison.module.css";

Chart.register(...registerables);

const COUNTRIES = ["Mexico", "New Zealand", "Sweden", "Thailand"];

export default function CountryComparison() {
  const [countryA, setCountryA] = useState("Mexico");
  const [countryB, setCountryB] = useState("Sweden");
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGDP = useCallback(async (country) => {
    try {
      const response = await fetch(`http://localhost:3001/api/gdp/${country}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching GDP data for ${country}:`, error);
      return [];
    }
  }, []);

  const compareCountries = useCallback(async () => {
    setLoading(true);
    try {
      const [dataA, dataB] = await Promise.all([fetchGDP(countryA), fetchGDP(countryB)]);
      setSeries([
        { label: countryA, data: dataA },
        { label: countryB, data: dataB },
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setSeries([]);
    } finally {
      setLoading(false);
    }
  }, [countryA, countryB, fetchGDP]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Scale size={32} />
        <h1>GDP Growth Comparison</h1>
      </header>

      <div className={styles.controls}>
        <select value={countryA} onChange={(e) => setCountryA(e.target.value)} className={styles.select}>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <span className={styles.vs}>VS</span>

        <select value={countryB} onChange={(e) => setCountryB(e.target.value)} className={styles.select}>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button onClick={compareCountries} className={styles.button} disabled={loading}>
          {loading ? "Loading..." : "Compare"}
        </button>
      </div>

      <div className={styles.chartContainer}>
        {series.length > 0 && (
          <Line
            data={{
              labels: series[0]?.data?.map((d) => d.year) || [],
              datasets: series.map((s, i) => ({
                label: s.label,
                data: s.data.map((d) => d.value),
                borderColor: i === 0 ? "#3B82F6" : "#10B981",
                tension: 0.3,
              })),
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
