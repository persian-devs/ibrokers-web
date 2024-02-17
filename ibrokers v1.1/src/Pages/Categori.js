import { Button, Col, Container, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import Header from "../compomemt/header";
import axios from "axios";
import qs from 'qs';
import { ToastContainer, toast } from "react-toastify";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export function Categori() {
    const [mainGroup, setMainGroup] = useState([]);
    const [subGroups, setSubGroups] = useState([]);
    const [Groups, setGroups] = useState([]);
    const [selectedMainGroupId, setSelectedMainGroupId] = useState(null);
    const [selectedSubGroupId, setSelectedSubGroupId] = useState(null);
    const [selectedSuubGroupId, setSelectedSuubGroupId] = useState(null);
    const [selectedCheckboxIds, setSelectedCheckboxIds] = useState([]);
    const [getDataGroup, setDataGroup] = useState([]); 
    const [showModal, setShowModal] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [editItem, setEditItem] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [getDataUser, setGetDataUser] = useState([]);

    const [selectedMainGroupModalId, setSelectedMainGroupModalId] = useState(null);
    const [selectedSubGroupModalId, setSelectedSubGroupModalId] = useState(null);
    const [selectedSuubGroupModalId, setSelectedSuubGroupModalId] = useState(null);
    const [selectedCheckboxIdsModal, setSelectedCheckboxIdsModal] = useState([]);

    const [checkboxes, setCheckboxes] = useState([
        { id: 1, label: 'باراز فیزیکی', checked: false },
        { id: 2, label: 'بازار مشتقه', checked: false },
        { id: 3, label: 'بازار فرعی', checked: false },
        { id: 4, label: 'بازار پریمیوم', checked: false },
        { id: 5, label: 'بازار نقره ای', checked: false },
        { id: 6, label: 'بازار خودرو', checked: false },
        { id: 7, label: 'بازار املاک', checked: false },
    ]);

    const handleCheckboxChange = (id) => {
        const updatedCheckboxes = checkboxes.map((checkbox) =>
          checkbox.id === id ? { ...checkbox, checked: !checkbox.checked } : checkbox
        );
        setCheckboxes(updatedCheckboxes);
        const selectedIds = updatedCheckboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.id);
        setSelectedCheckboxIds(selectedIds);
    };

    useEffect(() => {
        axios.get(`https://api.ibrokers.ir/bourse/group/main-group/`)
            .then((response) => {
                setMainGroup(response.data);
                console.log(mainGroup);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const sendDataToServer = async () => {
        window.location.reload();
        let data = qs.stringify({
          'name': groupName, 
          'main_group': selectedMainGroupId,
          'group': selectedSuubGroupId,
          'sub_group': selectedSubGroupId,
          'hall_id': selectedCheckboxIds.join(',') 
        });
        console.log(data);
        
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://panel.ibrokers.ir/api/panel/rooms/',
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data : data
        };
        
        axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
        
    };
    
    const handleMainGroupChange = (e) => {
        const selectedId = parseInt(e.target.value, 10);
        setSelectedMainGroupId(selectedId);

        axios.get(`https://api.ibrokers.ir/bourse/group/group/`)
            .then((response) => {
                setGroups(response.data);
                const filteredSubGroups = response.data.filter(group => group.parentId === selectedId);
                setGroups(filteredSubGroups);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    
    const handleSubGroupChange = (e) => {
        const selectedId = parseInt(e.target.value, 10);
        setSelectedSubGroupId(selectedId);

        axios.get(`https://api.ibrokers.ir/bourse/group/sub-group/`)
            .then((response) => {
                setSubGroups(response.data);
                const filteredSubGroups = response.data.filter(group => group.parentId === selectedId);
                setSubGroups(filteredSubGroups);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://panel.ibrokers.ir/api/panel/users/',
            headers: { }
          };
          
          axios.request(config)
          .then((response) => {
            console.log(response.data['results']);
          })
          .catch((error) => {
            console.log(error);
          });          
    }, [])

    useEffect(() => {
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'https://panel.ibrokers.ir/api/panel/rooms/',
          headers: { }
        };
        
        axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          setDataGroup(response.data['results']);
          setGetDataUser(response.data['results'])
          console.log(getDataGroup);
        })
        .catch((error) => {
          console.log(error);
        });
    }, []);

    const handleDeleteConfirm = async () => {
        window.location.reload();
        try {
            const config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: `https://panel.ibrokers.ir/api/panel/rooms/${itemToDelete}/`,
            headers: {},
            };

            await axios.request(config);

            setShowDeleteModal(false);
            setItemToDelete(null);
        } catch (error) {
            console.error(error);
        }
    };
    
    const handleSuubGroupChange = (e) => {
        const selectedId = parseInt(e.target.value, 10);
        setSelectedSuubGroupId(selectedId);
    };
   
    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleGroupNameChange = (e) => {
        setGroupName(e.target.value);
    };

    const handleDelete = (productId) => {
        setItemToDelete(productId);
        setShowDeleteModal(true);
    };
    
    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setItemToDelete(null);
    };

    const handleEditCancel = () => {
        setShowEditModal(false);
        setEditItem(null);
    };

    const handleEdit = (productId) => {
        const itemToEdit = getDataUser.find((item) => item.id === productId);
        if (itemToEdit) {
          setEditItem(itemToEdit);
          setShowEditModal(true);
        }
    };

    const handleEditSave = async () => {
        window.location.reload();
        try {
    
          const data = qs.stringify({
            'main_group': selectedMainGroupId,
            'group': selectedSubGroupId,
            'sub_group': selectedSuubGroupId,
            'hall_id': selectedCheckboxIds.join(',')
          });
          console.log(data);
    
          const config = {
            method: 'patch',
            url: `https://panel.ibrokers.ir/api/panel/rooms/${editItem.id}/`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
          };
    
          const response = await axios.request(config);
          console.log(JSON.stringify(response.data));
    
          setShowEditModal(false);
          setEditItem(null);
        } catch (error) {
          console.log(error);
        }
    
    };

    
    return (
        <>
            <Header/>
            
            {editItem !== null && (
                <Modal show={showEditModal} centered className="modal-edit-home">
                    <Modal.Header>
                        <Modal.Title className="titr-modal">ویرایش گروه</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={(e) => {
                        e.preventDefault();
                        }}>
                        <div className="body-edit-home" style={{ marginTop: '24px' }}>
                            <div className="box-check-box-selected-home">
                            <div className="check-box-selected-home">
                                <label style={{
                                fontFamily: 'sans',
                                fontSize: '14px'
                                }}
                                class="form-check-label"
                                for="flexCheckDefault"> انتخاب دسته بندی
                                </label>
                                <div className="box-checked">
                                {checkboxes.map((checkbox) => (
                                    <div className="div-check-box-selected selected-home" key={checkbox.id}>
                                    <label
                                        style={{
                                        fontFamily: 'sans',
                                        fontSize: '14px'
                                        }}
                                        class="form-check-label"
                                        for="flexCheckDefault"
                                        htmlFor={`checkbox-${checkbox.id}`}>
                                        {checkbox.label}
                                    </label>
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id={`checkbox-${checkbox.id}`}
                                        checked={checkbox.checked}
                                        onChange={() => handleCheckboxChange(checkbox.id)}
                                        style={{
                                        backgroundColor: '#FFD600',
                                        border: 'none'
                                        }}
                                    />
                                    </div>
                                ))}
                                </div>
                            </div>

                            </div>

                            <div className="box-selected-home">
                            <div className="selected-home">
                                <div className="div-input-lable-res-home">
                                <label>دسته بندی اصلی</label>
                                </div>
                                <div className="div-input-select">
                                <select class="form-select"
                                    style={{
                                    fontFamily: 'sans',
                                    fontSize: '14px'
                                    }}
                                    onChange={handleMainGroupChange}
                                    value={selectedMainGroupId || ''}>
                                    <option selected>انتخاب کنید</option>
                                    {mainGroup.map((group) => (
                                    <option key={group.id} value={group.id}>{group.persianName}</option>
                                    ))}
                                </select>
                                </div>
                                <div className="div-input-lable-home">
                                <label> دسته بندی اصلی</label>
                                </div>
                            </div>
                            <div className="selected-home">
                                <div className="div-input-lable-res-home">
                                <label> دسته بندی</label>
                                </div>
                                <div className="div-input-select">
                                <select class="form-select"
                                    style={{
                                    fontFamily: 'sans',
                                    fontSize: '14px'
                                    }}
                                    onChange={handleSubGroupChange}
                                    value={selectedSubGroupId || ''}>
                                    <option selected>انتخاب کنید</option>
                                    {Groups
                                    .filter(group => group.parentId === selectedMainGroupId)
                                    .map((group) => (
                                        <option key={group.id} value={group.id}>{group.persianName}</option>
                                    ))}
                                </select>
                                </div>
                                <div className="div-input-lable-home">
                                <label> دسته بندی</label>
                                </div>
                            </div>
                            <div className="selected-home">
                                <div className="div-input-lable-res-home">
                                <label> زیر دسته بندی</label>
                                </div>
                                <div className="div-input-select-home">
                                <select class="form-select"
                                    style={{
                                    fontFamily: 'sans',
                                    fontSize: '14px'
                                    }}
                                    value={selectedSuubGroupId !== null ? selectedSuubGroupId : ''}
                                    onChange={handleSuubGroupChange}>
                                    <option selected>انتخاب کنید</option>
                                    {subGroups.map((SubGroup) => (
                                    <option key={SubGroup.id} value={SubGroup.id}>{SubGroup.persianName}</option>
                                    ))}
                                </select>
                                </div>
                                <div className="div-input-lable-home">
                                <label> زیر دسته بندی</label>
                                </div>
                            </div>
                            </div>
                        </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer className="footer-modal">
                        <Button className="btn-modal-cancell-edit" onClick={handleEditCancel}>
                        انصراف
                        </Button>
                        <Button className="btn-modal-save-edit" onClick={handleEditSave}>
                        ذخیره
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
            
            
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

            <Modal centered show={showModal} onHide={handleCloseModal}>
                <Modal.Header className="body-modal-category">
                    <p>نام گروه را مشخص کنید</p>
                </Modal.Header>
                <Modal.Body className="body-modal">
                    <input
                        type="text"
                        id="groupNameinput"
                        value={groupName}
                        onChange={handleGroupNameChange}
                    />
                </Modal.Body>
                <Modal.Footer className="footer-modal">
                    <Button variant="dark" onClick={handleCloseModal}>
                        بازگشت
                    </Button>
                    <Button className="btn-add-to-group" onClick={() => {
                            handleCloseModal();
                            sendDataToServer();
                        }}>
                        ثبت و افزودن
                    </Button>
                </Modal.Footer>
            </Modal>

            <div>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleShowModal();}}>
                    <div className="body-categiry" style={{marginTop: '24px'}}>
                        <div className="div-sabt-afzodan">
                            <div className="btn-div-sabt-afzodan">
                                <button type="submit" class="btn-add btn-warning">ثبت و افزودن</button>
                            </div>
                            <div className="div-select-bazar">
                                <div className="div-title-categori">
                                    <p className="title-categori">عرضه ها</p>
                                </div>
                            </div>
                        </div>

                        <div className="box-check-box-selected">
                            <div className="div-title-categori">
                                <p className="title-categorii">دسته بندی</p>
                            </div>
                            <div className="check-box-selected-category">
                                {checkboxes.map((checkbox) => (
                                    <div className="div-check-box-selected" key={checkbox.id}>
                                        <label 
                                            style={{
                                            fontFamily: 'sans',
                                            fontSize: '14px'}} 
                                            class="form-check-label" 
                                            for="flexCheckDefault"
                                            htmlFor={`checkbox-${checkbox.id}`}>
                                            {checkbox.label}
                                        </label>
                                        <input 
                                            class="form-check-input" 
                                            type="checkbox" 
                                            value="" 
                                            id={`checkbox-${checkbox.id}`}
                                            checked={checkbox.checked}
                                            onChange={() => handleCheckboxChange(checkbox.id)}
                                            style={{backgroundColor: '#FFD600',
                                            border: 'none'}}
                                            />
                                    </div>
                                ))} 
                            </div>
                        </div>

                        <div className="box-selected">
                            <div className="selected">
                                <div className="div-input-lable-res">
                                    <label> : زیر دسته بندی</label>
                                </div>
                                <div className="div-input-select">
                                    <select class="form-select" 
                                        style={{fontFamily: 'sans',
                                        fontSize: '14px'}}
                                        // value={selectedSubGroupId || ''}
                                        value={selectedSuubGroupId !== null ? selectedSuubGroupId : ''}
                                        onChange={handleSuubGroupChange}>
                                        <option selected>انتخواب کنید</option>
                                        {subGroups.map((SubGroup) => (
                                            <option key={SubGroup.id} value={SubGroup.id}>{SubGroup.persianName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="div-input-lable">
                                    <label> : زیر دسته بندی</label>
                                </div>
                            </div>
                            <div className="selected">
                                <div className="div-input-lable-res">
                                    <label> : دسته بندی</label>
                                </div>
                                <div className="div-input-select">
                                    <select class="form-select" 
                                        style={{fontFamily: 'sans',
                                        fontSize: '14px'}}
                                        onChange={handleSubGroupChange}
                                        value={selectedSubGroupId || ''}>
                                        <option selected>انتخواب کنید</option>
                                        {Groups
                                            .filter(group => group.parentId === selectedMainGroupId)
                                            .map((group) => (
                                            <option key={group.id} value={group.id}>{group.persianName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="div-input-lable">
                                    <label> : دسته بندی</label>
                                </div>
                            </div>
                            <div className="selected">
                                <div className="div-input-lable-res">
                                    <label> : دسته بندی اصلی</label>
                                </div>
                                    <div className="div-input-select">
                                        <select class="form-select"  
                                            style={{fontFamily: 'sans',
                                            fontSize: '14px'}}
                                            onChange={handleMainGroupChange}
                                            value={selectedMainGroupId || ''}>
                                            <option selected>انتخواب کنید</option>
                                            {mainGroup.map((group) => (
                                                <option key={group.id} value={group.id}>{group.persianName}</option>
                                            ))}
                                        </select>
                                    </div>
                                <div className="div-input-lable">
                                    <label> : دسته بندی اصلی</label>
                                </div>
                            </div>
                        </div>
                        <p className="title-group">گروه های فعلی</p>

                        <div className="container-list">
                            {getDataGroup.map((data) => (
                                <div className="div-list" key={data.id}>
                                    <div className="row-list">
                                        <div className="btn-row-list">
                                            <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit(data?.id)}/>
                                            <FontAwesomeIcon onClick={() => handleDelete(data?.id)} icon={faTrash}/>
                                        </div>
                                        <div style={{ 
                                            textAlign: 'right', 
                                            fontFamily: 'sans', 
                                            fontSize: '14px', 
                                            width: 'min-content'
                                            }}
                                            className="inset-div-list"
                                            >
                                            <div className="item-inset-div-list">
                                                <p>{data?.hall_id}</p>
                                                <span> : نوع دسته بندی</span>
                                            </div>
                                            <div className="item-inset-div-list">
                                                <p>{data?.sub_group}</p>
                                                <span> : زیر دسته بندی</span>
                                            </div>
                                            <div className="item-inset-div-list">
                                                <p>{data?.group}</p>
                                                <span> : دسته بندی</span>
                                            </div>
                                            <div className="item-inset-div-list">
                                                <p>{data?.main_group}</p>
                                                <span> : دسته بندی اصلی</span>
                                            </div>
                                            <div className="item-inset-div-list">
                                                <p>{data?.name}</p>
                                                <span> : نام</span>
                                            </div>
                                            <div className="btn-row-list-res">
                                                <FontAwesomeIcon icon={faEdit}/>
                                                <FontAwesomeIcon onClick={() => handleDelete(data?.id)} icon={faTrash}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </form>
            </div>
            <ToastContainer/>
        </>
    )
}