// CloseButton.js
import React from 'react';
import PropTypes from 'prop-types';

const CloseButton = ({ onClick }) => {
  return (
    <button className="close-button" onClick={onClick}>
     X
    </button>
  );
};

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default CloseButton;
