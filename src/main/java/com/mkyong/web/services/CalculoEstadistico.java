/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mkyong.web.services;

import java.util.ArrayList;

/**
 *
 * @author ProasEvolution
 */
public class CalculoEstadistico {

    private ArrayList<Integer> x;
    private int n;

    public CalculoEstadistico(ArrayList<Integer> datos) {
        x = datos;
        n = datos.size();
    }

    public double valorMedio() {
        double suma = 0;
        for (int i = 0; i < n; i++) {
            suma += x.get(i);
        }
        return suma / n;
    }

    public double desviacionMedia() {
        double suma = 0;
        double media = valorMedio();
        for (int i = 0; i < n; i++) {
            suma += Math.abs(x.get(i) - media);
        }
        return suma / n;
    }

    public double desviacionCuadratica() {
        double suma = 0;
        double media = valorMedio();
        for (int i = 0; i < n; i++) {
            suma += (x.get(i) - media) * (x.get(i) - media);
        }
        return Math.sqrt(suma / n);
    }

    public String toString() {
        String texto = "";
        for (int i = 0; i < n; i++) {
            texto += "\t" + x.get(i);
        }
        texto += "\n";
        return texto;
    }
}
