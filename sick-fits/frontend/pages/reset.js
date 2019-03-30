//import React from 'react'; -- next.js imports for us
import Link from 'next/link';
import Reset from "../components/Reset"

const Sell = props => (
  <div>
    <p>Reset your password</p>
    <Reset resetToken={props.query.resetToken}/>
  </div>
);

export default Sell;
