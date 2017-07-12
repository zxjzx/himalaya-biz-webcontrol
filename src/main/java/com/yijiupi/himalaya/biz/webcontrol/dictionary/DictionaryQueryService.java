/*
 * Copyright © 2016 北京易酒批电子商务有限公司. All rights reserved.
 */
package com.yijiupi.himalaya.biz.webcontrol.dictionary;

import org.springframework.stereotype.Service;

import com.alibaba.dubbo.config.annotation.Reference;
import com.yijiupi.himalaya.biz.webcontrol.dictionary.vo.DictionaryTypeVO;
import com.yijiupi.himalaya.trading.setting.domain.dictionary.DictionaryType;
import com.yijiupi.himalaya.trading.setting.service.IDictionaryTypeService;

@Service
public class DictionaryQueryService {

	@Reference
	private IDictionaryTypeService dictionaryTypeService;

	public DictionaryTypeVO getDictionaryType(String typeCode) {
		DictionaryType model = dictionaryTypeService.getDictionaryTypeDetailByCode(typeCode);
		if (model == null) {
			return null;
		}
		DictionaryTypeVO vo = new DictionaryTypeVO(model);
		return vo;
	}
}
