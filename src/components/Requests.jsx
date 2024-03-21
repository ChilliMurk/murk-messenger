const defaultPfpUrl = 'https://static.vecteezy.com/system/resources/previews/001/209/957/original/square-png.png';

export const sendRequest = async (url, method, body = null, params = {}) => {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            crossOrigin: true
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        let fullUrl = url;
        if (params && Object.keys(params).length > 0) {
            const urlParams = new URLSearchParams(params);
            fullUrl = `${url}?${urlParams.toString()}`;
        }

        const response = await fetch(fullUrl, options);

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        return response;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const handleRegister = async (event, formData) => {
    event.preventDefault();
    try {
        const response = await sendRequest('http://localhost:8080/register', 'POST', formData);
        if (response.ok) {
            console.log('Регистрация прошла успешно!');
            return true;
        } else {
            const errorData = await response.json();
            return false;
        }
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        alert('Ошибка при регистрации.');
        return false;
    }
};

export const handleLogin = async (event, loginData) => {
    event.preventDefault();
    try {
        const response = await sendRequest('http://localhost:8080/login', 'POST', loginData);
        if (response.ok) {
            console.log('Логин прошел успешно!');
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
        return false;
    }
};

export const handleLogout = async (event) => {
    event.preventDefault();
    try {
        const response = await sendRequest('http://localhost:8080/logout', 'POST');
        console.log('Logged out successfully!');
        const jsonResponse = await response.json();
        return jsonResponse.data;
    } catch (error) {
        console.error('Failed to logout:', error);
    }
};

export const handleSendMessage = async (event, messageData) => {
    event.preventDefault();
    try {
        const response = await sendRequest('http://localhost:8080/message', 'POST', messageData);
        console.log('Message sent successfully!');
        const jsonResponse = await response.json();
        return jsonResponse.data;
    } catch (error) {
        console.error('Failed to send message:', error);
    }
};

export const handleGetCurrentProfile = async () => {
    try {
        const response = await sendRequest('http://localhost:8080/profile', 'GET');
        const jsonResponse = await response.json();
        console.log('Response from /profile:', jsonResponse);
        return jsonResponse.data;
    } catch (error) {
        console.error('Failed to fetch profile:', error);
    }
};

export const handleGetUsersConversations = async () => {
    try {
        const response = await sendRequest(`http://localhost:8080/message/conversations`, 'GET');
        const jsonResponse = await response.json();
        return jsonResponse.data;
    } catch (error) {}
};


export const handleGetUserById = async (id) => {
    try {
        const response = await sendRequest(`http://localhost:8080/user/${id}`, 'GET');
        const jsonResponse = await response.json();
        return jsonResponse.data;
    } catch (error) {}
};

export const handleGetAllMessages = async () => {
    try {
        const response = await sendRequest('http://localhost:8080/message/all', 'GET');
        const jsonResponse = await response.json();
        return jsonResponse.data;
    } catch (error) {}
};

export const handleGetUnreadMessages = async () => {
    try {
        const response = await sendRequest('http://localhost:8080/message/unread', 'GET');
        const jsonResponse = await response.json();
        return jsonResponse.data;
    } catch (error) {}
};

export const handleGetMessageById = async (id) => {
    try {
        const response = await sendRequest(`http://localhost:8080/message/${id}`, 'GET');
        const jsonResponse = await response.json();
        return jsonResponse.data;
    } catch (error) {}
};

export const handleGetMessagesByUserId = async (id) => {
    try {
        const response = await sendRequest(`http://localhost:8080/message/user/${id}`, 'GET');
        const jsonResponse = await response.json();
        return jsonResponse.data;
    } catch (error) {}
};


export const handleGetUserByUsername = async (username) => {
    try {
        const response = await sendRequest(
            `http://localhost:8080/user`,
            'GET', null,
            {username: username}
        );
        const jsonResponse = await response.json();
        return jsonResponse.data;
    } catch (error) {}
};

export const handleGetUsersWithLimit = async (page) => {
    try {
        const response = await sendRequest(
            `http://localhost:8080/user/page`,
            'GET', null,
            {page: page}
        );
        const jsonResponse = await response.json();
        return jsonResponse.data;
    } catch (error) {}
};

export const handleValidateSession = async () => {
    try {
        const response = await sendRequest(
            `http://localhost:8080/validate`,
            'GET', null, null
        );
        return response.status === 200;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};

// Messages

export const handleEditMessage = async (event, messageData, id) => {
    event.preventDefault();
    try {
        const response = await sendRequest(
            `http://localhost:8080/message/id/${id}`,
            'PUT', messageData, null
        );
        const jsonResponse = await response.json();
        return jsonResponse.data;
    } catch (error) {}
};

export const handleDeleteMessage = async (event, id) => {
    event.preventDefault();
    try {
        const response = await sendRequest(
            `http://localhost:8080/message/id/${id}`,
            'DELETE', null, null
        );
        const jsonResponse = await response.json();
        return jsonResponse.data;
    } catch (error) {}
};

export const uploadPfp = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const options = {
            method: 'POST',
            body: formData,
            credentials: 'include',
            crossOrigin: true
        };

        const response = await fetch(`http://localhost:8080/user/pfp`, options);

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        return response;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const getPfp = async (userId) => {
    try {
        console.log(`fetching pfp...`)
        const response = await fetch(`http://localhost:8080/user/${userId}/pfp`);
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        console.log(`fetched pfp!`)
        const imageBlob = await response.blob();
        return URL.createObjectURL(imageBlob);
    } catch (error) {
        console.error('Error:', error);
        return defaultPfpUrl;
    }
};