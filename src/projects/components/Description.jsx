import React from 'react';

export default function Description({ description }) {
  return (
    <p className={description.class}>{!description.text ? 'Description' : description.text}</p>
  );
}