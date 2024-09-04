package com.lead.entity;

import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "Category3")
public class Category3 {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "category3_id", nullable = false)
	private Integer category3Id;

	@Column(name = "category3_name", nullable = false)
	private String category3Name;

	@ManyToOne
	@JoinColumn(name = "category2_id", nullable = false)
	private Category2 category2;

	@OneToMany(mappedBy = "category3")
	private Set<Items> items;

}
