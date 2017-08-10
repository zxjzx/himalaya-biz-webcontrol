/**   
 * Copyright © 2017 北京易酒批电子商务有限公司. All rights reserved.
 */
package com.yijiupi.himalaya.biz.webcontrol.userlevel;

import java.util.List;

import org.springframework.stereotype.Service;

import com.alibaba.dubbo.config.annotation.Reference;
import com.yijiupi.himalaya.base.search.PageList;
import com.yijiupi.himalaya.biz.webcontrol.userlevel.converter.BizUserLevelConverter;
import com.yijiupi.himalaya.biz.webcontrol.userlevel.vo.BizUserLevelVO;
import com.yijiupi.himalaya.trading.setting.domain.bizuserlevel.BizUserLevel;
import com.yijiupi.himalaya.trading.setting.service.IBizUserLevelService;

/**  
 * 会员等级
 * @author lipan
 * @date 2017年8月10日 上午10:21:15  
 */
@Service
public class UserLevelBizCtrlQueryService {
	
	@Reference
	private IBizUserLevelService iBizUserLevelService ;
	
	public List<BizUserLevelVO> findBizUserLevelList(){
		PageList<BizUserLevel> pageList = iBizUserLevelService.findBizUserLevelList() ;
		List<BizUserLevel> dataList = pageList.getDataList();
		return BizUserLevelConverter.toVOList(dataList);
	}
	
}
