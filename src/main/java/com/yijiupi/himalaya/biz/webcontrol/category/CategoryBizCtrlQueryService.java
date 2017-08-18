/*
 * Copyright © 2016 北京易酒批电子商务有限公司. All rights reserved.
 */
package com.yijiupi.himalaya.biz.webcontrol.category;

import java.util.List;

import org.springframework.stereotype.Service;

import com.alibaba.dubbo.config.annotation.Reference;
import com.yijiupi.himalaya.masterdata.productcategory.domain.DisplayCategoryWithChild;
import com.yijiupi.himalaya.masterdata.productcategory.domain.StatisticsCategoryWithChild;
import com.yijiupi.himalaya.masterdata.productcategory.service.IDisplayCategoryQueryService;
import com.yijiupi.himalaya.masterdata.productcategory.service.IStatisticsCategoryQueryService;

@Service
public class CategoryBizCtrlQueryService {

	@Reference
	private IDisplayCategoryQueryService iDisplayCategoryQueryService;
	
	@Reference
	private IStatisticsCategoryQueryService iStatisticsCategoryQueryService ;
	
	public List<DisplayCategoryWithChild> listDisplayCategoryWithChildNoBrand(Integer bizUserDisplayClass){
		List<DisplayCategoryWithChild> displayCategoryWithChildList = iDisplayCategoryQueryService.listDisplayCategoryWithChildNoBrand(bizUserDisplayClass);
		return displayCategoryWithChildList ;
	}
	
	public List<StatisticsCategoryWithChild> listStatisticsCategoryWithChild(){
		List<StatisticsCategoryWithChild> statisticsCategoryWithChildList = iStatisticsCategoryQueryService.listStatisticsCategoryWithChild();
		return statisticsCategoryWithChildList ;
	}
	
}
