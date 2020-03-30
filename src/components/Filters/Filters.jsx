import React, { Component } from "react";
import Select from "react-select";
// import Creatable, { makeCreatableSelect } from "react-select/creatable";
import { PLACEHOLDER_TEXT } from "../../constants";

import styles from "./Filters.module.scss";

class Filters extends Component {
  state = {
    selectedOption: this.props.filterList && this.props.filterList[0],
    freeText: ""
  };

  components = {
    /* DropdownIndicator: null */
  };

  createOption = (label: string) => ({
    label,
    value: label
  });

  handleKeyDown = (event: SyntheticKeyboardEvent<HTMLElement>) => {
    const { selectedOption } = this.state;
    if (!selectedOption) return;
    // eslint-disable-next-line default-case
    switch (event.key) {
      case "Enter":
      case "Tab":
        console.group("Value Added");
        this.setState({ selectedOption: {} });
        event.preventDefault();
    }
  };

  onInputChange = change => {
    console.log(`onInputChange Option selected:`, change);
    console.log(`Change: ${change}`);
  };

  // This is called only if an item is selected from the dropdown list
  handleChange = selectedOption => {
    console.log(`handleChange Option selected:`, this.state.selectedOption);
    this.setState({ selectedOption }, () => {
      this.props.filteredValuesHandler(selectedOption, true);
    });
  };

  handleCreate = inputValue => {
    this.props.filteredValuesHandler({ text: inputValue }, false);
  };

  render() {
    const { selectedOption } = this.state;

    return (
      <div>
        <Select
          /* noOptionsMessage={() => null} */
          className={styles.filter}
          placeholder={PLACEHOLDER_TEXT}
          value={selectedOption}
          onChange={this.handleChange}
          options={this.props.filterList}
          components={this.components}
          /* onKeyDown={this.handleKeyDown} */
          onInputChange={this.handleInputChange}
          /* onCreateOption={this.handleCreate} */
        />
      </div>
    );
  }
}

export default Filters;
