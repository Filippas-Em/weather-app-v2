"use client";

import React, { useEffect, useState } from "react";

const MetricUnits = () => {
  const [selectedUnit, setSelectedUnit] = useState("celsius");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const unitParam = params.get("units");
      if (unitParam) {
        setSelectedUnit(unitParam);
      }
    }
  }, []);

  const updateURL = (unit) => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.set("units", unit);

      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.pushState({}, "", newUrl);
    }
    setSelectedUnit(unit);
  };

  return (
    <div className="metric-units">
      <div className={`slider ${selectedUnit === "fahrenheit" ? "fahrenheit" : ""}`} />
      <button
        onClick={() => updateURL("celsius")}
        className={selectedUnit === "celsius" ? "selected" : ""}
      >
        C°
      </button>
      <button
        onClick={() => updateURL("fahrenheit")}
        className={selectedUnit === "fahrenheit" ? "selected" : ""}
      >
        F°
      </button>
    </div>
  );
};

export default MetricUnits;
