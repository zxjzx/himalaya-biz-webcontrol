package com.yijiupi.himalaya.biz.webcontrol.jiupicitymultitree;

import java.util.List;

import org.springframework.stereotype.Service;

import com.alibaba.dubbo.config.annotation.Reference;
import com.yijiupi.himalaya.masterdata.adminuser.dto.ProvinceAllCitiesDTO;
import com.yijiupi.himalaya.masterdata.adminuser.service.IJiupiCityService;

@Service
public class JiupiCityMultiTreeQueryService {

	@Reference
	private IJiupiCityService iJiupiCityService;

	public List<ProvinceAllCitiesDTO> listProvinceAllCitiesDTO(Integer cityMode) {
		return iJiupiCityService.listProvinceAllCitiesDTO(cityMode);
	}
}
