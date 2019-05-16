import styled from 'styled-components';

const AccountStyles = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  border: 1px solid ${props => props.theme.offWhite};
  box-shadow: ${props => props.theme.bs};
  padding: 2rem;
  border-top: 10px solid red;
  & > p {
    display: grid;
    grid-template-columns: 1fr 5fr;
    margin: 0;
    border-bottom: 1px solid ${props => props.theme.offWhite};
    span {
      padding: 1rem;
      &:first-child {
        font-weight: 900;
        text-align: right;
      }
    }
  }
`;
export default AccountStyles;
