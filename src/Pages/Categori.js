import { Button, Modal } from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import Header from "../compomemt/header";
import axios from "axios";
import qs from 'qs';
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import { Radio } from "@mui/material";
import { useApiData } from "../compomemt/getDataGroup";

export function Categori() {
    const {groups, suubGroups, mainGroups, radioo} = useApiData();

    const [mainGroup, setMainGroup] = useState([]);
    const [subGroups, setSubGroups] = useState([]);
    const [Groups, setGroups] = useState([]);
    
    const [editmainGroup, setEditMainGroup] = useState([]);
    const [editsubGroups, setEditSubGroups] = useState([]);
    const [editGroups, setEditGroups] = useState([]);

    const [selectedMainGroupId, setSelectedMainGroupId] = useState(null);
    const [selectedSubGroupId, setSelectedSubGroupId] = useState(null);
    const [selectedSuubGroupId, setSelectedSuubGroupId] = useState(null);
    const [selectedCheckboxIds, setSelectedCheckboxIds] = useState([]);

    const [selectedٍEditMainGroupId, setSelectedEditMainGroupId] = useState(null);
    const [selectedEditSubGroupId, setSelectedEditSubGroupId] = useState(null);
    const [selectedEditSuubGroupId, setSelectedEditSuubGroupId] = useState(null);
    const [selectedEditCheckboxIds, setSelectedEditCheckboxIds] = useState([]);

    const [getDataGroup, setDataGroup] = useState([]); 
    const [showModal, setShowModal] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [editItem, setEditItem] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [getDataUser, setGetDataUser] = useState([]);
    const [hasSetDataGroup, setHasSetDataGroup] = useState(false);
    const [getdataGroupModal , setGetdataGroupModal] = useState([]);
    const [modalData, setModalData] = useState({
        name: editItem ? editItem.name : '',
        main_group: selectedٍEditMainGroupId || '', 
        group: selectedEditSubGroupId || '', 
        sub_group: selectedEditSuubGroupId || '', 
        hall_id: selectedEditCheckboxIds.join(','),
    });

    const [radio, setRadio] = useState([
        { id: 1, label: 'عرضه داخلی', checked: false },
        { id: 2, label: 'عرضه صادراتی', checked: false },
        { id: 3, label: 'بازار فرعی', checked: false },
        { id: 4, label: 'عرضه املاک', checked: false },
        { id: 5, label: 'عرضه مستقلات', checked: false },
        // { id: 6, label: 'بازار خودرو', checked: false },
        // { id: 7, label: 'بازار املاک', checked: false },
    ]);

    const handleCheckboxChange = (radioId) => {
        const updatedCheckboxes = radio.map((item) =>
            item.id === radioId ? { ...item, checked: !item.checked } : item
        );
        setRadio(updatedCheckboxes);

        const updatedSelectedCheckboxIds = updatedCheckboxes
            .filter((item) => item.checked)
            .map((item) => item.id);
        setSelectedCheckboxIds(updatedSelectedCheckboxIds);
    };

    // edit
        const handleEditCheckboxChange = (id) => {
            const updatedCheckboxes = radio.map((radio) =>
            radio.id === id ? { ...radio, checked: !radio.checked } : radio
            );
            setRadio(updatedCheckboxes);
            const selectedIds = updatedCheckboxes.filter((radio) => radio.checked).map((radio) => radio.id);
            setSelectedEditCheckboxIds(selectedIds);
        };
    // edit

    useEffect(() => {
        axios.get(`https://api.ibrokers.ir/bourse/group/main-group/`)
            .then((response) => {
                setMainGroup(response.data);
                setEditMainGroup(response.data);
                // console.log(mainGroup);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const sendDataToServer = async () => {
        if (groupName === '' || selectedMainGroupId === '' || selectedSuubGroupId === '' || selectedSubGroupId === '' || selectedCheckboxIds.length === 0){
            toast.error('تمام قسمت هارا کامل کنید');
            return;
        }
    
        let data = qs.stringify({
            'name': groupName, 
            'main_group': selectedMainGroupId,
            'group': selectedSubGroupId,
            'sub_group': selectedSuubGroupId,
            'hall_id': selectedCheckboxIds.join(',') 
        });
        
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://panel.ibrokers.ir/api/panel/rooms/',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
        };
    
        try {
            const response = await axios.request(config);
            // console.log(JSON.stringify(response.data));
    
            setGroupName('');
            setSelectedMainGroupId(null);
            setSelectedSubGroupId(null);
            setSelectedSuubGroupId(null);
            setSelectedCheckboxIds([]);
    
            setDataGroup((prevData) => [...prevData, response.data]);
    
            toast.success('گروه با موفقیت اضافه شد');
        } catch (error) {
            console.log(error);
            toast.error('خطا در ارسال داده');
        }
    };
    
    const handleMainGroupChange = (e) => {
        const selectedId = parseInt(e.target.value, 10);
        setSelectedMainGroupId(selectedId);

        axios.get(`https://api.ibrokers.ir/bourse/group/group/`)
            .then((response) => {
                setGroups(response.data);
                const filteredSubGroups = response.data.filter(group => group.parentId === selectedId);
                setSubGroups(filteredSubGroups);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // edit
    const handleEditMainGroupChange = (e) => {
        e.persist();
        const selectedId = parseInt(e.target.value, 10);
        setSelectedEditMainGroupId(selectedId);

        axios.get(`https://api.ibrokers.ir/bourse/group/group/`)
            .then((response) => {
                setEditGroups(response.data);
                const filteredSubGroups = response.data.filter(group => group.parentId === selectedId);
                setEditGroups(filteredSubGroups);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    // edit

    const handleSubGroupChange = (e) => {
        const selectedId = parseInt(e.target.value, 10);
        setSelectedSubGroupId(selectedId);
        console.log(selectedSubGroupId);

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

    // edit
        const handleEditSubGroupChange = (e) => {
            const selectedId = parseInt(e.target.value, 10);
            setSelectedEditSubGroupId(selectedId);

            axios.get(`https://api.ibrokers.ir/bourse/group/sub-group/`)
                .then((response) => {
                    setEditSubGroups(response.data);
                    const filteredSubGroups = response.data.filter(group => group.parentId === selectedId);
                    setEditSubGroups(filteredSubGroups);
                })
                .catch((error) => {
                    console.log(error);
                });
        };
    // edit

    useEffect(() => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://panel.ibrokers.ir/api/panel/users/',
            headers: { }
          };
          
          axios.request(config)
          .then((response) => {
            // console.log(response.data['results']);
          })
          .catch((error) => {
            console.log(error);
          });          
    }, [])

    useEffect(() => {
        if (!hasSetDataGroup) {
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'https://panel.ibrokers.ir/api/panel/rooms/',
                headers: {}
            };
    
            axios.request(config)
                .then((response) => {
                    // console.log(JSON.stringify(response.data));
                    setDataGroup([...response.data['results']]);
                    setGetDataUser(response.data['results']);
                    setHasSetDataGroup(true);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [hasSetDataGroup]);

    const handleDeleteConfirm = async () => {
        try {
            let config = {
                method: 'delete',
                maxBodyLength: Infinity,
                url: `https://panel.ibrokers.ir/api/panel/rooms/${itemToDelete}/`,
                headers: { }
            };
              
            axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                setDataGroup((prevData) => prevData.filter(item => item.id !== itemToDelete));
                toast.success('گروه با موفقیت حذف شد')
            })
              
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

    // edit
        const handleEditSuubGroupChange = (e) => {
            const selectedId = parseInt(e.target.value, 10);
            setSelectedEditSuubGroupId(selectedId);
        };
    // edit
   
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
            setModalData({
                name: itemToEdit.name,
                main_group: itemToEdit.main_group,
                group: itemToEdit.group,
                sub_group: itemToEdit.sub_group,
                hall_id: itemToEdit.hall_id,
            });
            setShowEditModal(true);
        }
    };

    const handleEditSave = async () => {
        try {
            const data = qs.stringify({
                'name': modalData.name,
                'main_group': selectedٍEditMainGroupId || modalData.main_group,
                'group': selectedEditSubGroupId || modalData.group,
                'sub_group': selectedEditSuubGroupId || modalData.sub_group,
                'hall_id': selectedEditCheckboxIds.join(',') || modalData.hall_id
            });
        
            const config = {
                method: 'put',
                url: `https://panel.ibrokers.ir/api/panel/rooms/${editItem.id}/`,
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: data
            };
        
            const response = await axios.request(config);
            console.log(JSON.stringify(response.data));
            setDataGroup((prevData) => {
                return prevData.map(item => {
                    if (item.id === editItem.id) {
                        return response.data;
                    }
                    return item;
                });
            });

            toast.success('اطلاعات ویرایش شد')
        
            setShowEditModal(false);
            setEditItem(null);
        } catch (error) {
            console.log(error.response);
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
                                        {radio.map((item) => (
                                            <div className="div-check-box-selected selected-home" 
                                                key={item.id}
                                            >
                                                <label
                                                    style={{
                                                        fontFamily: 'sans',
                                                        fontSize: '14px'
                                                    }}
                                                    className="form-check-label"
                                                    htmlFor={`radio-${item.id}`}
                                                >
                                                    {item.label}
                                                </label>
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    value=""
                                                    id={`radio-${item.id}`}
                                                    name="checkbox-group"
                                                    defaultChecked={item.id === modalData?.hall_id}
                                                    onChange={() => handleEditCheckboxChange(item.id)}
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
                                    <label>نام گروه</label>
                                    </div>
                                    <div className="div-input-select">
                                    <input className="input-name"
                                        value={modalData?.name}
                                        onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="div-input-lable-home">
                                    <label> نام گروه</label>
                                    </div>
                                </div>
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
                                            onChange={handleEditMainGroupChange}
                                            defaultValue={modalData.main_group}>
                                            <option selected>انتخاب کنید</option>
                                            {editmainGroup.map((group) => (
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
                                            onChange={handleEditSubGroupChange}
                                            defaultValue={groups.find(item => item.id === modalData.group).persianName}
                                            >
                                            <option selected>{groups.find(item => item.id === modalData.group).persianName}</option>
                                            {editGroups
                                                .filter(group => group.parentId === selectedٍEditMainGroupId)
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
                                            defaultValue={suubGroups.find(item => item.id === modalData.sub_group).persianName}
                                            onChange={handleEditSuubGroupChange}
                                            >
                                            <option selected>{suubGroups.find(item => item.id === modalData.sub_group).persianName}</option>
                                            {editsubGroups.map((SubGroup) => (
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
                                {radio.map((radio) => (
                                    <div className="div-check-box-selected" key={radio.id}>
                                        <label 
                                            style={{
                                                fontFamily: 'sans',
                                                fontSize: '14px'
                                            }} 
                                            class="form-check-label" 
                                            for="flexCheckDefault"
                                            htmlFor={`checkbox-${radio.id}`}>
                                            {radio.label}
                                        </label>
                                        <input 
                                            class="form-check-input" 
                                            type="radio" 
                                            value="" 
                                            id={`radio-${radio.id}`}
                                            name="checkbox-group"
                                            checked={radio.checked}
                                            onChange={() => handleCheckboxChange(radio.id)}
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
                                        style={{
                                            fontFamily: 'sans',
                                            fontSize: '14px'
                                        }}
                                        // value={selectedSubGroupId || ''}
                                        value={selectedSuubGroupId !== null ? selectedSuubGroupId : ''}
                                        onChange={handleSuubGroupChange}>
                                        <option selected>انتخاب کنید</option>
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
                                        <option selected>انتخاب کنید</option>
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
                                            <option selected>انتخاب کنید</option>
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
                                                <p>{radioo.find(item => item.id === data.hall_id)?.label}</p>
                                                <span> : نوع دسته بندی</span>
                                            </div>
                                            <div className="item-inset-div-list">
                                                <p>{suubGroups.find(item => item.id === data.sub_group)?.persianName}</p>
                                                <span> : زیر دسته بندی</span>
                                            </div>
                                            <div className="item-inset-div-list">
                                                <p>{groups.find(item => item.id === data.group)?.persianName}</p>
                                                <span> : دسته بندی</span>
                                            </div>
                                            <div className="item-inset-div-list">
                                                <p>{mainGroups.find(item => item.id === data.main_group)?.persianName}</p>
                                                <span> : دسته بندی اصلی</span>
                                            </div>
                                            <div className="item-inset-div-list">
                                                <p>{data?.name}</p>
                                                <span> : نام</span>
                                            </div>
                                            <div className="btn-row-list-res">
                                                <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit(data?.id)}/>
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