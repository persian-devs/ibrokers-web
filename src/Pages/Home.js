import axios from "axios";
import alert from "../assets/img/Vector.png";
import logoheader from "../assets/img/logo-header.png";
import Header from "../compomemt/header";
import { useEffect, useState } from "react";
import jalaliMoment from "jalali-moment";
import { Button, Modal } from "react-bootstrap";
import qs from 'qs';
import { Categori } from "./Categori"; 


export function Home() {
  const [getDataUser, setGetDataUser] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMainGroupId, setSelectedMainGroupId] = useState(null);
  const [selectedSuubGroupId, setSelectedSuubGroupId] = useState(null);
  const [formData, setFormData] = useState({
    main_group: '',
    group: '',
    sub_group: '',
    hall_id: '',
  });

  const handleDelete = (productId) => {
    setItemToDelete(productId);
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('https://panel.ibrokers.ir/api/panel/rooms/');
      setGetDataUser(response.data['results']);
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

  const handleEdit = (data) => {
    // Set the form data with the selected item's data
    setFormData(data);
    setShowEditModal(true);
  };

  const handleEditCancel = () => {
    // Reset form data to default values when canceling edit
    setShowEditModal(false);
    setFormData({
      main_group: '',
      group: '',
      sub_group: '',
      hall_id: '',
    });
  };

  const handleEditSave = async () => {
    try {
      const url = `https://panel.ibrokers.ir/api/panel/rooms/${itemToDelete}/`;

      const config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(formData),
      };

      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));

      fetchData();
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
    }
  };
  

  return( 
    <>
      <Modal show={showEditModal} onHide={handleEditCancel} centered>
        <Modal.Header>
          <Modal.Title className="titr-modal">ویرایش کاربر</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {/* <select
            className="form-select"
            style={{ fontFamily: 'sans', fontSize: '14px' }}
            value={selectedMainGroupId || ''}
            onChange={(e) => {
              setSelectedMainGroupId(e.target.value);
              handleMainGroupChange(e);
            }}
          >
            <option defaultValue>انتخواب کنید</option>
            {mainGroup && mainGroup.length > 0 ? (
              mainGroup.map((group) => (
                <option key={group?.id} value={group?.id}>
                  {group?.persianName}
                </option>
              ))
            ) : (
              <p>در حال بارگذاری...</p>
            )}
          </select> */}
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
                <button className="delete-s"onClick={() => handleDelete(data?.id)}>حذف</button>
                <button className="edit-s" onClick={() => handleEdit(data)}>ویرایش</button>
              </div>
            </div>
          ))
        ) : (
          <p>در حال بارگذاری...</p>
        )}
      </div>
    </>
  )
}