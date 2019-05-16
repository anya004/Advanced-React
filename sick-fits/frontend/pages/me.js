import PleaseSignIn from '../components/PleaseSignIn';
import Account from '../components/Account';
import RequestReset from '../components/RequestReset';

const AccountPage = props => (
  <div>
    <PleaseSignIn>
      <Account />
    </PleaseSignIn>
  </div>
);

export default AccountPage;