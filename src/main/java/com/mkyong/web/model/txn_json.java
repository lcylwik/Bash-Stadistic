/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mkyong.web.model;

import java.util.Date;

/**
 *
 * @author Lianet
 */
public class txn_json {

    private String prtFilename;
    private Date prtProcDte;
    private int numeroPrsaAdquiriente;
    private int numeroPrsaEmisor;
    private String fiidAdquiriente;
    private String fiidEmisor;
    private String redLogica;
    private String codigoRespuesta;

    public txn_json(String prtFilename, Date prtProcDte, int numeroPrsaAdquiriente, int numeroPrsaEmisor, String fiidAdquiriente, String fiidEmisor, String redLogica, String codigoRespuesta) {
        this.prtFilename = prtFilename;
        this.prtProcDte = prtProcDte;
        this.numeroPrsaAdquiriente = numeroPrsaAdquiriente;
        this.numeroPrsaEmisor = numeroPrsaEmisor;
        this.fiidAdquiriente = fiidAdquiriente;
        this.fiidEmisor = fiidEmisor;
        this.redLogica = redLogica;
        this.codigoRespuesta = codigoRespuesta;
    }

    public String getCodigoRespuesta() {
        return codigoRespuesta;
    }

    public void setCodigoRespuesta(String codigoRespuesta) {
        this.codigoRespuesta = codigoRespuesta;
    }

    public String getPrtFilename() {
        return prtFilename;
    }

    public void setPrtFilename(String prtFilename) {
        this.prtFilename = prtFilename;
    }

    public Date getPrtProcDte() {
        return prtProcDte;
    }

    public void setPrtProcDte(Date prtProcDte) {
        this.prtProcDte = prtProcDte;
    }

    public int getNumeroPrsaAdquiriente() {
        return numeroPrsaAdquiriente;
    }

    public void setNumeroPrsaAdquiriente(int numeroPrsaAdquiriente) {
        this.numeroPrsaAdquiriente = numeroPrsaAdquiriente;
    }

    public int getNumeroPrsaEmisor() {
        return numeroPrsaEmisor;
    }

    public void setNumeroPrsaEmisor(int numeroPrsaEmisor) {
        this.numeroPrsaEmisor = numeroPrsaEmisor;
    }

    public String getFiidAdquiriente() {
        return fiidAdquiriente;
    }

    public void setFiidAdquiriente(String fiidAdquiriente) {
        this.fiidAdquiriente = fiidAdquiriente;
    }

    public String getFiidEmisor() {
        return fiidEmisor;
    }

    public void setFiidEmisor(String fiidEmisor) {
        this.fiidEmisor = fiidEmisor;
    }

    public String getRedLogica() {
        return redLogica;
    }

    public void setRedLogica(String redLogica) {
        this.redLogica = redLogica;
    }

}
