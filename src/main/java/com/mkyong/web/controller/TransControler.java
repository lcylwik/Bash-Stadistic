/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mkyong.web.controller;

import com.mkyong.web.dao.TransDao;
import com.mkyong.web.model.Estadistico;
import com.mkyong.web.model.PrsaRejectedTxn;
import com.mkyong.web.model.PrsaTxnAceptadas;
import com.mkyong.web.model.txn_json;
import com.mkyong.web.services.ScheduledTasks;
import com.mkyong.web.services.TransService;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Lianet
 */
@RestController
public class TransControler {

    @Autowired
    private TransService transservice;

    @RequestMapping(value = "/rest/txnAccepted", method = RequestMethod.GET)
    public List<PrsaTxnAceptadas> findAllAccepted() {
        List<PrsaTxnAceptadas> txns = transservice.getTransaccionesAceptadas();
        return txns;
    }

    @RequestMapping(value = "/rest/txnRejected", method = RequestMethod.GET)
    public List<PrsaRejectedTxn> findAllRejected() {
        List<PrsaRejectedTxn> txns = transservice.getTransaccionesReject();
        return txns;
    }

    @RequestMapping(value = "/rest/txn", method = RequestMethod.GET)
    public List<txn_json> findAll() {
        List<txn_json> txns = transservice.getAllTxn();
        return txns;
    }
      @RequestMapping(value = "/rest/rej", method = RequestMethod.GET)
    public List<PrsaRejectedTxn> rej() {
        List<PrsaRejectedTxn> txns = transservice.getTransaccionesReject();
        return txns;
    }

    @RequestMapping(value = "/rest/estadistico", method = RequestMethod.GET)
    public List<Object> findAllEstadistico() {
        List<Object> estadistico = transservice.getEstadistico();
        return estadistico;
    }

//    @RequestMapping(value = "/rest/add", method = RequestMethod.GET)
//    public Integer addEstadistico() {
//        Estadistico estadistico = new Estadistico(2.5, 6.0, new Date(), "001");
//        return transservice.addEstadistico(estadistico);
//
//    }

}
