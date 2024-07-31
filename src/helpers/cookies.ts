// helpers for cookie setting, retrieval and removal

import {
    deleteCookie, 
    getCookie as getCkie, 
    setCookie as setCkie, 
    hasCookie
 } from 'cookies-next';

 const setCookie = (title: string, value: string | number, options?: any
    ) => {
    setCkie(title, value, options); 
 }
 
 const getCookie = (title: string) => {
    if (hasCookie(title)) {
       return getCkie(title);
    } else {
       return null
    }
 }
 
 const removeCookie = (title: string, options?: any) => {
 
    if (hasCookie(title, options)) {
       deleteCookie(title, options); 
    }
 }
 
 
 export {
    setCookie, 
    getCookie, 
    removeCookie,
    
 }