import React, { useEffect, useState } from 'react'
import Header from '../compomemt/header';
import { Dropdown, Form } from 'react-bootstrap';
import '../index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import trash from "../assets/img/trash.png";
import axios from 'axios';
import { getToken } from '../localstorage/token';
import qs from 'qs';
import { useParams } from 'react-router-dom';


const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    &#x25bc;
  </a>
));
const CustomMenu = React.forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value, setValue] = useState('');

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <Form.Control
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type to filter..."
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().startsWith(value),
          )}
        </ul>
      </div>
    );
  },
);
function AddUser() {
  const [getUserData , setGetUserData] = useState ([]);
  const [getDataRoom, setGetDataRoom] = useState([]);
  useEffect(() => {
    axios.get('https://panel.ibrokers.ir/api/panel/users/')
      .then((response) => {
        setGetUserData(response.data['results']);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const {id} = useParams();
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
      console.log(JSON.stringify(response.data['results']));
      setGetDataRoom(response.data['results'])
      console.log(response.data['results'])

    })
    .catch((error) => {
      console.log(error);
    });
  }, [])

  const [selectedUserId, setSelectedUserId] = useState('');
  const handleUserSelectChange = (event) => {
    const selectedId = event.target.value;
    setSelectedUserId(selectedId);
  };


  const handleFormSubmit = () => {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://panel.ibrokers.ir/api/panel/user-groups/${selectedUserId}/`,  // استفاده از selectedUserId به جای getdata
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded', 
        'Authorization': `Bearer ${getToken()}`
      },
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        // انجام هر عملیات دیگر در صورت نیاز
      })
      .catch((error) => {
        console.log(error);
      });
  };



    return (
      <>
      <Header/>
      <div className='box-add-user'>
        <form onSubmit={handleFormSubmit}>
          <div className="box-user-list-home">
            
          <div>
            <div typeof="submit" className="btn-plus" onClick={handleFormSubmit}>
              اضافه کردن
            </div>
          </div>
          <div>
          <Form.Select className='select-phone' aria-label="Default select example"  onChange={handleUserSelectChange}>
            <option className='titr-select'>جستجو کاربر</option>
            {getUserData.map(user => (
              <>
              <option key={user.id} value={user.id}>{user?.phone}</option>
              </>
            ))}
          </Form.Select>
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
                  {/* <FontAwesomeIcon style={{marginRight: '16px'}} className="edit" icon={faEdit} onClick={() => handleEditClick(user)} />
                  <img style={{marginLeft: '16px'}} className="trash" src={trash} onClick={() => handleDeleteClick(user.id)}></img> */}
                  {/* <FontAwesomeIcon style={{marginRight: '16px'}} className="edit" icon={faEdit} /> */}
                  <img className="trash" src={trash}></img>
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
                  {/* <div className="btns">
                    <FontAwesomeIcon icon={faEdit} onClick={() => handleEditClick(user)} />
                    <img style={{marginLeft: '16px'}} className="trash" src={trash} onClick={() => handleDeleteClick(user.id)}></img>
                  </div> */}
                  <div className="btns">
                    <FontAwesomeIcon icon={faEdit}/>
                    <img style={{marginLeft: '16px'}} className="trash" src={trash} ></img>
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
