import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger'
import { BaseValidationPipe } from '@app/common/pipes/base-validate.pipe'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // 处理跨域
  app.enableCors()

  // 指定全局管道
  app.useGlobalPipes(new BaseValidationPipe())

  // swagger 文档
  const options = new DocumentBuilder()
    .setTitle('优惠卷管理员平台后台接口文档')
    .setDescription('The Nest Project ')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, options)

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      // 刷新保留授权token
      persistAuthorization: true,
    },
    customSiteTitle: '优惠卷管理员平台后台接口文档',
  }
  SwaggerModule.setup('api-docs', app, document, customOptions)

  // 引入依赖端口
  const PORT = process.env.ADMIN_PORT || 3099
  await app.listen(PORT)
  console.log(`server is running port at ${PORT}`)
}
bootstrap()
