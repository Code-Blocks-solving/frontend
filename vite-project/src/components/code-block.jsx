import React from 'react';
import PropTypes from 'prop-types';

function CodeBlock({ codeBlock }) {
    return (
        <div>
            <h1 style={{ fontWeight: 'bold' }}>title:{codeBlock.title}</h1>
            <h2>{codeBlock.code}</h2>
        </div>
    )
}

CodeBlock.propTypes = {
  codeBlock: PropTypes.shape({
    title: PropTypes.string,
    code: PropTypes.string,
    _id: PropTypes.string,
    result: PropTypes.string,
  })
};

export default CodeBlock;