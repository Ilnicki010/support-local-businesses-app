import React from "react";
// import _ from "lodash";
import styles from "./TextSearchInput.module.scss";
import { FREETEXT_PLACEHOLDER_TEXT } from "../../constants";

class TextSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.keywords };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.sendTextToCallback = this.sendTextToCallback.bind(this);
  }

  sendTextToCallback() {
    const { value } = this.state;
    this.props.filteredValuesHandler({ text: value }, false);
  }

  handleKeyDown(e) {
    if (e.keyCode === 9 || e.keyCode === 13) {
      //tab key - return key
      this.sendTextToCallback();
    }
  }

  handleOnBlur(event) {
    this.sendTextToCallback();
  }

  // called on every keypress
  handleChange(event) {
    this.setState({ value: event.target.value });
    // TODO: Get debouncing to work so we are not sending requests on every character
    // for now, we won't do anything on change, only on blur, tab ro return
    // _.debounce(this.sendTextToCallback, 250);
    // if (event.target.value.length >= 3) this.sendTextToCallback();
  }

  handleSubmit(event) {
    alert("A name was submitted: " + this.state.value);
    event.preventDefault();
  }

  render() {
    const displayStyle = this.props.textSearchBoxVisible
      ? styles.textInput
      : styles["textInput-invisible"];
    return (
      <div className={styles.textSearchInput}>
        <input
          className={displayStyle}
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
          placeholder={FREETEXT_PLACEHOLDER_TEXT}
          onKeyDown={this.handleKeyDown}
          onBlur={this.handleOnBlur}
        />
      </div>
    );
  }
}
export default TextSearchInput;
