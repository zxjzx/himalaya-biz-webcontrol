package com.yijiupi.himalaya.biz.webcontrol.jiupicityfullname;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yijiupi.himalaya.biz.webcontrol.pagemodel.BaseResult;
import com.yijiupi.himalaya.biz.webcontrol.pagemodel.ListResult;
import com.yijiupi.himalaya.masterdata.adminuser.domain.org.JiupiCity;

@RestController
@RequestMapping("/templates/bizwebcontrol/jiupicityfullname")
public class JiupiCityFullNameBizCtrlQueryController {

	@Autowired
	private JiupiCityFullNameBizCtrlQueryService jiupiCityFullNameQueryService;

	/**
	 * 获取所有启用的酒批城市列表
	 * @return
	 */
	@RequestMapping(value = "/findAllJiupiCityList", method = RequestMethod.GET)
	public BaseResult findAllJiupiCityList() {
		List<JiupiCity> jiupiCityList = jiupiCityFullNameQueryService.findAllJiupiCityList();
		ListResult<JiupiCity> result = new ListResult<>(jiupiCityList);
		return result;
	}
}
