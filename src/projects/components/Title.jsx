import React from 'react';

export default function Title({ title }) {
  return (
    <>
      {title.heading === 'h1' && <h1 className={`${title.class} text-blue-600 hover:text-blue-800 transition-colors duration-300`}>{!title.text ? 'Title' : title.text}</h1>}
      {title.heading === 'h2' && <h2 className={`${title.class} text-blue-600 hover:text-blue-800 transition-colors duration-300`}>{!title.text ? 'Title' : title.text}</h2>}
      {title.heading === 'h3' && <h3 className={`${title.class} text-blue-600 hover:text-blue-800 transition-colors duration-300`}>{!title.text ? 'Title' : title.text}</h3>}
      {title.heading === 'h4' && <h4 className={`${title.class} text-blue-600 hover:text-blue-800 transition-colors duration-300`}>{!title.text ? 'Title' : title.text}</h4>}
      {title.heading === 'h5' && <h5 className={`${title.class} text-blue-600 hover:text-blue-800 transition-colors duration-300`}>{!title.text ? 'Title' : title.text}</h5>}
      {title.heading === 'h6' && <h6 className={`${title.class} text-blue-600 hover:text-blue-800 transition-colors duration-300`}>{!title.text ? 'Title' : title.text}</h6>}
    </>
  );
}