import React from 'react';

const SvgrMock = (props, ref) => <svg ref={ref} {...props} />

export const ReactComponent = React.forwardRef(SvgrMock)
export default ReactComponent
