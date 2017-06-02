/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mkyong.web.dao;

import com.mkyong.web.model.Clave;
import com.mkyong.web.model.Estadistico;
import com.mkyong.web.model.PrsaRejectedTxn;
import com.mkyong.web.model.PrsaTxnAceptadas;
import java.text.SimpleDateFormat;
import java.util.*;
import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;
import org.hibernate.sql.JoinType;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Lianet
 */
@Repository
public class TransDaoImpl implements TransDao {

    @Override
    public List<PrsaTxnAceptadas> getTransaccionesAceptadas() {
        Criteria criteria = SessionUtil.getSession().createCriteria(PrsaTxnAceptadas.class);
        return (List<PrsaTxnAceptadas>) criteria.list();
    }

    @Override
    public List<PrsaRejectedTxn> getTransaccionesReject() {
        Criteria criteria = SessionUtil.getSession().createCriteria(PrsaRejectedTxn.class);
        return (List<PrsaRejectedTxn>) criteria.list();
    }

    // Metodos Rest para obtener y adicionar las estadisticas
    @Override
    public List<Object> getEstadistico() {
        Session session = SessionUtil1.getSession();
       // List<Object> list1 = SessionUtil1.getSession().createQuery("from Clave as cl join fetch cl.estadisticos as est").list();
       
     List<Object> list1 = SessionUtil1.getSession().createSQLQuery("Select cl.type,cl.elemento,est.media,est.desviacion,est.fecha from estadistico as est inner join clave as cl where est.idClave=cl.idC").list();

        return list1;
    }

    @Override
    public Integer addEstadistico(Estadistico estadistico) {
        Session session = SessionUtil1.getSession();
        Transaction tx = null;
        Integer idEstadistico = 0;
        try {
            tx = session.beginTransaction();
            idEstadistico = (Integer) session.save(estadistico);
            tx.commit();
        } catch (HibernateException e) {
            if (tx != null) {
                tx.rollback();
            }
            e.printStackTrace();
        } finally {
            session.close();
        }
        return idEstadistico;
    }

    @Override
    public Boolean checkMonthIsCalculated(Date date) {
        String sql = "SELECT * FROM `transaccionesprosa`.`estadistico` where fecha='" + new SimpleDateFormat("yyyy-MM-dd").format(date) + "'";
        Session session = SessionUtil1.getSession();

        session.beginTransaction();
        List monthCalcules = session.createSQLQuery(sql).list();
        session.getTransaction().commit();
        session.close();

        return monthCalcules.size() > 0;
    }

    @Override
    public Date getFirstTransaction() {
        String sql = "SELECT PRT_PROC_DTE as fecha FROM `prsa_rejected_txn` union all SELECT FECHA_PROCESO_TRANSAC as fecha FROM `prsa_txn_aceptadas` ORDER BY fecha ASC LIMIT 1";
        Session session = SessionUtil.getSession();

        session.beginTransaction();
        Date firstTransacctionDate = (Date) session.createSQLQuery(sql).uniqueResult();
        session.getTransaction().commit();
        session.close();
        Calendar cal = Calendar.getInstance();
        cal.setTime(firstTransacctionDate);
        cal.set(Calendar.DATE, 1);
        return cal.getTime();
    }

    @Override
    public Iterator getCantFechaByCode(String code, Date fromDate, Date toDate) {

        String sql = "SELECT prt_proc_dte,count(prt_proc_dte) FROM `transacciones`.`prsa_rejected_txn` where codigo_respuesta='" + code + "' and prt_proc_dte between '" + new SimpleDateFormat("yyyy-MM-dd").format(fromDate) + "'and '" + new SimpleDateFormat("yyyy-MM-dd").format(toDate) + "'  group by substring(prt_proc_dte,1,10)";
        String sql1 = "SELECT FECHA_PROCESO_TRANSAC,count(FECHA_PROCESO_TRANSAC) FROM `transacciones`.`prsa_txn_aceptadas` where CODIGO_RESPUESTA_AUT='" + code + "' and FECHA_PROCESO_TRANSAC between '" + new SimpleDateFormat("yyyy-MM-dd").format(fromDate) + "'and '" + new SimpleDateFormat("yyyy-MM-dd").format(toDate) + "' group by substring(FECHA_PROCESO_TRANSAC,1,10)";

        Session session = SessionUtil.getSession();

        session.beginTransaction();
        List listReject = session.createSQLQuery(sql).list();
        List listAccept = session.createSQLQuery(sql1).list();
        session.getTransaction().commit();
        session.close();

        listReject.addAll(listAccept);
        Iterator dateAndCant = listReject.iterator();

        return dateAndCant;
    }

    @Override
    public List<String> getCodigo() {
        String sql = "SELECT codigo_respuesta  FROM `transacciones`.`prsa_rejected_txn` group by (codigo_respuesta);";
        String sql1 = "SELECT CODIGO_RESPUESTA_AUT  FROM `transacciones`.`prsa_txn_aceptadas` group by (CODIGO_RESPUESTA_AUT);";
        Session session = SessionUtil.getSession();

        session.beginTransaction();
        List<String> codes = session.createSQLQuery(sql).list();
        List<String> codes1 = session.createSQLQuery(sql1).list();
        session.getTransaction().commit();

        session.close();
        for (String code : codes1) {
            if (codes.indexOf(code) == -1) {
                codes.add(code);
            }
        }
        return codes;
    }

}
