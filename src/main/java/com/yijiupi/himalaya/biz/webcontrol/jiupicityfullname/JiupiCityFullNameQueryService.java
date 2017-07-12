package com.yijiupi.himalaya.biz.webcontrol.jiupicityfullname;

import java.util.List;

import org.springframework.stereotype.Service;

import com.alibaba.dubbo.config.annotation.Reference;
import com.yijiupi.himalaya.masterdata.adminuser.domain.org.JiupiCity;
import com.yijiupi.himalaya.masterdata.adminuser.service.IJiupiCityService;

@Service
public class JiupiCityFullNameQueryService {

	@Reference
	private IJiupiCityService iJiupiCityService;

	/**
	 * 获取所有启用的酒批城市列表
	 * @return
	 */
	public List<JiupiCity> findAllJiupiCityList() {
		return iJiupiCityService.findAllJiupiCityList();
	}
}
