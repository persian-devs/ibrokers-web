import axios from "axios";
import Header from "../compomemt/header";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import qs from 'qs';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useApiData } from "../compomemt/getDataGroup";


export function Home() { 
  const {groups, suubGroups, mainGroups, radioo} = useApiData();

  const [getDataUser, setGetDataUser] = useState([]);
  const [selectedGroupLabel, setSelectedGroupLabel] = useState('انتخاب کنید');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();
  const [mainGroup, setMainGroup] = useState([]);
  const [subGroups, setSubGroups] = useState([]);
  const [Groups, setGroups] = useState([]);
  const [selectedMainGroupId, setSelectedMainGroupId] = useState('');
  const [selectedSubGroupId, setSelectedSubGroupId] = useState('');
  const [selectedSuubGroupId, setSelectedSuubGroupId] = useState(null);
  const [selectedCheckboxIds, setSelectedCheckboxIds] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [modalData, setModalData] = useState({
    name: editItem ? editItem.name : '',
    main_group: selectedMainGroupId || '', 
    group: selectedSubGroupId || '', 
    sub_group: selectedSuubGroupId || '', 
    hall_id: selectedCheckboxIds.join(','),
  });

  const handleDelete = (productId) => {
    setItemToDelete(productId);
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const [radio, setRadio] = useState([
      { id: 1, label: 'عرضه داخلی', checked: false },
      { id: 2, label: 'عرضه صادراتی', checked: false },
      { id: 3, label: 'بازار فرعی', checked: false },
      { id: 4, label: 'عرضه املاک و مستقلات', checked: false },
      // { id: 5, label: 'عرضه مستقلات', checked: false },
      // { id: 6, label: 'بازار خودرو', checked: false },
      // { id: 7, label: 'بازار املاک', checked: false },
  ]);
  
  const handleCheckboxChange = (RadioId) => {
    const updatedCheckboxes = radio.map((radio) =>
      radio.id === RadioId ? { ...radio, checked: !radio.checked } : radio
    );
    setRadio(updatedCheckboxes);

    const updatedSelectedCheckboxIds = updatedCheckboxes
      .filter((radio) => radio.checked)
      .map((radio) => radio.id);
    setSelectedCheckboxIds(updatedSelectedCheckboxIds);
  };

  const handleMainGroupChange = (e) => {
    const selectedId = parseInt(e.target.value, 10);
    setSelectedMainGroupId(selectedId);
    setSelectedSubGroupId(null);

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
      setModalData(itemToEdit);
      setShowEditModal(true);
    }
  };
  useEffect(() => {
    // console.log(modalData.name);
  }, [modalData]);

  const handleEditCancel = () => {
    setShowEditModal(false);
    setModalData(null);
  };

  useEffect(() => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://panel.ibrokers.ir/api/panel/rooms/',
      headers: { }
    };
    
    axios.request(config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      setGetDataUser(response.data['results']);
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

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
          // console.log(JSON.stringify(response.data));
          setGetDataUser((prevData) => prevData.filter(item => item.id !== itemToDelete));

      })
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error(error);
    }
  };

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
    try {
      const data = qs.stringify({
        'name': modalData?.name,
        'main_group': selectedMainGroupId || modalData.main_group,
        'group': selectedSubGroupId || modalData.group,
        'sub_group': selectedSuubGroupId || modalData.sub_group,
        'hall_id': selectedCheckboxIds.join(',') || modalData.hall_id
      });
      // console.log(data);

      const config = {
        method: 'put',
        url: `https://panel.ibrokers.ir/api/panel/rooms/${modalData.id}/`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
      };


      const response = await axios.request(config);
      // console.log(JSON.stringify(response.data));
      setGetDataUser((prevData) => {
        const updatedData = prevData.map((item) =>
          item.id === modalData.id ? response.data : item
        );
        return updatedData;
      });
      toast.success('تفیرات ذخیره شد')

      setShowEditModal(false);
      setEditItem(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoToAddUser = (groupId) => {
    navigate(`/addtoGroup/${groupId}`);
  };

  const isLoading = getDataUser.length === 0;
  const hasProducts = getDataUser.length > 0;

  const isCategorySelected = !!selectedMainGroupId;


  return (
    <>
      {modalData !== null && (
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
                      for="flexCheckDefault"> بازار ها
                    </label>
                    <div className="box-checked">
                      {radio.map((radio) => (
                        <div
                            className="div-check-box-selected selected-home"
                            key={radio.id}
                            onChange={() => handleCheckboxChange(radio.id)}
                          >
                            <label
                              style={{
                                fontFamily: 'sans',
                                fontSize: '14px'
                              }}
                              className="form-check-label"
                              htmlFor={`radio-${radio.id}`}
                            >
                              {radio.label}
                            </label>
                            <input
                              className="form-check-input"
                              type="radio"
                              value=""
                              id={`radio-${radio.id}`}
                              // defaultChecked={modalData?.hall_id}
                              name="checkbox-group"
                              defaultChecked={radio.id === modalData?.hall_id}
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
                        value={modalData?.name || modalData?.name}
                        onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                        />
                    </div>
                    <div className="div-input-lable-home">
                      <label> نام گروه</label>
                    </div>
                  </div>
                  <div className="selected-home">
                    <div className="div-input-lable-res-home">
                      <label>همه گروه های اصلی</label>
                    </div>
                    <div className="div-input-select">
                      <select class="form-select"
                        style={{
                          fontFamily: 'sans',
                          fontSize: '14px'
                        }}
                        onChange={handleMainGroupChange}
                        defaultValue={modalData?.main_group || modalData?.main_group}
                      >
                        <option selected>انتخاب کنید</option>
                        {mainGroup.map((group) => (
                          <option key={group.id} value={group.id}>{group?.persianName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="div-input-lable-home">
                      <label>همه گروه های اصلی</label>
                    </div>
                  </div>
                  <div className="selected-home">
                    <div className="div-input-lable-res-home">
                      <label> همه گروه ها</label>
                    </div>
                    <div className="div-input-select">
                      <select
                        className="form-select"
                        style={{
                          fontFamily: 'sans',
                          fontSize: '14px'
                        }}
                        onChange={handleSubGroupChange}
                      >
                        <option value="">{isCategorySelected ? "انتخاب کنید" : groups.find(item => item.id === modalData.group)?.persianName}</option>
                        {Groups
                          .filter(group => group.parentId === selectedMainGroupId)
                          .map((group) => (
                            <option key={group.id} value={group.id}>{group?.persianName}</option>
                          ))}
                      </select>
                    </div>
                    <div className="div-input-lable-home">
                      <label> همه گروه ها</label>
                    </div>
                  </div>
                  <div className="selected-home">
                    <div className="div-input-lable-res-home">
                      <label> همه زیر گروه ها</label>
                    </div>

                    <div className="div-input-select-home">
                      <select class="form-select"
                        style={{
                          fontFamily: 'sans',
                          fontSize: '14px'
                        }}
                        onChange={handleSuubGroupChange}
                        >
                        <option value="">{isCategorySelected ? "انتخاب کنید" : suubGroups.find(item => item.id === modalData.sub_group)?.persianName}</option>
                        {subGroups.map((SubGroup) => (
                          <option key={SubGroup.id} value={SubGroup.id}>{SubGroup?.persianName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="div-input-lable-home">
                      <label> همه زیر گروه ها</label>
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
          گروه حذف شود؟
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
        {isLoading ? (
          <p className="not-group">گروهی وجود ندارد</p>
        ) : hasProducts ? (
          getDataUser.map((data) => (
            <div className="items" key={data.id}>
              <div className="itemss">
                <div className="it-l">
                  <p>{new Date(data?.created_at).toLocaleDateString('fa-IR')}</p>
                </div>
                <div className="it-r">
                  <p>{radioo.find(item => item.id === data.hall_id)?.label}</p>
                </div>
              </div>
              <div className="itemss s">
                <div className="it-r">
                  <p>{data?.name}</p>
                </div>
                <div className="it-l">
                  <p> : نام گروه</p>
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
                  <p>{mainGroups.find(item => item.id === data.main_group)?.persianName}</p>
                </div>
                <div className="it-l">
                  <p> : دسته بندی اصلی</p>
                </div>
              </div>
              <div className="itemss s">
                <div className="it-r">
                  <p>{groups.find(item => item.id === data.group)?.persianName}</p>
                </div>
                <div className="it-l">
                  <p> : دسته بندی</p>
                </div>
              </div>
              <div className="itemss s">
                <div className="it-r">
                  <p>{suubGroups.find(item => item.id === data.sub_group)?.persianName}</p>
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
          <p className="not-group">در حال بارگذاری...</p>
        )}
      </div>
      <ToastContainer/>
    </>
  )
}