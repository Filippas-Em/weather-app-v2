"use client";

import React, { useEffect, useState, useRef } from "react";

const Select = () => {
  const [selectedValue, setSelectedValue] = useState("today");
  const [underlineStyle, setUnderlineStyle] = useState({});
  const buttonsRef = useRef([]);

  const links = [
    { name: "Today", value: "today" },
    { name: "Tomorrow", value: "tomorrow" },
    { name: "This Week", value: "week" },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlSelected = params.get("selected");
      if (urlSelected) {
        setSelectedValue(urlSelected);
      } else {
        updateURL("today");
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentIndex = links.findIndex((link) => link.value === selectedValue);
      const currentButton = buttonsRef.current[currentIndex];

      if (currentButton) {
        setUnderlineStyle({
          transform: `translateX(${currentButton.offsetLeft - 4}px)`,
          width: `${currentButton.offsetWidth}px`,
        });
      }
    }
  }, [selectedValue]);

  const updateURL = (value) => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.set("selected", value);

      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.pushState({}, "", newUrl);
    }
    setSelectedValue(value);
  };

  return (
    <nav className="nav-container">
      <div className="menu">
        {links.map((link, index) => (
          <button
            key={link.value}
            ref={(el) => (buttonsRef.current[index] = el)}
            className={selectedValue === link.value ? "selected" : ""}
            onClick={() => updateURL(link.value)}
          >
            {link.name}
          </button>
        ))}
        <div className="underline" style={underlineStyle} />
      </div>
    </nav>
  );
};

export default Select;
