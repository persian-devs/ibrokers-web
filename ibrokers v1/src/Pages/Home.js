import axios from "axios";
import alert from "../assets/img/Vector.png";
import logoheader from "../assets/img/logo-header.png";
import Header from "../compomemt/header";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import qs from 'qs';
import { useNavigate } from "react-router-dom";
export function Home() { 
  const [getDataUser, setGetDataUser] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();
  
  const [mainGroup, setMainGroup] = useState([]);
  const [subGroups, setSubGroups] = useState([]);
  const [Groups, setGroups] = useState([]);
  const [selectedMainGroupId, setSelectedMainGroupId] = useState(null);
  const [selectedSubGroupId, setSelectedSubGroupId] = useState(null);
  const [selectedSuubGroupId, setSelectedSuubGroupId] = useState(null);
  const [selectedCheckboxIds, setSelectedCheckboxIds] = useState([]);
  const [editItem, setEditItem] = useState(null);


  const handleDelete = (productId) => {
    setItemToDelete(productId);
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleCheckboxChange = (checkboxId) => {
    const updatedCheckboxes = checkboxes.map((checkbox) =>
      checkbox.id === checkboxId ? { ...checkbox, checked: !checkbox.checked } : checkbox
    );
    setCheckboxes(updatedCheckboxes);

    const updatedSelectedCheckboxIds = updatedCheckboxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.id);
    setSelectedCheckboxIds(updatedSelectedCheckboxIds);
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

  const handleSuubGroupChange = (e) => {
    const selectedId = parseInt(e.target.value, 10);
    setSelectedSuubGroupId(selectedId);
  };

  const handleEdit = (productId) => {
    const itemToEdit = getDataUser.find((item) => item.id === productId);
    if (itemToEdit) {
      setEditItem(itemToEdit);
      setShowEditModal(true);
    }
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setEditItem(null);
  };


  const fetchData = async () => {
    try {
      const response = await axios.get('https://panel.ibrokers.ir/api/panel/rooms/');
      setGetDataUser(response.data['results']);
      console.log(response.data['results']);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteConfirm = async () => {
    try {
      const config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: `https://panel.ibrokers.ir/api/panel/rooms/${itemToDelete}/`,
        headers: {},
      };

      await axios.request(config);

      fetchData();
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error(error);
    }
  };


  const [checkboxes, setCheckboxes] = useState([
    { id: 1, label: 'باراز فیزیکی', checked: false },
    { id: 2, label: 'بازار مشتقه', checked: false },
    { id: 3, label: 'بازار فرعی', checked: false },
    { id: 4, label: 'بازار پریمیوم', checked: false },
    { id: 5, label: 'بازار نقره ای', checked: false },
    { id: 6, label: 'بازار خودرو', checked: false },
    { id: 7, label: 'بازار املاک', checked: false },
  ]);

  useEffect(() => {
    axios.get(`https://api.ibrokers.ir/bourse/group/main-group/`)
      .then((response) => {
        setMainGroup(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  
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
  const handleGoToAddUser = (groupId) => {
    navigate(`/addtoGroup/${groupId}`);
  };


  return (
    <>
      {editItem !== null && (
        <Modal show={showEditModal} centered className="modal-edit-home">
          <Modal.Header>
            <Modal.Title className="titr-modal">ویرایش کاربر</Modal.Title>
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
                      for="flexCheckDefault"> انتخاب دسته بندی</label>
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
                        value={selectedSubGroupId || ''}
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

      <Header />
      <p className="title-group">گروه ها</p>
      <div className="box-items">
        {getDataUser && getDataUser.length > 0 ? (
          getDataUser.map((data) => (
            <div className="items">
              <div className="itemss">
                <div className="it-l">
                  <p>{data?.created_at}</p>
                </div>
                <div className="it-r">
                  <p>{data?.hall_id}</p>
                </div>
              </div>
              <div className="itemss s">
                <div className="it-r">
                  <p>۱۲۳۴</p>
                </div>
                <div className="it-l">
                  <p> : تعداد کاربر ها</p>
                </div>
              </div>
              <div className="itemss s">
                <div className="it-r">
                  <p>{data?.main_group}</p>
                </div>
                <div className="it-l">
                  <p> : دسته بندی اصلی</p>
                </div>
              </div>
              <div className="itemss s">
                <div className="it-r">
                  <p>{data?.group}</p>
                </div>
                <div className="it-l">
                  <p> : دسته بندی</p>
                </div>
              </div>
              <div className="itemss s">
                <div className="it-r">
                  <p>{data?.sub_group}</p>
                </div>
                <div className="it-l">
                  <p> : زیر دسته بندی</p>
                </div>
              </div>
              <div className="itemss s">
                <button className="delete-s" onClick={() => handleDelete(data?.id)}>حذف</button>
                <button className="edit-s" onClick={() => handleEdit(data?.id)}>ویرایش</button>
              </div>
              <button className="add-user-to-group" onClick={() => handleGoToAddUser(data?.id)}>افزودن کاربر</button>
            </div>
          ))
        ) : (
          <p>در حال بارگذاری...</p>
        )}
      </div>
    </>
  )
}