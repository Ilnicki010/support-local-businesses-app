import React from "react";

import PropTypes from "prop-types";

import styles from "./Button.module.scss";

const Button = ({ href, children, secondary, ...props }) => {
  const buttonClass = secondary ? styles.buttonSecondary : styles.button;

  return (
    <>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
        >
          {children}
        </a>
      ) : (
        <button type="button" className={buttonClass} {...props}>
          {children}
        </button>
      )}
    </>
  );
};

Button.propTypes = {
  href: PropTypes.string,
  iconButton: PropTypes.bool,
  children: PropTypes.node,
};
Button.defaultProps = {
  href: null,
  children: null,
  iconButton: false,
};

export default Button;
