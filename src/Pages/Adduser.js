import React, { useEffect, useState } from 'react'
import Header from '../compomemt/header';
import { Button, Dropdown, Form, Modal } from 'react-bootstrap';
import '../index.css';
import trash from "../assets/img/trash.png";
import axios from 'axios';
import { getToken } from '../localstorage/token';
import qs from 'qs';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from 'react-router-dom';
import { Autocomplete, Box, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faArrowCircleLeft, faArrowLeft, faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';

function AddUser() {
  const [getUserData , setGetUserData] = useState ([]);
  const [getDataRoom, setGetDataRoom] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedItemData, setSelectedItemData] = useState(null);
  const {id} = useParams();
  const navigate = useNavigate();

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


  const [submittedUsers, setSubmittedUsers] = useState([]);

  const handleFormSubmit = (event) => {
    if(getToken() === null){
      navigate('/');
    }

    const dataRoomm = id;
    event.preventDefault();


    if (submittedUsers.includes(selectedUserId)) {
      toast.error('این کاربر از قبل وجود دارد');
      return;
    }


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
          setSubmittedUsers((prevUsers) => [...prevUsers, selectedUserId]);

        })
        .catch((error) => {
          console.log(error);
        });
  };
  const handleBackHome = () => {
    navigate('/home')
  }

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
    label: `${user.phone} - ${user.name}`,
  }));

  const filterOptions = (options, { inputValue }) => {
    const inputText = inputValue.trim().toLowerCase();
  
    return options.filter(option => 
      option.label.toLowerCase().includes(inputText) ||
      option.label.toLowerCase().includes(inputText) ||
      option.id.toString().includes(inputText) 
    );
  };


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
            <div className='btns-box-user'>
              <div className="btn-plus btn-arrow-left" onClick={handleBackHome}>
                <FontAwesomeIcon icon={faAngleLeft} />
              </div>
              <div typeof="submit" className="btn-plus" onClick={handleFormSubmit}>
                اضافه کردن
              </div>
            </div>
            <div className='search-user-adduser'>
               <Autocomplete
                  id="country-select-demo"
                  options={userOptions}
                  autoHighlight
                  getOptionLabel={(option) => option.label}
                  filterOptions={filterOptions}
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
              <div className="row-list row-list-adduser">
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
      <ToastContainer/>
    </>
  )
}
export default AddUser;
