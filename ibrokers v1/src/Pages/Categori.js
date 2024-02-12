import { Col, Container, Row } from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import Header from "../compomemt/header";
import axios from "axios";
import qs from 'qs';

export function Categori() {
    const [mainGroup, setMainGroup] = useState([]);
    const [subGroups, setSubGroups] = useState([]);
    const [Groups, setGroups] = useState([]);
    const [selectedMainGroupId, setSelectedMainGroupId] = useState(null);
    const [selectedSubGroupId, setSelectedSubGroupId] = useState(null);
    const [selectedSuubGroupId, setSelectedSuubGroupId] = useState(null);
    const [selectedCheckboxIds, setSelectedCheckboxIds] = useState([]);

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
        let data = qs.stringify({
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

    // useEffect(() => {
    //     axios.get('https://api.ibrokers.ir/bourse/group/sub-group/')
    //         .then((response) => {
    //             setSubGroups(response.data);
    //             console.log(subGroups);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }, []);
    
    const handleSuubGroupChange = (e) => {
        const selectedId = parseInt(e.target.value, 10);
        setSelectedSuubGroupId(selectedId);
    };
   
    return (
        <>
            <Header/>
            <div>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    sendDataToServer();}}>
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
                                            style={{fontFamily: 'sans',
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
                                        value={selectedSubGroupId || ''}
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
                        <p className="title-group">کاربران مورد نظر خود را انتخواب کنید </p>

                        <div className="container-list">
                            <div className="div-list">
                                <div className="row-list">
                                    <div className="btn-row-list">
                                        {/* <button type="button" class="btn-dontadd btn-primary">اضافه نشده</button> */}
                                        <button type="button" class="btn-addd btn-primary">اضافه شده</button>
                                    </div>
                                    <div style={{ textAlign: 'right', fontFamily: 'sans', fontSize: '14px', width: 'min-content'}} className="inset-div-list">
                                        <div className="item-inset-div-list">
                                            <p>صنعتی / کشاورزی / خودرو</p>
                                            <span> : دسته بندی</span>
                                        </div>
                                        <div className="item-inset-div-list">
                                            <p>۰۹۱۱۱۱۱۱۱۱۱</p>
                                            <span> : موبایل</span>
                                        </div>
                                        <div className="item-inset-div-list">
                                            <p>حاجیان</p>
                                            <span> : نام خانوادگی</span>
                                        </div>
                                        <div className="item-inset-div-list">
                                            <p>علی</p>
                                            <span> : نام</span>
                                        </div>
                                        <div className="btn-row-list-res">
                                            <button type="button" class="btn-dontadd btn-primary">اضافه نشده</button>
                                            {/* <button type="button" class="btn-addd btn-primary">اضافه شده</button>*/}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="div-list">
                                <div className="row-list">
                                    <div className="btn-row-list">
                                        <button type="button" class="btn-dontadd btn-primary">اضافه نشده</button>
                                        {/* <button type="button" class="btn-addd btn-primary">اضافه شده</button>*/}
                                    </div>
                                    <div style={{ textAlign: 'right', fontFamily: 'sans', fontSize: '14px', width: 'min-content'}} className="inset-div-list">
                                        <div className="item-inset-div-list">
                                            <p>صنعتی / کشاورزی / خودرو</p>
                                            <span> : دسته بندی</span>
                                        </div>
                                        <div className="item-inset-div-list">
                                            <p>۰۹۱۱۱۱۱۱۱۱۱</p>
                                            <span> : موبایل</span>
                                        </div>
                                        <div className="item-inset-div-list">
                                            <p>حاجیان</p>
                                            <span> : نام خانوادگی</span>
                                        </div>
                                        <div className="item-inset-div-list">
                                            <p>علی</p>
                                            <span> : نام</span>
                                        </div>
                                        <div className="btn-row-list-res">
                                            <button type="button" class="btn-dontadd btn-primary">اضافه نشده</button>
                                            {/* <button type="button" class="btn-addd btn-primary">اضافه شده</button>*/}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}