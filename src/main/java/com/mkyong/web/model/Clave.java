package com.mkyong.web.model;
// Generated 16/05/2017 05:57:37 PM by Hibernate Tools 4.3.1


import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * Clave generated by hbm2java
 */
@Entity
@Table(name="clave"
    ,catalog="transaccionesprosa"
)
public class Clave  implements java.io.Serializable {


     private Integer idC;
     private String elemento;
     private String type;
     private Set<Estadistico> estadisticos = new HashSet<Estadistico>(0);

    public Clave() {
    }

	
    public Clave(String elemento, String type) {
        this.elemento = elemento;
        this.type = type;
    }
    public Clave(String elemento, String type, Set<Estadistico> estadisticos) {
       this.elemento = elemento;
       this.type = type;
       this.estadisticos = estadisticos;
    }
   
     @Id @GeneratedValue(strategy=IDENTITY)

    
    @Column(name="idC", unique=true, nullable=false)
    public Integer getIdC() {
        return this.idC;
    }
    
    public void setIdC(Integer idC) {
        this.idC = idC;
    }

    
    @Column(name="elemento", nullable=false, length=30)
    public String getElemento() {
        return this.elemento;
    }
    
    public void setElemento(String elemento) {
        this.elemento = elemento;
    }

    
    @Column(name="type", nullable=false, length=20)
    public String getType() {
        return this.type;
    }
    
    public void setType(String type) {
        this.type = type;
    }

@OneToMany(fetch=FetchType.LAZY, mappedBy="clave")
@JsonManagedReference
    public Set<Estadistico> getEstadisticos() {
        return this.estadisticos;
    }
    
    public void setEstadisticos(Set<Estadistico> estadisticos) {
        this.estadisticos = estadisticos;
    }




}


