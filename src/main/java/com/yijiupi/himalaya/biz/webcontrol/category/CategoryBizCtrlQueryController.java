/*
 * Copyright © 2017 北京易酒批电子商务有限公司. All rights reserved.
 */
package com.yijiupi.himalaya.biz.webcontrol.category;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yijiupi.himalaya.biz.webcontrol.category.vo.CascadeProductCategoryVO;
import com.yijiupi.himalaya.biz.webcontrol.consts.WebConstant;
import com.yijiupi.himalaya.biz.webcontrol.pagemodel.BaseResult;
import com.yijiupi.himalaya.biz.webcontrol.pagemodel.ROResult;

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
	 * 获取所有类目和子类目(结果集拼装为前端要求的形式,用于前段的二级联动)
	 * @return
	 * @auth wangran
	 * @since 2016年5月12日下午2:29:50 throws
	 */
	@RequestMapping(value = "/templates/bizwebcontrol/category/findAllCategoryList/{categoryClass}", method = RequestMethod.POST)
	public BaseResult findAllCategoryList(@PathVariable("categoryClass") Integer categoryClass) {
		CascadeProductCategoryVO ro = categoryQueryService.findAllCategoryList(categoryClass);
		ROResult<CascadeProductCategoryVO> result = new ROResult<CascadeProductCategoryVO>();
		result.setData(ro);
		result.setResult(WebConstant.RESULT_SUCCESS);
		return result;
	}
}
