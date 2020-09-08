import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
const Error = () => {
  return (
    <Wrapper>
      <div>
        <h1>404</h1>
        <h3>Sorry, The Page You Tried Cannot Be Found</h3>
        <Link to="/" className="btn" style={{ marginRight: 5 }}>
          BACK HOME
        </Link>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  background: var(--clr-primary-10);
  min-height: 100vh;
  text-align: center;
  display: grid;
  place-items: center;
  h1 {
    font-size: 10rem;
  }
  h3 {
    color: var(--clr-grey-3);
    margin-bottom: 1.5rem;
  }
`;

export default Error;
