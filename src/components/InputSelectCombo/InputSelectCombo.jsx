import React, { useEffect, useState, useRef } from "react";
import styles from "./InputSelectCombo.module.scss";

const InputSelectCombo = (props) => {
  const [freeText, setFreeText] = useState("");
  const wrapperRef = useRef(null);
  const {
    onClick = () => {},
    onOptionSelect = () => {},
    onFreeTextEntry = () => {},
    onChange = () => {},
    options = [],
    placeholder,
  } = props;
  let lastFreeTextCalledBack = "";

  const getOptionValueForLabel = (label) => {
    const lcLabel = label.toLowerCase();
    const match = options.filter((opt) => lcLabel === opt.label);
    if (match.length) return match[0].value;
  };

  // Called when an item is picked from the dropdown, but also called on every keystroke of data entry
  const change = (event, handler = () => {}) => {
    const sv = getOptionValueForLabel(event.target.value);
    if (sv) {
      setFreeText("");
      if (onOptionSelect) onOptionSelect(sv);
    } else {
      setFreeText(event.target.value);
    }
  };

  const blurred = (event) => {
    const isSelectItem = getOptionValueForLabel(event.target.value);
    if (!isSelectItem && onFreeTextEntry) {
      if (lastFreeTextCalledBack !== freeText) {
        lastFreeTextCalledBack = freeText;
        onFreeTextEntry(freeText);
      }
    }
  };

  const watchForSpecialKeys = (e) => {
    switch (e.key) {
      case "Enter":
        blurred(e);
        e.preventDefault();
        break;
      case "Tab":
        break;
      case "Backspace":
        break;
      default:
        break;
    }
  };

  useEffect(() => {}, []);

  return (
    <div
      ref={wrapperRef}
      className={
        freeText
          ? styles["input-containerdiv-withtext"]
          : styles["input-containerdiv"]
      }
    >
      <input
        className={styles.inputField}
        placeholder={placeholder}
        onClick={(event) => onClick(event, onChange)}
        onChange={(event) => change(event, onChange)}
        onKeyDown={(event) => watchForSpecialKeys(event)}
        onBlur={(event) => blurred(event)}
        list="inputOptions"
      />
      <datalist id="inputOptions">
        {options.map((opt) => (
          <option key={opt.value}>{opt.label}</option>
        ))}
      </datalist>
    </div>
  );
};

export default InputSelectCombo;
