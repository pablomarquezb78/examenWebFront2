import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { useSession } from '../../SessionProvider'; // Usamos el contexto
import Cookies from 'universal-cookie';
const cookies = new Cookies();

import apiEndpoints from '../../assets/apiEndpoints.json'

function GoogleLog() {

    const { funLogin, funLogout } = useSession();

    let now = new Date();
    
    const [user, setUser] = useState(null);
    const [ profile, setProfile ] = useState(null);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => { setUser(codeResponse); seslogin(); },
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
                        console.log(user);
                        console.log(profile);
                        funLogin(res.data.email, res.data.name);
                    })
                    .catch((err) => console.log(err));
            }
        },
        [ user,login ]
    );

    useEffect (
        () => {
            if (profile) {
                postUserToMapas();
            }
        },
        [profile]
    );

    const logOut = () => {
        googleLogout();
        setProfile(null);
        setUser(null);
        cookies.remove('email', { path: '/' });
        funLogout();
    };

    const postUserToMapas = async () => {
        const payload = {
            email: profile.email,
            marcadores: [],
        };
    
        try {
            const checkResponse = await axios.get(apiEndpoints.api + `/mapas?email=${profile.email}`);
            if (checkResponse.data.length > 0) {
                console.log('El usuario ya existe en la entidad mapas');
                return;
            }
    
            const response = await axios.post(apiEndpoints.api + '/mapas', payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Usuario añadido a la entidad mapas:', response.data);
        } catch (error) {
            console.error('Error al comprobar o añadir usuario a la entidad mapas:', error);
        }
    };

    return (
        <div>
            {profile ? (
                <div>
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    <button onClick={logOut}>Salir</button>
                </div>
                ) : (
                <div className='my-2'>
                    <button onClick={login}>Login con Google</button>
                </div>
                )
            }
        </div>
    )
}

export default GoogleLog