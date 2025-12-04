import React from "react";
import { BeatLoader } from "react-spinners";

const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`flex justify-center items-center h-full ${className || ""}`}>
    <BeatLoader color="#000000ff" size={16} />
  </div>
);

export default Spinner;
