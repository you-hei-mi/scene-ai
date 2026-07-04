import { Module } from "@nestjs/common";

import { StudioModule } from "./studio/studio.module";

@Module({
    imports: [StudioModule],
    exports: [StudioModule],
})
export class AppModule {}
