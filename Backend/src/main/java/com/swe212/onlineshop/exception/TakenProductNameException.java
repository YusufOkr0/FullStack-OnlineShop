package com.swe212.onlineshop.exception;

public class TakenProductNameException extends RuntimeException{
    public TakenProductNameException(String message){
        super(message);
    }
}
