/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mkyong.web.services;

import com.mkyong.web.dao.TransDao;
import com.mkyong.web.model.Estadistico;
import com.mkyong.web.model.PrsaRejectedTxn;
import com.mkyong.web.model.PrsaTxnAceptadas;
import com.mkyong.web.model.txn_json;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ProasEvolution
 */
@Service
public class TransServiceImpl implements TransService {

    @Autowired
    private TransDao trasdao;

    @Override
    public List<PrsaTxnAceptadas> getTransaccionesAceptadas() {
        return trasdao.getTransaccionesAceptadas();
    }

    @Override
    public List<PrsaRejectedTxn> getTransaccionesReject() {
        return trasdao.getTransaccionesReject();
    }

    @Override
    public List<Object> getEstadistico() {
        return trasdao.getEstadistico();
    }

    @Override
    public Integer addEstadistico(Estadistico estadistico) {
        return trasdao.addEstadistico(estadistico);
    }
    
    @Override
    public Boolean checkMonthIsCalculated(Date date) {
        return trasdao.checkMonthIsCalculated(date);
    }
    
    @Override
    public Date getFirstTransaction(){
        return trasdao.getFirstTransaction();
    }

    @Override
    public List<txn_json> getAllTxn() {
        List<txn_json> txns = new LinkedList<>();
        List<PrsaTxnAceptadas> txnsAcc = getTransaccionesAceptadas();
        List<PrsaRejectedTxn> txnsRej = getTransaccionesReject();

        for (PrsaTxnAceptadas txn : txnsAcc) {
            txns.add(new txn_json(txn.getNombreArchivo(), txn.getFechaProcesoTransac(), txn.getNumeroPrsaAdquiriente(), txn.getNumeroPrsaEmisor(), txn.getFiidAdquiriente(), txn.getFiidEmisor(), txn.getRedLogica(), txn.getCodigoRespuestaAut()));
        }

       for (PrsaRejectedTxn txn : txnsRej) {
            txns.add(new txn_json(txn.getPrtFilename(), txn.getPrtProcDte(), txn.getNumeroPrsaAdquiriente(), txn.getNumeroPrsaEmisor(), txn.getFiidAdquiriente(), txn.getFiidEmisor(), txn.getRedLogica(), txn.getCodigoRespuesta()));
        }

        return txns;
    }

    @Override
    public List<String> getCodigo() {
        return trasdao.getCodigo();
    }

    @Override
    public Iterator getCantFechaByCode(String code, Date fromDate, Date toDate) {
        return trasdao.getCantFechaByCode(code, fromDate, toDate);
    }
}
