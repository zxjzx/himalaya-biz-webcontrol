/*
 * Copyright © 2016 北京易酒批电子商务有限公司. All rights reserved.
 */
package com.yijiupi.himalaya.biz.webcontrol.category.vo;

import java.io.Serializable;
import java.util.List;

public class CascadeProductCategoryVO implements Serializable {

	private static final long serialVersionUID = 1L;

	// region 属性设置
	private List<CategoryItem> menuData;

	// endregion
	public CascadeProductCategoryVO(List<CategoryItem> menuData) {
		this.menuData = menuData;
	}

	public List<CategoryItem> getMenuData() {
		return menuData;
	}
}
