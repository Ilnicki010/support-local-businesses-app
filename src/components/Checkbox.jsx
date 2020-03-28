import React, { Component } from "react";

class Checkbox extends Component {
  state = {
    isChecked: this.props.selected
  };

  toggleCheckboxChange = () => {
    const { handleCheckboxChange, value } = this.props;

    this.setState(({ isChecked }) => ({
      isChecked: !isChecked
    }));

    handleCheckboxChange(value);
  };

  render() {
    const { label, value } = this.props;
    const { isChecked } = this.state;

    return (
      <div className="checkbox">
        <label>
          <input
            type="checkbox"
            value={value}
            checked={isChecked}
            onChange={this.toggleCheckboxChange}
          />

          {label}
        </label>
      </div>
    );
  }
}

export default Checkbox;
