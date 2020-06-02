import React, { useEffect, useState } from "react";
import axios from 'axios';

// Component imports
import Post from './Post';

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/posts')
      .then(res => {
        setPosts(res.data);
      })
  }, []);

  return (
    <>
      {posts?.map((post, idx) => (
        <Post data={post} key={idx}/>
      ))}
    </>
  );
};

export default Posts;
