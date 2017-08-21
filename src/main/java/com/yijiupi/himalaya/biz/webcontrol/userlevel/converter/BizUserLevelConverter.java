/**   
 * Copyright © 2017 北京易酒批电子商务有限公司. All rights reserved.
 */
package com.yijiupi.himalaya.biz.webcontrol.userlevel.converter;

import java.util.ArrayList;
import java.util.List;

import com.alibaba.dubbo.common.utils.CollectionUtils;
import com.yijiupi.himalaya.biz.webcontrol.userlevel.vo.BizUserLevelVO;
import com.yijiupi.himalaya.trading.setting.domain.bizuserlevel.BizUserLevel;

/**  
 * 会员等级转换类
 * @author lipan
 * @date 2017年8月10日 上午10:49:23  
 */
public class BizUserLevelConverter {
	
	private BizUserLevelConverter(){}
	
	public static List<BizUserLevelVO> toVOList(List<BizUserLevel> dataList){
		List<BizUserLevelVO> voList = null;
		if (CollectionUtils.isNotEmpty(dataList)) {
			voList = new ArrayList<>();
			for (BizUserLevel bizUserLevel : dataList) {
				voList.add(toVO(bizUserLevel));
			}
		}
		return  voList ;
	}
	
	public static BizUserLevelVO toVO(BizUserLevel bizUserLevel){
		BizUserLevelVO vo = new BizUserLevelVO() ;
		vo.setId(bizUserLevel.getId());
		vo.setLevelName(bizUserLevel.getLevelName());
		return vo ;
	}
	
}
