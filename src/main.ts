import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Pipe = A middleware that runs before your controller and checks/modifies incoming data.
  // It ensures that every incoming request body is automatically validated before it reaches your controllers.
  //It checks and cleans the data first
  app.useGlobalPipes(
    //means the pipe will apply to all controllers and routes globally.
    new ValidationPipe(
      // It validates DTO classes
      {
        whitelist:true, //🔐 Prevents unwanted or malicious fields.
        forbidNonWhitelisted:true, //👉 Instead of silently removing extra fields, it throws an error.
        transform:true,//👉 Automatically converts request data to the DTO type.
      disableErrorMessages:true //If validation fails, just say Bad Request. Don’t explain why
      }
    )
  )
// This configuration:
//✅ Cleans request body
// ✅ Blocks unwanted fields
// ✅ Converts types automatically
// ✅ Increases security
// ✅ Prevents bugs

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
