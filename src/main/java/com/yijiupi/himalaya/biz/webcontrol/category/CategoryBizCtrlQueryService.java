/*
 * Copyright © 2016 北京易酒批电子商务有限公司. All rights reserved.
 */
package com.yijiupi.himalaya.biz.webcontrol.category;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.alibaba.dubbo.common.utils.CollectionUtils;
import com.alibaba.dubbo.config.annotation.Reference;
import com.yijiupi.himalaya.biz.webcontrol.category.vo.CascadeProductCategoryVO;
import com.yijiupi.himalaya.biz.webcontrol.category.vo.CategoryItem;
import com.yijiupi.himalaya.masterdata.productcategory.domain.DisplayCategoryWithChild;
import com.yijiupi.himalaya.masterdata.productcategory.domain.ProductCategory;
import com.yijiupi.himalaya.masterdata.productcategory.domain.StatisticsCategoryWithChild;
import com.yijiupi.himalaya.masterdata.productcategory.service.IDisplayCategoryQueryService;
import com.yijiupi.himalaya.masterdata.productcategory.service.IProductCategoryQueryService;
import com.yijiupi.himalaya.masterdata.productcategory.service.IStatisticsCategoryQueryService;

@Service
public class CategoryBizCtrlQueryService {

	@Reference
	private IProductCategoryQueryService iProductCategoryQueryService;
	
	@Reference
	private IDisplayCategoryQueryService iDisplayCategoryQueryService;
	
	@Reference
	private IStatisticsCategoryQueryService iStatisticsCategoryQueryService ;
	
	/**
	 * 获取产品类目下的所有一级二级产品类目,主要用做查询条件
	 * @param categoryClass 0酒批 1掌批 2招商
	 * @return
	 */
	public CascadeProductCategoryVO findAllCategoryList(Integer categoryClass) {
		List<ProductCategory> modelList = iProductCategoryQueryService.findAllCategoryList(categoryClass);
		List<CategoryItem> result = new ArrayList<CategoryItem>();
		if (CollectionUtils.isNotEmpty(modelList)) {
			for (ProductCategory model : modelList) {
				CategoryItem data = new CategoryItem(model.getId().toString(), model.getName());
				if (CollectionUtils.isNotEmpty(model.getChildCategoryList())) {
					for (ProductCategory m : model.getChildCategoryList()) {
						data.addLevel(new CategoryItem(m.getId().toString(), m.getName()));
					}
				}
				result.add(data);
			}
		}
		CascadeProductCategoryVO ro = new CascadeProductCategoryVO(result);
		return ro;
	}
	
	public List<DisplayCategoryWithChild> listDisplayCategoryWithChild(Integer bizUserDisplayClass){
		List<DisplayCategoryWithChild> displayCategoryWithChildList = iDisplayCategoryQueryService.listDisplayCategoryWithChild(bizUserDisplayClass);
		return displayCategoryWithChildList ;
	}
	
	public List<StatisticsCategoryWithChild> listStatisticsCategoryWithChild(){
		List<StatisticsCategoryWithChild> statisticsCategoryWithChildList = iStatisticsCategoryQueryService.listStatisticsCategoryWithChild();
		return statisticsCategoryWithChildList ;
	}
	
}
