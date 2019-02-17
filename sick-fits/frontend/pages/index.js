//import React from 'react'; -- next.js imports for us
import Link from 'next/link';

const Home = props => (
  <div>
    <p>Helllooo</p>
    <Link href="/sell">
      <a>Sell</a>
    </Link>
  </div>
);

export default Home;
