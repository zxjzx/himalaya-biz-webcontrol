/*
 * Copyright © 2017 北京易酒批电子商务有限公司. All rights reserved.
 */
package com.yijiupi.himalaya.biz.webcontrol.dictionary;

import com.yijiupi.himalaya.trading.setting.domain.dictionary.DictionaryType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.yijiupi.himalaya.biz.webcontrol.consts.WebConstant;
import com.yijiupi.himalaya.biz.webcontrol.dictionary.vo.DictionaryTypeVO;
import com.yijiupi.himalaya.biz.webcontrol.pagemodel.BaseResult;
import com.yijiupi.himalaya.biz.webcontrol.pagemodel.ROResult;

import java.util.List;
import java.util.Map;

/**
 * Description: 字典查询控制器
 * @author lipan
 * @date 2017年4月11日 上午10:48:14
 */
@RestController
public class DictionaryBizCtrlQueryController {

	@Autowired
	private DictionaryBizCtrlQueryService dictionaryQueryService;

	/**
	 * 根据字典类型编码获取详情
	 */
	@RequestMapping(value = "/templates/bizwebcontrol/dictionary/getDictionaryType/{typeCode}", method = RequestMethod.GET)
	public BaseResult getDictionaryType(@PathVariable("typeCode") String typeCode) {
		DictionaryTypeVO vo = dictionaryQueryService.getDictionaryType(typeCode);
		ROResult<DictionaryTypeVO> result = new ROResult<DictionaryTypeVO>();
		result.setData(vo);
		result.setResult(WebConstant.RESULT_SUCCESS);
		return result;
	}

	/**
	 * 根据字典类型编码获取字典详情Map
	 * @param codeList
	 * @return
	 */
	@RequestMapping(value = "/templates/bizwebcontrol/dictionary/queryDictionaryTypeMapByCodeList", method = RequestMethod.POST)
	public BaseResult getDictionaryType(@RequestBody List<String> codeList) {
		Map<String, DictionaryType> stringDictionaryTypeMap = dictionaryQueryService.queryDictionaryTypeMapByCodeList(codeList);
		ROResult result = new ROResult<DictionaryTypeVO>();
		result.setData(stringDictionaryTypeMap);
		result.setResult(WebConstant.RESULT_SUCCESS);
		return result;
	}

}
