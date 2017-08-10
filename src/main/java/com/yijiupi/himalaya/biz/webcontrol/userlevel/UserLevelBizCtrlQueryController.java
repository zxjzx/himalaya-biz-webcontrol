/**   
 * Copyright © 2017 北京易酒批电子商务有限公司. All rights reserved.
 */
package com.yijiupi.himalaya.biz.webcontrol.userlevel;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yijiupi.himalaya.biz.webcontrol.consts.WebConstant;
import com.yijiupi.himalaya.biz.webcontrol.pagemodel.BaseResult;
import com.yijiupi.himalaya.biz.webcontrol.pagemodel.ListResult;
import com.yijiupi.himalaya.biz.webcontrol.userlevel.vo.BizUserLevelVO;

/**  
 * 会员等级接口
 * @author lipan
 * @date 2017年8月10日 上午10:20:48  
 */
@RestController
public class UserLevelBizCtrlQueryController {
	@Autowired 
	private UserLevelBizCtrlQueryService userLevelBizCtrlQueryService ;
	
	@RequestMapping(value = "/templates/bizwebcontrol/bizuserLevel/findBizUserLevelList", method = RequestMethod.GET)
	public BaseResult findBizUserLevelList(){
		List<BizUserLevelVO> voList = userLevelBizCtrlQueryService.findBizUserLevelList();
		ListResult<BizUserLevelVO> result = new ListResult<>(voList);
		result.setResult(WebConstant.RESULT_SUCCESS);
		return result;
	}
	
}
