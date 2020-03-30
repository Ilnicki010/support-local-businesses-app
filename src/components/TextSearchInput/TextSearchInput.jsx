import React from "react";
import styles from "./TextSearchInput.module.scss";
import { FREETEXT_PLACEHOLDER_TEXT } from "../../constants";

class TextSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    this.props.filteredValuesHandler({ text: event.target.value }, false);
  }

  handleSubmit(event) {
    alert("A name was submitted: " + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <div className={styles.textSearchInput}>
        <input
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
          placeholder={FREETEXT_PLACEHOLDER_TEXT}
        />
      </div>
    );
  }
}
export default TextSearchInput;
