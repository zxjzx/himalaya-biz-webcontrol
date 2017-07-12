/*
 * Copyright © 2016 北京易酒批电子商务有限公司. All rights reserved.
 */
package com.yijiupi.himalaya.biz.webcontrol.category.vo;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class CategoryItem implements Serializable {

	private static final long serialVersionUID = 1L;

	private String id;

	private String label;

	private List<CategoryItem> level = new ArrayList<CategoryItem>();

	public CategoryItem() {
	}

	public CategoryItem(String id, String label) {
		this.id = id;
		this.label = label;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public List<CategoryItem> getLevel() {
		return level;
	}

	public void setLevel(List<CategoryItem> level) {
		this.level = level;
	}

	public void addLevel(CategoryItem item) {
		this.level.add(item);
	}
}
