import { Injectable } from '@nestjs/common';
import {UserModel} from "libs/db/models/user.model";
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import {ResponseResult} from "@app/common/Results/response.result";
import {ResultCode} from "@app/common/Results/code.result";
import {AuthAdminDto} from "./dtos/auth-admin.dto";
import {ChangeLevelDto} from "./dtos/change-level.dto";
import { myTryCatch } from '@app/common/Utils/tool';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(UserModel) private readonly userModel: ReturnModelType<typeof UserModel>,
    private JwtService: JwtService,
  ) {}

  async login(user) {

    // 拿到 用户 id 生成 token
    const token = this.JwtService.sign({ id: String(user._id) }, {
      // 设置时间 24 小时
      expiresIn: 60 * 60 * 24
    })

    return new ResponseResult(ResultCode.success, { token, userInfo: user }, '登录成功')
  }

  async register(payload) {
    let { account, tel, psw, code } = payload
    tel = String(tel).trim()
    try {
      if (tel.length !== 11) return new ResponseResult(ResultCode.params, {}, '请正确输入手机号')
      // 判断验证码是否为 注册操作
      if (code != '200') return new ResponseResult(ResultCode.params, {}, 'code 必须为 200')
      // 判断有没有 这个用户
      const user = await this.userModel.findOne({
        $or: [
          {account: account}, {tel:tel}
        ]
      })
      if (user) {
        return new ResponseResult(ResultCode.other, null, '用户名或者手机号重复')
      }

      let createData = {
        account, tel, psw,
        type: '0',
        nickname: account,
        sex: '-1',
        audit: '1'
      }

      await this.userModel.create(createData)

      return new ResponseResult(ResultCode.success, null, '注册成功')

    } catch (e) {
      return new ResponseResult(ResultCode.other, null, e.message)
    }
  }

  async userInfo(userInfo) {
    return new ResponseResult<UserModel>(200, userInfo, '获取用户信息成功')
  }

}
