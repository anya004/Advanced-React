import { Query, Mutation } from 'react-apollo';
import Error from './ErrorMessage';
import gql from 'graphql-tag';
import Table from './styles/Table';
import React from 'react';
import SickButton from './styles/SickButton';
import PropTypes from 'prop-types';
import { throwServerError } from 'apollo-link-http-common';

const possiblePermissions = [
    'ADMIN',
    'USER',
    'ITEMCREATE',
    'ITEMUPDATE',
    'ITEMDELETE',
    'PERMISSIONUPDATE',
];

const UPDATE_PERMISSIONS_MUTATION = gql`
    mutation updatePermissions($permissions: [Permission], $userId: ID!) {
        updatePermissions(permissions: $permissions, userId: $userId) {
            id
            permissions
            name
            email
        }
    }
`;

const ALL_USERS_QUERY = gql`
    query {
        users {
            id
            name
            email
            permissions
        }
    }
`;

const Permissions = (props) => (
    <Query query={ALL_USERS_QUERY}>
        {({data, error, loading}) => (
            <div>
                <Error error={error} />
                <div>
                    <h2>Manage Permissions</h2>
                    <Table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                {possiblePermissions.map(permission => <th key={permission}>{permission}</th>)}
                                <th>👇</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.users.map(user => <UserPermissions user={user} key={user.id}/>)}
                        </tbody>
                    </Table>
                </div>
            </div>
        )}
    </Query>
)

class UserPermissions extends React.Component {
    static propTypes = {
        user: PropTypes.shape({
            name: PropTypes.string,
            email: PropTypes.string,
            id: PropTypes.string,
            permissions: PropTypes.array,
        }).isRequired,
    };
    state = { //seeding the data/inital state
        permissions: this.props.user.permissions,
    };
    handlePermissionChange = (e) => {
        const checkbox = e.target;
        //take copy of state
        let updatedPermissions = [ ...this.state.permissions ];
        // see if you need to remove or add the permission
        if (checkbox.checked) {
            //add permission
            updatedPermissions.push(checkbox.value);
        } else {
            //remove permission
            //var index = updatedPermissions.indexOf(checkbox.value);
            //updatedPermissions.splice(index,1);
            updatedPermissions = updatedPermissions.filter(permission => permission !== checkbox.value);
        }
        this.setState({ permissions: updatedPermissions });
    };

    render() {
        const user = this.props.user;
        return (
            <Mutation
                mutation={UPDATE_PERMISSIONS_MUTATION}
                variables={{
                    permissions: this.state.permissions,
                    userId: this.props.user.id
                }}
            >
                {(updatePermissions, {loading, error}) => (
                    <>
                        { error && <tr><td colSpan="8"><Error error={error} /></td></tr> }
                        <tr>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            {possiblePermissions.map(permission => (
                                <td key={permission}>
                                    <label htmlFor={`${user.id}-permission-${permission}`}>
                                        <input 
                                            id={`${user.id}-permission-${permission}`}
                                            type="checkbox"
                                            checked={this.state.permissions.includes(permission)}
                                            value={permission}
                                            onChange={this.handlePermissionChange}
                                        />
                                    </label>
                                </td>
                            ))}
                            <td>
                                <SickButton
                                    type="button"
                                    disabled={loading}
                                    onClick={updatePermissions}
                                >
                                    Updat{loading ? 'ing':'e'}
                                </SickButton>
                            </td>
                        </tr>
                    </>
            )}
            </Mutation>
        );
    }
}

export default Permissions;