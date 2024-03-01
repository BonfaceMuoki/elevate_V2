import React, { useState } from "react";
import { Modal } from "reactstrap";

const ImageContainer = ({ img, width, height }) => {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
  };
  return (
    <a
      className="gallery-image popup-image"
      onClick={(ev) => {
        ev.preventDefault();
        toggle();
      }}
      href="#gallery"
    >
      <img className="rounded-top" style={{ height: `${height}`, width: `${width}` }} src={img} alt="" />
      <Modal isOpen={open} toggle={toggle} size="large">
        <button type="button" className="mfp-close" onClick={toggle}>
          ×
        </button>
        <img className="rounded-top" style={{ height: `${height}`, width: `${width}` }} src={img} alt="" />
      </Modal>
    </a>
  );
};

export default ImageContainer;
