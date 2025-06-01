

import styled, { css } from 'styled-components';

const index_change_button_style = styled.div`
    position: absolute;
    width: ${({ width = '40%' }) => width};
    height: 100%;
    // background-color: rgba(255, 255, 255, 0.5);  // debug
    z-index: 11;
    top: 0%;
    cursor: pointer;
`;
const IndexChangeBt_Left = styled(index_change_button_style)`
    left: 0%;
`;
const IndexChangeBt_Right = styled(index_change_button_style)`
    right: 0%;
`;

export { IndexChangeBt_Left, IndexChangeBt_Right }