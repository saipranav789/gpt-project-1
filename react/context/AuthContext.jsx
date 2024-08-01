import React, { createContext, useState ,useReducer} from 'react';

// Create the authentication context
export const AuthContext = createContext();

export const authReducer = (state,action) => {
    switch(action.type){
    case 'LOGIN':
        return {user:action.payload}
    case 'LOGOUT':
        return {user:null}
    default:
        return state
    }
}

// Create the authentication provider component
export const AuthContextProvider = ({ children }) => {
    const [state,dispatch]= useReducer(authReducer,{user:null})

    console.log('AuthContext State:',state)
    


    // Render the authentication provider with the provided children
    return (
        <AuthContext.Provider value={{...state,dispatch}}>
            {children}
        </AuthContext.Provider>
    );
};