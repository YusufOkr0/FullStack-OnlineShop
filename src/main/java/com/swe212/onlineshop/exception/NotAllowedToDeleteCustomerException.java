package com.swe212.onlineshop.exception;

public class NotAllowedToDeleteCustomerException  extends RuntimeException{
    public NotAllowedToDeleteCustomerException(String message){
        super(message);
    }
}
