import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType, DocumentType } from '@typegoose/typegoose'
import {IUserType, MenuModel} from "libs/db/models/menu.model";
import {ResultCode} from "@app/common/Results/code.result";
import {ResponseResult} from "@app/common/Results/response.result";
import {CreateMenuDto} from "./dtos/create-menu.dto";
import {UpdateMenuDto} from "./dtos/update-menu.dto";
import {SplitPageDto} from "@app/common/dtos/split-page.dto";

@Injectable()
export class MenusService {

  constructor(
    @InjectModel(MenuModel) private readonly model : ReturnModelType<typeof MenuModel>
  ) { }

  async useCreate(dto: CreateMenuDto) {
    try {
      const { auth, ...rest }  = dto
      if (auth.length === 0) {
        auth.push(IUserType.common)
      }

      const result = await this.model.create({auth, ...rest})

      return new ResponseResult(ResultCode.success, result, '添加成功')
    } catch (err) {
      console.log(err)
      return new ResponseResult(ResultCode.other, err, '添加失败')
    }
  }

  /** 删除本菜单，以及子菜单, 由于，我们前端会把 菜单变成树状，由前端负责比较好一些 */
  async useRemove(ids: string []) {
    try {
      for (let i = 0; i < ids.length; i++) {
        await this.model.findByIdAndRemove(ids[i])
      }

      return new ResponseResult(ResultCode.success, null, '删除菜单成功')

    } catch (err) {
      return new ResponseResult(ResultCode.other, err, '删除菜单发生错误')
    }
  }

  /** 修改菜单 */
  async useUpdate(dto: UpdateMenuDto) {
    try {
      const { id, parentId, topIds, ...rest } = dto

      const result = await this.model.findByIdAndUpdate(id, { ...rest})

      return new ResponseResult(ResultCode.success, result, '修改菜单成功')

    } catch (err) {
      return new ResponseResult(ResultCode.other, err, '修改菜单发生错误')
    }
  }

  /** 获取菜单列表 */
  async findMenus(payload: SplitPageDto) {
    try {
      let { pageNum, pageSize } = payload
      const start = (pageNum - 1) * pageSize
      let result = await this.model.find({})
        .limit(pageSize)
        .skip(start)
        .sort({index: 1})

      const count = await this.model.find().count()

      return new ResponseResult(ResultCode.success, {menus: result, count})
    } catch (err) {
      return new ResponseResult(ResultCode.other, err, '侧边栏菜单查找失败')
    }
  }

  /** 获取侧边栏菜单 */
  async findAsideMenus(userType: IUserType) {
    try {
      const auth: IUserType [] = [IUserType.common]
      if (userType === IUserType.admin) {
        auth.push(IUserType.admin)
      } else if (userType === IUserType.superAdmin) {
        auth.push(IUserType.superAdmin)
      }

      const result = await this.model.find({
        "$or":  auth.map((item => ({auth: item})))
      })

      return new ResponseResult(ResultCode.success, result)
    } catch (err) {
      return new ResponseResult(ResultCode.other, err, '侧边栏菜单查找失败')
    }
  }

  /** 获取菜单树数据 */
  async findMenuTree() {
    try {
      const menus = await this.model.find()
      const resultData = {
        common: [],
        admin: [],
        superAdmin: [],
      }

      /** 装箱操作 */
      menus.forEach(menu => {
        if (menu.auth.includes(IUserType.common)) {
          resultData.common.push(menu)
        }
        if (menu.auth.includes(IUserType.admin)) {
          resultData.admin.push(menu)
        }
        if (menu.auth.includes(IUserType.superAdmin)) {
          resultData.superAdmin.push(menu)
        }
      })

      return new ResponseResult(ResultCode.success, resultData)
    } catch (err) {
      return new ResponseResult(ResultCode.other, err, '菜单树查找失败')
    }

  }

}
