import React from "react";
import { Link } from "react-router-dom";
import styles from "./HeaderNav.module.scss";

export default function HeaderNav() {
  return (
    <nav className={styles.wrapper}>
      <ul className={styles.list}>
        <li className={styles.listItem}>
          <Link to="/">
            <img src={require("../../assets/Logo.png")} alt="Go to home" />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
