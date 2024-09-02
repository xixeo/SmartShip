package com.lead.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Suppliers")
public class Suppliers {

	  @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name = "supplier_id")
	    private Integer supplierId;

	    @Column(name = "supplier_name", nullable = false)
	    private String supplierName;
}
