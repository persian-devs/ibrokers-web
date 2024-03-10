import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import trash from "../assets/img/trash.png";
import Header from "../compomemt/header";
import { useEffect, useState } from "react";
import axios from "axios";
import qs from 'qs';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrain } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Userlist() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [getUserData , setGetUserData] = useState ([]);
    
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = async () => {
    try {
      const phoneExists = getUserData.some(user => user.phone === phoneNumber);

      if (phoneExists) {
        toast.error('کاربر قبلا ثبت شده');
      } else {
        const data = qs.stringify({
          name: lastName,
          family: firstName,
          phone: phoneNumber,
        });

        const config = {
          method: 'post',
          url: 'https://panel.ibrokers.ir/api/panel/users/',
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: data
        };

        const response = await axios.request(config);
        setGetUserData(prevData => [...prevData, response.data]);
        toast.success('کاربر با موفقیت اضافه شد')
        setFirstName('')
        setLastName('')
        setPhoneNumber('')
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    axios.get('https://panel.ibrokers.ir/api/panel/users/')
      .then((response) => {
        setGetUserData(response.data['results']);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // console.log(getUserData);

  const handleDeleteClick = (id) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      axios.delete(`https://panel.ibrokers.ir/api/panel/users/${userToDelete}/`)
        .then((response) => {
          setGetUserData(prevData => prevData.filter(user => user.id !== userToDelete));
          // console.log(JSON.stringify(response.data));
          setUserToDelete(null);
          setShowDeleteModal(false);
          toast.success('کاربر با موفقیت حذف شد')
        })
        .catch((error) => {
          console.log(error);
          setUserToDelete(null);
          setShowDeleteModal(false);
        });
    }
  };

  const handleDeleteCancel = () => {
    setUserToDelete(null);
    setShowDeleteModal(false);
  };

  const handleEditClick = (user) => {
    setEditedUser(user);
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    try {
      const response = await axios.patch(`https://panel.ibrokers.ir/api/panel/users/${editedUser.id}/`, editedUser);
      console.log(response.data);
      
      setGetUserData(prevData => prevData.map(user => (user.id === editedUser.id ? response.data : user)));

      setShowEditModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredUsers = getUserData.filter((user) =>
    user.name.includes(searchTerm) ||
    user.family.includes(searchTerm) ||
    user.phone.includes(searchTerm) 
  );



  return (
    <>
      <Modal show={showEditModal} onHide={handleEditCancel} centered>
        <Modal.Header>
          <Modal.Title className="titr-modal">ویرایش کاربر</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editedUser && (
            <form>
              <div className="box-edit-user">
                <div className="div-input-edit">
                  <label> نام خانوادگی</label>
                  <input className="input-edit" type="text" value={editedUser.family} onChange={(e) => setEditedUser({ ...editedUser, family: e.target.value })} />
                </div>
                <div className="div-input-edit">
                  <label> نام</label>
                  <input className="input-edit" type="text" value={editedUser.name} onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })} />
                </div>
                <div className="div-input-edit input-edit-t">
                  <label> شماره موبایل</label>
                  <input className="input-edit" type="text" value={editedUser.phone} onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })} />
                </div>
              </div>
            </form>
          )}
        </Modal.Body>
        <Modal.Footer className="footer-modal">
          <Button  className="btn-modal-cancell-edit" onClick={handleEditCancel}>
            انصراف
          </Button>
          <Button className="btn-modal-save-edit" onClick={handleEditSave}>
            ذخیره 
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleDeleteCancel} centered>
        <Modal.Body className="body-modal">
          کاربر حذف شود؟
        </Modal.Body>
        <Modal.Footer className="footer-modal">
          <Button variant="dark" onClick={handleDeleteCancel}>
            انصراف
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            حذف
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Header/>

      <p className="title-group">اضافه کردن کاربران</p>

      <div>
        <form>
          <div className="box-user-list">
            <div className="col-xl-2 col-input">
              <div typeof="submit" className="btn-plus" onClick={handleSubmit}>
                اضافه کردن
              </div>
            </div>
            <div className="col-p-userlist"> 
              <div className="inset-col-p">
                <div className="div-inset-col-p">
                  <p className="p-res"> نام خانوادگی : </p>
                  <input 
                    className="input" 
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    ></input>
                  <p className="p"> : نام خانوادگی</p>
                </div>
                <div className="div-inset-col-p">
                  <p className="p-res"> نام : </p>
                  <input 
                    className="input" 
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    ></input>
                  <p className="p"> : نام</p>
                </div>
                <div className="div-inset-col-p">
                  <p className="p-res"> شماره تماس : </p>
                  <input 
                    className="input" 
                    type="text"
                    value={`09${phoneNumber}`}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const sanitizedPhoneNumber = inputValue.replace(/\D/g, '');
                      const limitedPhoneNumber = sanitizedPhoneNumber.slice(2, 11);
                      
                      setPhoneNumber(limitedPhoneNumber);
                    }}
                    ></input>
                  <p className="p"> : شماره تماس</p>
                </div>
              </div>
            </div>
            <div className=" col-input-res">
              <div typeof="submit" className="btn-plus" onClick={handleSubmit}>
                اضافه کردن
              </div>
            </div>
          </div>
        </form>
      </div>

      <p className="title-group">لیست کاربران</p>
      <div className="box-search-user-for-name">
        <input
          className="search-user-for-name"
          type="text"
          placeholder="جستجو"
          value={searchTerm}
          onChange={handleSearchChange}
          />
      </div>

      <div className="container-list">
        {filteredUsers.map(user => (
          <div className="div-list" key={user.id}>
              <div className="row-list">
                <div className="inset-div-list-input">
                  <FontAwesomeIcon style={{marginRight: '16px'}} className="edit" icon={faEdit} onClick={() => handleEditClick(user)} />
                  <img style={{marginLeft: '16px'}} className="trash" src={trash} onClick={() => handleDeleteClick(user.id)}></img>
                </div>
                <div style={{ textAlign: 'right', fontFamily: 'sans', fontSize: '14px'}} className="inset-div-list">
                  <div className="it-inset-div">
                    <p> شماره موبایل</p>
                    <span>{user?.phone}</span>
                  </div>
                  <div className="it-inset-div">
                    <p> نام خانوادگی</p>
                    <span>{user?.family}</span>
                  </div>
                  <div className="it-inset-div">
                    <p> نام</p>
                    <span>{user?.name}</span>
                  </div>
                </div>
                <div className="inset-div-list-input-res">
                  <div className="btns">
                    <FontAwesomeIcon icon={faEdit} onClick={() => handleEditClick(user)} />
                    <img style={{marginLeft: '16px'}} className="trash" src={trash} onClick={() => handleDeleteClick(user.id)}></img>
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