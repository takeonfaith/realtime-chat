import styled from "styled-components";

const FillSpace = styled.div<{ percent: number }>`
  width: ${({ percent }) => (isNaN(percent) ? 0 : percent + "%")};
  background: #2723a4;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  transition: 0.2s;
  opacity: ${({ percent }) => (isNaN(percent) || percent === 0 ? 0 : 1)};
  /* border-radius: var(--brLight); */
`;

export default FillSpace;
