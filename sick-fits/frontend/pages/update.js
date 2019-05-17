//import React from 'react'; -- next.js imports for us
import Link from 'next/link';
import UpdateItem from "../components/UpdateItem";
import PleaseSignIn from "../components/PleaseSignIn";

const Sell = props => (
  <div>
    <PleaseSignIn>
      <UpdateItem id={props.query.id}/>
    </PleaseSignIn>
  </div>
);

export default Sell;
