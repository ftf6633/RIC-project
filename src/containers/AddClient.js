import React, { Component ,useState, useEffect} from 'react'
import {
    Button,
    Checkbox,
    Form,
    Input,
    Radio,
    Select,
    TextArea,
    Container
} from 'semantic-ui-react'

import {
    DateInput,
    TimeInput,
    DateTimeInput,
    DatesRangeInput
} from 'semantic-ui-calendar-react';

import axios from "axios";
import { useParams } from "react-router-dom";
import _ from "lodash";

const AddClient = () => {

    const [status, setStatus] = useState([])
    const [client, setClient] = useState({})
    let { id } = useParams();

    useEffect(() => {
        axios
            .post("http://127.0.0.1:8000/getClientDetail/", { client_id: id })
            .then(res => {
                let statusList = res.data.status
                for(let idx in statusList){
                    let ele = Object()
                    ele.text = statusList[idx]['name']
                    ele.value = idx;
                    ele.key = idx;
                    status.push(ele)
                }
                setStatus(status)
                setClient(res.data.client[0])

            })
            .catch(err => {
                console.log('error ==> ', err)
            });
    }, []);

    function handleInput(e) {
        e.persist();
        console.log("test==>", e, e.target)
        setClient({
            ...client,
            [e.target.name]: e.target.value,
        })
    }

    function handleSelect(e, data) {
        e.persist();
        console.log("test==>", data.value)
        setClient({
            ...client,
            [data.name]: data.value,
        })
    }

    function handleChangeTime(event, {name, value}) {
        console.log({name, value})
        setClient({
            ...client,
            [name]: value,
        })
    }

    function handleSubmit() {
        client.user_id = localStorage.getItem('user_id')
        axios
            .post("http://127.0.0.1:8000/saveClientDetail/", { data: client })
            .then(res => {
                let result = res.data.status
                if(result == 1){
                    document.location.href = '/main';
                }
            })
            .catch(err => {
                console.log('error ==> ', err)
            });
    }

    function handleCancel() {
        document.location.href = '/main';
    }

    return (
        <container>
            <Form style={{padding:'1%'}}>
                <Form.Group widths='equal'>
                    <Form.Input
                        control={Input}
                        label='Name'
                        placeholder='Name'
                        name={'name'}
                        value={client ? client['name'] : ''}
                        onChange={handleInput}
                    />
                    <Form.Select
                        control={Select}
                        label='Status'
                        options={status}
                        placeholder='Status'
                        name={'status'}
                        value={client && client['status'] !== undefined ? client['status'].toString() : '1' }
                        onChange={handleSelect}
                    />
                    <Form.Input
                        control={Input}
                        label='Install Payout'
                        placeholder='Install Payout'
                        value={client ? client['install_payout'] : ''}
                        name={'install_payout'}
                        onChange={handleInput}
                    />

                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Input
                        control={Input}
                        label='RIC Payout'
                        placeholder='Ric Payout'
                        value={client ? client['ric_payout'] : ''}
                        name={'ric_payout'}
                        onChange={handleInput}
                    />

                    <DateTimeInput
                        placeholder="Date Time"
                        value={client ? client['wait_time'] : ''}
                        iconPosition="left"
                        label='Wait Time'
                        name={'wait_time'}
                        onChange={handleChangeTime}
                    />
                    <Form.Input
                        control={Input}
                        label='Sales Potential'
                        placeholder='Sales Potential'
                        value={client ? client['sales_potential'] : ''}
                        name="sales_potential"
                        onChange={handleInput}
                    />
                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Input
                        control={Input}
                        label='Region'
                        placeholder='Region'
                        value={client ? client['region'] : ''}
                        name="region"
                        onChange={handleInput}
                    />
                    <Form.Input
                        control={Input}
                        label='Notes'
                        placeholder='Notes'
                        value={client ? client['note'] : ''}
                        name="note"
                        onChange={handleInput}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Field control={Button} onClick={handleSubmit}>Save</Form.Field>
                    <Form.Field control={Button} onClick={handleCancel}>Cancel</Form.Field>
                </Form.Group>
            </Form>
        </container>
    )
}

// class AddClient extends Component {
//     state = {}
//
//
//
//     handleChange = (e, { value }) => this.setState({ value })
//
//     render() {
//         const { value } = this.state
//         return (
//             <container>
//                 <Form>
//                     <Form.Group widths='equal'>
//                         <Form.Field
//                             control={Input}
//                             label='Name'
//                             placeholder='Name'
//                         />
//                         <Form.Field
//                             control={Select}
//                             label='Status'
//                             options={options}
//                             placeholder='Status'
//                         />
//                         <Form.Field
//                             control={Input}
//                             label='Install Payout'
//                             placeholder='Install Payout'
//                         />
//
//                     </Form.Group>
//                     <Form.Group widths='equal'>
//                         <Form.Field
//                             control={Input}
//                             label='Wait Time'
//                             placeholder='Wait Time'
//                         />
//                         <Form.Field
//                             control={Input}
//                             label='Sales Potential'
//                             placeholder='Sales Potential'
//                         />
//                         <Form.Field
//                             control={Input}
//                             label='Region'
//                             placeholder='Region'
//                         />
//                     </Form.Group>
//                     <Form.Group widths='equal'>
//                         <Form.Field
//                             control={Input}
//                             label='Notes'
//                             placeholder='Notes'
//                         />
//                     </Form.Group>
//                     <Form.Field control={Button}>Submit</Form.Field>
//                 </Form>
//             </container>
//         )
//     }
// }

export default AddClient