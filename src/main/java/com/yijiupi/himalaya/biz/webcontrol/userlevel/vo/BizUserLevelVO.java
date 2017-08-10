/**   
 * Copyright © 2017 北京易酒批电子商务有限公司. All rights reserved.
 */
package com.yijiupi.himalaya.biz.webcontrol.userlevel.vo;

import java.io.Serializable;
import java.util.Date;

/**
 * TODO
 * @author lipan
 * @date 2017年8月10日 上午10:29:56
 */
public class BizUserLevelVO implements Serializable {
	
	/**
	 * TODO
	 */
	private static final long serialVersionUID = 1L;
	
	private Integer id;
	
	private String levelName;
	
	private Integer sequence;
	
	public Integer getId() {
		return id;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public String getLevelName() {
		return levelName;
	}
	
	public void setLevelName(String levelName) {
		this.levelName = levelName;
	}
	
	public Integer getSequence() {
		return sequence;
	}
	
	public void setSequence(Integer sequence) {
		this.sequence = sequence;
	}
}
