import React from "../index";
import styles from '../styles/Messenger.module.css';
import {useState, useEffect} from "react";
import {
    handleValidateSession,
    handleGetUserByUsername,
    handleGetCurrentProfile,
    handleLogout,
    handleGetMessagesByUserId,
    handleSendMessage,
    handleGetUsersConversations,
    handleEditMessage,
    handleDeleteMessage,
    uploadPfp,
    getPfp
} from './Requests.jsx';
import {useNavigate} from "react-router-dom";
import '../styles/global.css';

const Messenger = () => {
    const navigate = useNavigate();

    // Profile, Chats
    const [activeView, setActiveView] = useState('chats');
    const showChats = () => {
        setActiveView('chats');
    };
    const showProfile = () => {
        setActiveView('profile');
    };

    const [conversations, setConversations] = useState([]);
    const [profile, setProfile] = useState(null);

    // On page load
    const checkSession = async () => {
        const sessionValid = await handleValidateSession();
        if (!sessionValid) {
            alert('Сессия недействительна. Пожалуйста, войдите снова.');
            navigate('/');
        }
    };
    const fetchConversations = async () => {
        const conversations = await handleGetUsersConversations();
        setConversations(conversations);
    };
    const fetchProfile = async () => {
        const profile = await handleGetCurrentProfile();
        setProfile(profile);
    };
    useEffect(() => {
        if (profile) {
            fetchPfp().then(r => console.log('Fetched pfp:', r));
        }
    }, [profile]);
    useEffect(() => {
        checkSession().then(r => console.log('Session valid:', r));
        fetchConversations().then(r => console.log('Fetched conversations: ', r));
        fetchProfile().then(r => console.log('Fetched profile: ', r));
    }, []);

    const [searchInput, setSearchInput] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserPfp, setSelectedUserPfp] = useState(null);
    const [searchedUser, setSearchedUser] = useState(null);
    const [foundConversation, setFoundConversation] = useState([]);

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        const user = await handleGetUserByUsername(searchInput);
        setSearchedUser(user[0]);
    };

    const onSubmitLogout = async (event) => {
        await handleLogout(event);
        navigate('/');
    };

    // Sending messages
    const [messageData, setMessageData] = useState('');
    const [editMessageId, setEditMessageId] = useState(null);
    const onSendMessage = async (event) => {
        event.preventDefault();
        if (!selectedUser) {
            console.log('No user selected. Cannot edit message.');
            alert('Пользователь не выбран: невозможно изменить сообщение.')
            return;
        }
        let message;
        if (editMessageId) {
            const messageToSend = {
                text: messageData
            };
            message = await handleEditMessage(event, messageToSend, editMessageId);
            setEditMessageId(null);
        } else {
            const messageToSend = {
                receiverId: selectedUser.id,
                text: messageData
            };
            message = await handleSendMessage(event, messageToSend);
        }
        console.log('Message sent:', message);
        setMessageData('');
        await fetchCurrentConversation(selectedUser);
    }

    const onEditMessage = async (event, id, text) => {
        event.preventDefault();
        setEditMessageId(id);
        setMessageData(text);
    }

    const onDeleteMessage = async (event, id) => {
        event.preventDefault();
        if (!selectedUser) {
            console.log('No user selected. Cannot delete message.');
            alert('Пользователь не выбран: невозможно удалить сообщение.')
            return;
        }
        const message = await handleDeleteMessage(event, id);
        console.log('Message deleted:', message);

        const messages = await handleGetMessagesByUserId(selectedUser.id);
        setFoundConversation(messages);
    }

    // Getting conversation (updating every second)
    useEffect(() => {
        const intervalId = setInterval(async () => {
            if (activeView === 'chats') {
                await fetchConversations();
                if (selectedUser) {
                    await fetchCurrentConversation();
                }
            }
        }, 1000);

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        }
    }, [searchedUser, selectedUser, activeView]);

    const fetchCurrentConversation = async (user) => {
        if (user) {
            setSelectedUser(user);
            const messages = await handleGetMessagesByUserId(user.id);
            setFoundConversation(messages);
            return messages;
        } else if (selectedUser) {
            const messages = await handleGetMessagesByUserId(selectedUser.id);
            setFoundConversation(messages);
            return messages;
        } else {
            setFoundConversation([]);
        }
    }

    const setSelectedUserAndFetchConversation = async (user) => {
        setSearchedUser(null);
        await fetchCurrentConversation(user).then(r => console.log('Force fetched conversation:', r));
    };
    const fetchSelectedUserPfp = async () => {
        if (selectedUser) {
            const url = await getPfp(selectedUser.id);
            setSelectedUserPfp(url);
        }
    };
    useEffect(() => {
        fetchSelectedUserPfp().then(r => console.log('Fetched selected user pfp:', r));
    }, [selectedUser]);

    // Pfp
    const [pfpUrl, setPfpUrl] = useState(null);
    const handleUploadPfp = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (file) {
            const response = await uploadPfp(file);
            const jsonResponse = await response.json();
            console.log('Upload response:', jsonResponse);
            await fetchPfp();
        }
    };
    const fetchPfp = async () => {
        const url = await getPfp(profile.id);
        setPfpUrl(url);
    }

    return <div className={styles.msg}>
        <div className={styles.msgBody}>
            <div className={styles.msgPersonalNavigate}>
                <div className={styles.msgPfpContainer}>
                    <img src={pfpUrl}/>
                </div>
                <div className={styles.msgPersonalName}>
                    {profile &&
                        <>
                            <div className={styles.msgPersonalUsername}>
                                <p>{profile.username}</p>
                            </div>
                            <p>{profile.fullName}</p>
                        </>
                    }
                </div>
                <div className={styles.msgNav}>
                    <button className={styles.msgButtonProfile} onClick={showProfile}> Профиль</button>
                    <button className={styles.msgButtonChats} onClick={showChats}> Чаты</button>
                    <button className={styles.msgExit} onClick={onSubmitLogout}> Выйти</button>
                </div>
            </div>

            {activeView === 'chats' && (
                <>
                    <div className={styles.msgChats}>
                        <span className={styles.iconSearch}>
                            <ion-icon name="search-outline"></ion-icon>
                        </span>
                        <form onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                placeholder="  Найти..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </form>
                        {searchedUser && (
                            <div className={styles.msgPopupChat}>
                                <button
                                    className="clickable"
                                    onClick={() => setSelectedUserAndFetchConversation(searchedUser)}>{searchedUser.username}</button>
                            </div>
                        )}

                        <div className={`${styles.msgUsers} clickable`}>
                            {conversations && conversations.map(user => (
                                <div key={user.id} onClick={() => setSelectedUserAndFetchConversation(user)}>
                                    <p>{user.username}</p>
                                </div>
                            ))}
                        </div>

                    </div>
                    <div className={styles.msgPersonalChat}>
                        <div className={styles.msgPersonalChatHeader}>
                            {selectedUser &&
                                <div className={styles.msgPersonalChatPfp}>
                                    <img src={selectedUserPfp}/>
                                </div>
                            }
                            <div className={styles.msgPersonalChatName}>
                                {selectedUser &&
                                    <div className={styles.hoverContainer}>
                                        <p>{selectedUser && selectedUser.username}</p>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className={styles.msgConversation}>
                            {foundConversation &&
                                foundConversation.map(message => (
                                    <div key={message.id}
                                         className={message.senderId === profile.id ? styles.messageRight : styles.messageLeft}>
                                        <p>{message.text}</p>
                                        {message.senderId === profile.id && (
                                            <>
                                                <button className="clickable"
                                                        onClick={(event) => onEditMessage(event, message.id, message.text)}>
                                                    edit
                                                </button>
                                                <button className="clickable"
                                                        onClick={(event) => onDeleteMessage(event, message.id)}>
                                                    delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                        <div className={styles.msgMessageInput}>
                        <span className={`${styles.iconMassage} clickable`} onClick={onSendMessage}>
                             <ion-icon name="paper-plane-outline"></ion-icon>
                        </span>
                            <input type="text" placeholder="  Сообщение..."
                                   value={messageData}
                                   onChange={(e) => setMessageData(e.target.value)}
                            />
                        </div>
                    </div>
                </>
            )}

            {activeView === 'profile' && (
                <>
                    <div className={`${styles.msgProfile} ${activeView === 'profile' ? styles.active : ''}`}>
                        <div className={styles.msgAllItems}>
                            <div className={styles.msgLeftProfile}>
                                <div className={styles.msgPersonalAvatar}>
                                    <div className={styles.pfpContainer}>
                                        <img className={styles.pfpImage} src={pfpUrl}/>
                                    </div>
                                </div>
                                <div className={styles.msgImage}>
                                    <input type="file" onInput={handleUploadPfp}/>
                                </div>
                            </div>
                            <div className={styles.msgProfileInfo}>
                                <p>Логин: {profile && profile.username}</p>
                                <p>Полное имя: {profile && profile.fullName}</p>
                                <p>Почта: {profile && profile.email}</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    </div>;
}

export default Messenger;