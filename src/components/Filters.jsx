import React, { Component } from "react";
import Checkbox from "./Checkbox";

class Filters extends Component {
  componentWillMount = () => {
    this.selectedCheckboxes = new Set();
    this.props.filterList.forEach(item => {
      if (item.selected) this.selectedCheckboxes.add(item.value);
    });
    this.filteredValuesHandler();
  };

  toggleCheckbox = label => {
    if (this.selectedCheckboxes.has(label)) {
      this.selectedCheckboxes.delete(label);
    } else {
      this.selectedCheckboxes.add(label);
    }
    this.filteredValuesHandler();
  };

  // send a list of CSV filters back to the callback
  filteredValuesHandler = () => {
    const selectedArray = [];
    this.selectedCheckboxes.forEach(item => selectedArray.push(item));
    this.props.filteredValuesHandler(selectedArray.join(","));
  };

  handleFormSubmit = formSubmitEvent => {
    formSubmitEvent.preventDefault();

    for (const checkbox of this.selectedCheckboxes) {
      console.log(checkbox, "is selected.");
    }
  };

  createCheckboxes = () => this.props.filterList.map(this.createCheckbox);

  createCheckbox = checkboxObj => (
    <Checkbox
      label={checkboxObj.display}
      handleCheckboxChange={this.toggleCheckbox}
      value={checkboxObj.value}
      key={checkboxObj.value}
      selected={checkboxObj.selected || false}
    />
  );

  render() {
    return (
      <div className="filters-container">
        <div className="filters-header-row">Filter by:</div>
        <div className="filters-row">
          <div className="filters-col">{this.createCheckboxes()}</div>
        </div>
      </div>
    );
  }
}

export default Filters;
