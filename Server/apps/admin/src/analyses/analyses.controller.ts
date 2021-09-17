import { Controller, Post, Delete, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport';

import { AnalysesService } from './analyses.service'
import {UserDocumentType} from "libs/db/models/user.model";
import {CurrentUser} from "@app/common/ParamDecorators/user.decorator";


@ApiTags('分析页相关接口')
@Controller('analyses')
export class AnalysesController {
  constructor(
    private readonly AnalysesService: AnalysesService
  ) { }

  @Get('topData')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin_jwt'))
  @ApiOperation({ summary: '获取头部卡片数据' })
  async fetchTopCardData(@CurrentUser('') userInfo: UserDocumentType): Promise<any> {
    return await this.AnalysesService.fetchTopCardData(userInfo._id)
  }

  @Get('articleGroup')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin_jwt'))
  @ApiOperation({ summary: '获取文章分组数据' })
  async fetchArticleGroupData(@CurrentUser('') userInfo: UserDocumentType): Promise<any> {
    return await this.AnalysesService.fetchArticleGroupData(userInfo._id)
  }

  @Get('userArticle')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin_jwt'))
  @ApiOperation({ summary: '获取用户文章发表概览数据' })
  async fetchUserArticle(@CurrentUser('') userInfo: UserDocumentType): Promise<any> {
    return await this.AnalysesService.fetchUserArticle(userInfo._id)
  }
}
