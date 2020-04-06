import React from 'react';

// Style components
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background: whitesmoke;
  border: 1px solid darkgray;
  padding: 1%;
  margin-bottom: 2%;
  width: 75%;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 2px 4px 8px #444;
    background: lightgray;
    transition: all 0.3s ease;
  }
`

const Post = ({ data }) => {
  return (
    <Wrapper>
      <Card>
        <h2>{data?.title}</h2>
        <p>{data?.contents}</p>
      </Card>
    </Wrapper>
  );
}

export default Post;
