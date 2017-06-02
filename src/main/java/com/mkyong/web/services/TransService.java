/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mkyong.web.services;

import com.mkyong.web.model.Estadistico;
import com.mkyong.web.model.PrsaRejectedTxn;
import com.mkyong.web.model.PrsaTxnAceptadas;
import com.mkyong.web.model.txn_json;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

/**
 *
 * @author ProasEvolution
 */
public interface TransService {

    public List<PrsaTxnAceptadas> getTransaccionesAceptadas();

    public List<PrsaRejectedTxn> getTransaccionesReject();

    public List<Object> getEstadistico();

    public Integer addEstadistico(Estadistico estadistico);
    
    public Boolean checkMonthIsCalculated(Date date);
    
    public Date getFirstTransaction();

    public List<txn_json> getAllTxn();

    public List<String> getCodigo();

    public Iterator getCantFechaByCode(String code,Date fromDate, Date toDate);

}
