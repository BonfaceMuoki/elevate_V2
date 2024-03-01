import React, { forwardRef } from "react";
import Select from "react-select";

const RSelect = forwardRef(({ ...props },ref) => {
  return (
    <div className="form-control-select">
      <Select
         name="sdd"
        ref={ref}
        className={`react-select-container ${props.className ? props.className : ""}`}
        classNamePrefix="react-select"
        {...props}
      />
    </div>
  );
});

export default RSelect;
