package com.swe212.onlineshop.exception;

public class ReportProcessException extends RuntimeException{
    public ReportProcessException(String message,Throwable cause){
        super(message,cause);
    }

    public ReportProcessException(String message){
        super(message);
    }
}
