//import React from 'react'; -- next.js imports for us
import Items from '../components/Items';

const Home = props => (
  <div>
    <Items page={parseFloat(props.query.page) || 1}></Items>
  </div>
);

export default Home;
