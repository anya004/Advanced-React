//import React from 'react'; -- next.js imports for us
import Link from 'next/link';
import UpdateItem from "../components/UpdateItem";

const Sell = props => (
  <div>
    <UpdateItem id={props.query.id}/>
  </div>
);

export default Sell;
