package com.swe212.onlineshop.exception;

public class TakenUsernameException extends RuntimeException{
    public TakenUsernameException(String message){
        super(message);
    }
}
