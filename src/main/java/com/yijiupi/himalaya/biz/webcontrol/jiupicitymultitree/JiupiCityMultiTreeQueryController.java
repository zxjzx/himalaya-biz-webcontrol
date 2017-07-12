package com.yijiupi.himalaya.biz.webcontrol.jiupicitymultitree;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yijiupi.himalaya.biz.webcontrol.consts.WebConstant;
import com.yijiupi.himalaya.biz.webcontrol.pagemodel.BaseResult;
import com.yijiupi.himalaya.biz.webcontrol.pagemodel.ListResult;
import com.yijiupi.himalaya.masterdata.adminuser.dto.ProvinceAllCitiesDTO;

@RestController
@RequestMapping("/templates/bizwebcontrol/jiupicitymultitree")
public class JiupiCityMultiTreeQueryController {

	@Autowired
	private JiupiCityMultiTreeQueryService jiupiCityFullNameQueryService;

	/**
	 * 获取所有的启用状态下的酒批城市集合
	 * @param cityMode 酒批城市运营模式 自营 加盟 轻加盟
	 * @return List<ProvinceAllCitiesDTO> 以省为单位获取省下面所有的酒批城市
	 * @return BaseResult
	 */
	@RequestMapping(value = "/listProvinceAllCitiesDTO/{cityMode}", method = RequestMethod.GET)
	public BaseResult listProvinceAllCitiesDTO(@PathVariable("cityMode") Integer cityMode) {
		List<ProvinceAllCitiesDTO> list = jiupiCityFullNameQueryService.listProvinceAllCitiesDTO(cityMode);
		ListResult<ProvinceAllCitiesDTO> result = new ListResult<>(list);
		result.setResult(WebConstant.RESULT_SUCCESS);
		return result;
	}
}
