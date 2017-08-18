/*
 * Copyright © 2017 北京易酒批电子商务有限公司. All rights reserved.
 */
package com.yijiupi.himalaya.biz.webcontrol.category;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yijiupi.himalaya.biz.webcontrol.consts.WebConstant;
import com.yijiupi.himalaya.biz.webcontrol.pagemodel.BaseResult;
import com.yijiupi.himalaya.biz.webcontrol.pagemodel.ListResult;
import com.yijiupi.himalaya.masterdata.productcategory.domain.DisplayCategoryWithChild;
import com.yijiupi.himalaya.masterdata.productcategory.domain.StatisticsCategoryWithChild;

/**
 * Description: 类目查询控制器
 * @author lipan
 * @date 2017年4月11日 上午10:48:14
 */
@RestController
public class CategoryBizCtrlQueryController {

	@Autowired
	private CategoryBizCtrlQueryService categoryQueryService;

	/**
	 * 根据会员展示类别查询所有类目及其子类目
	 * @param bizUserDisplayClass 会员展示类别
	 * @return 所有类目及其子类目
	 */
	@RequestMapping(value = "/templates/bizwebcontrol/category/listDisplayCategoryWithChildNoBrand/{bizUserDisplayClass}" ,method = RequestMethod.POST)
	public BaseResult listDisplayCategoryWithChildNoBrand(@PathVariable("bizUserDisplayClass") Integer bizUserDisplayClass){
		List<DisplayCategoryWithChild> displayCategoryWithChildList = categoryQueryService.listDisplayCategoryWithChildNoBrand(bizUserDisplayClass);
		ListResult<DisplayCategoryWithChild> result = new ListResult<>(displayCategoryWithChildList);
		result.setResult(WebConstant.RESULT_SUCCESS);
		return result ;
	}
	
	/**
	 * 查询所有类目及其子类目
	 * @return 所有类目及其子类目
	 */
	@RequestMapping(value="/templates/bizwebcontrol/category/listStatisticsCategoryWithChild" , method = RequestMethod.GET)
	public BaseResult listStatisticsCategoryWithChild(){
		List<StatisticsCategoryWithChild> statisticsCategoryWithChildList = categoryQueryService.listStatisticsCategoryWithChild();
		ListResult<StatisticsCategoryWithChild> result = new ListResult<>(statisticsCategoryWithChildList);
		result.setResult(WebConstant.RESULT_SUCCESS);
		return result ;
	}
}
