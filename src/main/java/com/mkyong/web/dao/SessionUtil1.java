/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mkyong.web.dao;

import javax.imageio.spi.ServiceRegistry;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;

/**
 *
 * @author Lianet
 */
public class SessionUtil1 {

    private static SessionUtil1 instance = new SessionUtil1();
    private SessionFactory sessionFactory;

    public static SessionUtil1 getInstance() {
        return instance;
    }

    private SessionUtil1() {

        Configuration cfg = new Configuration().configure("hibernate1.cfg.xml");
        StandardServiceRegistryBuilder sb = new StandardServiceRegistryBuilder();
        sb.applySettings(cfg.getProperties());
        StandardServiceRegistry standardServiceRegistry = sb.build();
        sessionFactory = cfg.buildSessionFactory(standardServiceRegistry);

    }

    public static Session getSession() {
        Session session = getInstance().sessionFactory.openSession();

        return session;
    }
}
