// import { Col, Container, Row } from "react-bootstrap";
import alert from "../assets/img/Vector.png";
import iconright from "../assets/img/right-icon.png";
import logoheader from "../assets/img/logo-header.png";
import Header from "../compomemt/header";
import axios from "axios";
import { useEffect, useState } from "react";
import jalaliMoment from "jalali-moment";
import qs from 'qs';
import { getToken, saveToken } from "../localstorage/token";

export function Support() {
    const [adminchat, setAdminChat] = useState([]);
    const [userchat, setUserChat] = useState([]);
    const [message, setMessage] = useState('');
    const [dataAdmin, setDataAdmin] = useState([])
    const [dataUser, setDataUser] = useState([])

    const convertToPersianDate = (gregorianDate) => {
        const jalaliDate = jalaliMoment(gregorianDate, 'YYYY-M-D HH:mm:ss').format('jYYYY-jM-jD HH:mm:ss');
        return jalaliDate;
    };

    // useEffect(() => {
    //     console.log(getToken());
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get('https://panel.ibrokers.ir/api/chat/', {
    //                 headers: {
    //                     'Authorization': `Bearer ${getToken()}`
    //                 }
    //             });

    //             // consol(response.data.results[0].content);

    //             const gregorianDate = response.data.results[0].created_at;
    //             const persianDate = convertToPersianDate(gregorianDate);

    //             setDate(persianDate);
    //             setUserChat(response.data.results[0].content);
    //             console.log(response.data.results[0]);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     };

    //     fetchData();
    // }, []);

    const fetchData = async () => {

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://panel.ibrokers.ir/api/chat/',
            headers: { }
        };
        
        axios.request(config)
        .then((response) => {
            setAdminChat((response.data['results']));
            const filteredChat = response.data['results'].filter(chat => chat.state === 1);
            setUserChat(filteredChat);
            const gregorianDatesWithStateOne = response.data['results']
                .filter(chat => chat.state === 1)
                .map(chat => convertToPersianDate(chat.created_at));

            const gregorianDatesWithStateZero = response.data['results']
                .filter(chat => chat.state === 0)
                .map(chat => convertToPersianDate(chat.created_at));

            setDataUser(gregorianDatesWithStateOne);
            setDataAdmin(gregorianDatesWithStateZero);

        })
        .catch((error) => {
            console.log(error);
        });
    };
    useEffect(() => {
        fetchData();
    }, []);

    const sendMessage = async (e) => {

        e.preventDefault();
        try {
            const data = qs.stringify({
                'content': message
            });

            const response = await axios.post('https://panel.ibrokers.ir/api/chat/', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', 
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            console.log(response.data.content);
            setMessage(response.data.content);
            fetchData(); // بعد از ارسال پیام، اطلاعات را به‌روز کنید
            setMessage('');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Header/>
            <div className="box-message">
                <div className="inset-box-message">
                    {adminchat.map((chat, index) => (
                        <div className="box-message-user" key={chat.id}>
                            <div className="user">
                                <div className="titr-chat-user">
                                    <p>کاربر</p>
                                    <p>{dataAdmin[index]}</p>
                                </div>
                                <p>{chat?.content}</p>
                            </div>
                        </div>
                    ))}

                    {userchat.map((chat, index) => (
                        <div className="box-message-admin" key={chat.id}>
                            <div className="admin">
                                <div className="titr-chat-admin">
                                    <p>ادمین</p>
                                    <p>{dataUser[index]}</p>
                                </div>
                                <p>{chat?.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={sendMessage}>
                    <div className="box-typing">
                        <input value={message} className="typing" placeholder="...متن خود را بنویسید" onChange={(e) => setMessage(e.target.value)}/>
                        <button className="box-btn-sent" type="submit">
                            <img className="iconright" src={iconright}></img>
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}