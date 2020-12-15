import React, {useState, useEffect} from 'react'
import {Container, Icon, Label, Menu, Table} from 'semantic-ui-react'
import './styles/index.css'
import axios from "axios";
import {authFail, authSuccess, checkAuthTimeout} from "../store/actions/auth";

const colors = [
    'green',
    'red',
    'yellow'
];

const UserLists = () => {
    const [color, setColor] = useState('red');
    const [state, setState] = useState(0);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        let user_id = localStorage.getItem("user_id")
        axios
            .post("http://127.0.0.1:8000/list/", { user_id: user_id })
            .then(res => {
                setTableData(res.data.list);
            })
            .catch(err => {
                console.log('error ==> ', err)
            });
    }, []);

    return (
        <Table celled>
            <Table.Header>
                <Table.Row style={{backgroundColor: '#2d2d2d'}}>
                    <Table.HeaderCell>No</Table.HeaderCell>
                    <Table.HeaderCell>First Name</Table.HeaderCell>
                    <Table.HeaderCell>Last Name</Table.HeaderCell>
                    <Table.HeaderCell>Email</Table.HeaderCell>
                    <Table.HeaderCell>Active</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {tableData.map((item, index) => {
                    return (
                        <Table.Row key={index} style={{backgroundColor: colors[item.expired], color: 'white'}}>
                            <Table.Cell>{index + 1}</Table.Cell>
                            <Table.Cell>{item.first_name}</Table.Cell>
                            <Table.Cell>{item.last_name}</Table.Cell>
                            <Table.Cell>{item.email}</Table.Cell>
                            <Table.Cell>{item.is_active}</Table.Cell>
                        </Table.Row>
                    )
                })}

            </Table.Body>
            {/*<Table.Footer>*/}
            {/*    <Table.Row>*/}
            {/*        <Table.HeaderCell colSpan='3'>*/}
            {/*            <Menu floated='right' pagination>*/}
            {/*                <Menu.Item as='a' icon>*/}
            {/*                    <Icon name='chevron left'/>*/}
            {/*                </Menu.Item>*/}
            {/*                <Menu.Item as='a'>1</Menu.Item>*/}
            {/*                <Menu.Item as='a'>2</Menu.Item>*/}
            {/*                <Menu.Item as='a'>3</Menu.Item>*/}
            {/*                <Menu.Item as='a'>4</Menu.Item>*/}
            {/*                <Menu.Item as='a' icon>*/}
            {/*                    <Icon name='chevron right'/>*/}
            {/*                </Menu.Item>*/}
            {/*            </Menu>*/}
            {/*        </Table.HeaderCell>*/}
            {/*    </Table.Row>*/}
            {/*</Table.Footer>*/}
        </Table>
    )
}


export default UserLists