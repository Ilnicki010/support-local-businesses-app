import React, { Component } from "react";
import Select from "react-select";
import { PLACEHOLDER_TEXT } from "../../constants";

import styles from "./Filters.module.scss";

class Filters extends Component {
  state = {
    selectedOption: null
  };

  handleChange = selectedOption => {
    this.setState({ selectedOption }, () => {
      console.log(`Option selected:`, this.state.selectedOption);
      this.props.filteredValuesHandler(selectedOption);
    });
  };

  render() {
    const { selectedOption } = this.state;

    return (
      <div>
        <Select
          className={styles.filter}
          placeholder={PLACEHOLDER_TEXT}
          value={selectedOption}
          onChange={this.handleChange}
          options={this.props.filterList}
        />
      </div>
    );
  }
}

export default Filters;
