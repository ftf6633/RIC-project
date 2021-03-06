import React, {useState, useEffect} from 'react'
import {Container, Icon, Label, Menu, Table} from 'semantic-ui-react'
import './styles/index.css'
import axios from "axios";
import _ from 'lodash';
import {useHistory, useParams} from "react-router-dom";
import {authFail, authSuccess, checkAuthTimeout} from "../store/actions/auth";

const colors = [
    'black',
    'blue',
    'brown',
];

const colors1 = [
    'black',
    '#0000af',
    '#752a2a',
];


const OtherClientList = () => {
    const [color, setColor] = useState('red');
    const [state, setState] = useState(0);
    const [tableData, setTableData] = useState([]);
    const [users, setUsers] = useState({});

    // let { type, id } = useParams();

    const history = useHistory();

    useEffect(() => {

        let user_id = localStorage.getItem("user_id")

        // let url = '';
        // if(type == 1){
        //     url = "http://127.0.0.1:8000/deleteClient/";
        // } else if(type == 2) {
        //     url = "http://127.0.0.1:8000/cancelClient/";
        // }
        // axios
        //     .post(url, { client_id : id  });

        setTimeout(function () {
            axios
                .post("http://127.0.0.1:8000/getOtherClientList/", { user_id: user_id })
                .then(res => {
                    setTableData(res.data.list);
                    console.log("test", res.data.users)
                    let all_users = _.keyBy(res.data.users, 'id');
                    setUsers(all_users);
                })
                .catch(err => {
                    console.log('error ==> ', err)
                });
        }, 100)

    }, []);

    return (
        <Table celled>
            <Table.Header>
                <Table.Row style={{backgroundColor: '#2d2d2d'}}>
                    <Table.HeaderCell>No</Table.HeaderCell>
                    <Table.HeaderCell>SALES PERSON</Table.HeaderCell>
                    <Table.HeaderCell>CLIENT NAME</Table.HeaderCell>
                    <Table.HeaderCell>STATUS</Table.HeaderCell>
                    <Table.HeaderCell>INSTALL PAYOUT</Table.HeaderCell>
                    <Table.HeaderCell>RIC PAYOUT</Table.HeaderCell>
                    <Table.HeaderCell>WAIT TIME</Table.HeaderCell>
                    <Table.HeaderCell>SALES POTENTIAL</Table.HeaderCell>
                    <Table.HeaderCell>REGIONS</Table.HeaderCell>
                    <Table.HeaderCell>ACTIONS</Table.HeaderCell>
                    <Table.HeaderCell>NOTES</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {tableData.map((item, index) => {
                    let _colors;
                    if(index % 2 == 0){
                        _colors = colors
                    } else {
                        _colors = colors1
                    }
                    return (
                        <Table.Row key={index} style={{backgroundColor: _colors[item.job_state], color: 'white'}}>
                            <Table.Cell>{index + 1}</Table.Cell>
                            <Table.Cell>{users[item.user_id] ? users[item.user_id]['first_name'] + ' ' + users[item.user_id]['last_name'] : ''}</Table.Cell>
                            <Table.Cell>{item.name}</Table.Cell>
                            <Table.Cell>{item.status_name}</Table.Cell>
                            <Table.Cell>{item.install_payout}</Table.Cell>
                            <Table.Cell>{item.ric_payout}</Table.Cell>
                            <Table.Cell>{item.wait_time}</Table.Cell>
                            <Table.Cell>{item.sales_potential}</Table.Cell>
                            <Table.Cell>{item.region}</Table.Cell>
                            <Table.Cell>{item.action_name}</Table.Cell>
                            <Table.Cell>{item.note}</Table.Cell>
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


export default OtherClientList