import React from "react";
import styles from "./Switch.module.scss";

const Switch = ({ isOn, handleToggle, onColor }) => {
  return (
    <div className={styles.toggleSwitch}>
      <input
        checked={isOn}
        onChange={handleToggle}
        className={styles["react-switch-checkbox"]}
        id={`react-switch-new`}
        type="checkbox"
      />
      <label
        style={{ background: isOn && onColor }}
        className={styles["react-switch-label"]}
        htmlFor={`react-switch-new`}
      >
        <span className={styles["react-switch-button"]} />
      </label>
    </div>
  );
};

export default Switch;
