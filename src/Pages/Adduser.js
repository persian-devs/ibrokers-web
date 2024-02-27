import React, { useEffect, useState } from 'react'
import Header from '../compomemt/header';
import { Button, Dropdown, Form, Modal } from 'react-bootstrap';
import '../index.css';
import trash from "../assets/img/trash.png";
import axios from 'axios';
import { getToken } from '../localstorage/token';
import qs from 'qs';
import { useParams } from 'react-router-dom';
import { Autocomplete, Box, TextField } from '@mui/material';

function AddUser() {
  const [getUserData , setGetUserData] = useState ([]);
  const [getDataRoom, setGetDataRoom] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedItemData, setSelectedItemData] = useState(null);
  const {id} = useParams();

  const handleTrashClick = (itemId) => {
    const selectedItem = getDataRoom.find(item => item.id === itemId);
    setSelectedItemData(selectedItem);
  };

  const setSelectedItemDataHidden = () => {
    setSelectedItemData(false);
  }

  const handleUserSelectChange = (event, value) => {
    const selectedId = value ? value.id : null;
    setSelectedUserId(selectedId);
    console.log(selectedId);
  };

  useEffect(() => {
    axios.get('https://panel.ibrokers.ir/api/panel/users/')
      .then((response) => {
        setGetUserData(response.data['results']);
        // console.log(getUserData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const dataRoomm = id;
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://panel.ibrokers.ir/api/panel/user-groups/?room=${dataRoomm}`,
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded', 
        'Authorization': `Bearer ${getToken()}`
      },
    };

    axios.request(config)
    .then((response) => {
      setGetDataRoom(response.data['results'])
      // console.log(getDataRoom.length);
    })
    .catch((error) => {
      console.log(error);
    });
  }, [])

  const handleFormSubmit = (event) => {
    const dataRoomm = id;
    event.preventDefault();
    let data = qs.stringify({
      'user': selectedUserId,
      'room': dataRoomm 
    });
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://panel.ibrokers.ir/api/panel/user-groups/?room=${dataRoomm}?user=${selectedUserId}`,
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded', 
        'Authorization': `Bearer ${getToken()}`
      },
      data : data
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setGetDataRoom(prevData => [...prevData, response.data]);
      })
      .catch((error) => {
        console.log(error);
    });
  };

  const handleDelete = () => {
    if (selectedItemData) {
      const userId = selectedItemData.id;

      let config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: `https://panel.ibrokers.ir/api/panel/user-groups/${userId}`,
        headers: {}
      };
  
      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setGetDataRoom(prevData => prevData.filter(item => item.id !== userId));
      })
      .catch((error) => {
        console.log(error);
      });
    }
    setSelectedItemData(false);
  };

  const userOptions = getUserData.map(user => ({
    id: user.id,
    label: user.phone,
  }));


  return (
    <>

      <Modal centered show={selectedItemData} onHide={setSelectedItemData}>
        <Modal.Body className="body-modal">
          کاربر حذف شود؟
        </Modal.Body>
        <Modal.Footer className="footer-modal">
          <Button variant="dark" onClick={setSelectedItemDataHidden}>
            انصراف
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            حذف
          </Button>
        </Modal.Footer>
      </Modal>

      <Header/>
      <div className='box-add-user'>
        <form>
          <div className="box-user-list-home">
            <div>
              <div typeof="submit" className="btn-plus" onClick={handleFormSubmit}>
                اضافه کردن
              </div>
            </div>
            <div>
               <Autocomplete
                  id="country-select-demo"
                  sx={{ width: 300 }}
                  options={userOptions}
                  autoHighlight
                  getOptionLabel={(option) => option.label}
                  onChange={handleUserSelectChange}
                  renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="جستجوی کاربر"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password',
                      }}
                    />
                  )}
                />
            </div>
          </div>
        </form>
      </div>
      <p className='list-users'>لیست کاربر ها</p>
      <div className="container-list">
        {Array.isArray(getDataRoom) && getDataRoom.map(item => (
          <div className="div-list" key={item.id}>
              <div className="row-list">
                <div className="inset-div-list-input">
                  <img className="trash" src={trash} onClick={() => handleTrashClick(item.id)}></img>
                </div>
                <div style={{ textAlign: 'right', fontFamily: 'sans', fontSize: '14px'}} className="inset-div-list">
                  <div className="it-inset-div">
                    <p> دسته بندی</p>
                    <span>{item.room.main_group}</span>
                  </div>
                  <div className="it-inset-div">
                    <p> شماره موبایل</p>
                    <span>{item.user.phone}</span>
                  </div>
                </div>
                <div className="inset-div-list-input-res">
                  <div className="btns-trash-adduser" onClick={() => handleTrashClick(item.id)}>
                    {/* <FontAwesomeIcon icon={faEdit}/> */}
                    <img style={{marginLeft: '16px'}} className="trash" src={trash}></img>
                  </div>
                </div>
              </div>
          </div>
        ))}
      </div>
      
    </>
  )
}
export default AddUser;
